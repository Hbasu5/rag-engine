from fastapi import APIRouter, File, HTTPException, UploadFile
from app.api.schemas import QueryRequest

from app.services.rag_pipeline import RAGPipeline
from app.core.retriever_engine import RetrieverEngine
from app.llm.gemini import GeminiLLM

from app.retrieval.web.web_context_builder import build_web_context

from app.retrieval.hybrid.retrieval_planner import RetrievalPlanner
from app.retrieval.hybrid.retrieval_modes import RetrievalMode
from app.retrieval.hybrid.hybrid_retriever import HybridRetriever

import os
import shutil


router = APIRouter()

api_key = os.getenv("GEMINI_API_KEY")

retriever = RetrieverEngine()

try:
    retriever.load("data")
except FileNotFoundError:
    print("No existing FAISS index found.")

llm = GeminiLLM(api_key)

pipeline = RAGPipeline(
    retriever=retriever,
    llm=llm
)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    supported_extensions = (
        ".txt",
        ".md",
        ".png",
        ".jpg",
        ".jpeg",
        ".mp3",
        ".wav",
        ".m4a",
    )

    if not file.filename or not file.filename.lower().endswith(supported_extensions):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    os.makedirs("uploads", exist_ok=True)
    save_path = os.path.join("uploads", file.filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    retriever.build_from_folder("uploads")

    return {
        "message": f"{file.filename} uploaded successfully"
    }


@router.post("/query")
def query(req: QueryRequest):

    has_local_documents = retriever.index is not None

    planner = RetrievalPlanner()

    mode = planner.decide(
        web_search=req.web_search,
        has_local_documents=has_local_documents
    )

    print(f"Retrieval Mode: {mode}")

    # =========================
    # LOCAL RETRIEVAL
    # =========================
    if mode == RetrievalMode.LOCAL:

        result = pipeline.run(
            user_query=req.query,
            use_llm=req.use_llm,
            max_results=req.max_results
        )

        return result

    # =========================
    # WEB RETRIEVAL
    # =========================
    elif mode == RetrievalMode.WEB:

        web_context, valid_sources, web_sources = build_web_context(
            query=req.query,
            max_results=req.max_results
        )

        return {
            "answer": web_context or "No relevant web information found.",
            "sources": web_sources,
            "confidence": 0.85 if valid_sources else 0.0,
            "retrieval_mode": "web"
        }

    # =========================
    # HYBRID RETRIEVAL
    # =========================
    elif mode == RetrievalMode.HYBRID:

        # LOCAL RESULTS
        local_results = pipeline.run(
            user_query=req.query,
            use_llm=req.use_llm,
            max_results=req.max_results
        )

        # WEB RESULTS
        web_context, valid_sources, web_sources = build_web_context(
            query=req.query,
            max_results=req.max_results
        )

        merged_context = HybridRetriever.retrieve(
            local_chunks=[],
            web_chunks=[
                {
                    "content": web_context,
                    "url": source.get("url"),
                    "title": source.get("title")
                }
                for source in web_sources
            ]
        )

        combined_answer = (
            f"=== LOCAL KNOWLEDGE ===\n\n"
            f"{local_results['answer']}\n\n"
            f"=== WEB KNOWLEDGE ===\n\n"
            f"{web_context}"
        )

        return {
            "answer": combined_answer,
            "sources": [*local_results.get("sources", []), *web_sources],
            "confidence": 0.90 if valid_sources else local_results.get("confidence", 0.5),
            "retrieval_mode": "hybrid",
            "merged_context": merged_context
        }
