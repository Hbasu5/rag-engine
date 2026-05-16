from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi import UploadFile, File
import shutil

from app.core.retriever_engine import RetrieverEngine
from app.services.rag_pipeline import RAGPipeline
from app.llm.gemini import GeminiLLM
from app.retrieval.web.web_context_builder import build_web_context
from app.retrieval.hybrid.retrieval_planner import RetrievalPlanner
from app.retrieval.hybrid.retrieval_modes import RetrievalMode
from app.retrieval.hybrid.hybrid_retriever import HybridRetriever
from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    use_llm: bool = True
    web_search: bool = False
    max_results: int = 10

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def serve_ui():
    return FileResponse("index.html")

# 🔍 RETRIEVER
retriever = RetrieverEngine()
try:
    retriever.load("data")
except FileNotFoundError:
    print("No existing FAISS index found. Upload files to build one.")

# 🤖 LLM
api_key = os.getenv("GEMINI_API_KEY")
llm = GeminiLLM(api_key=api_key)

# 🚀 PIPELINE
rag = RAGPipeline(retriever=retriever, llm=llm)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    SUPPORTED_EXTENSIONS = (
        ".txt",
        ".md",
        ".png",
        ".jpg",
        ".jpeg",
        ".mp3",
        ".wav",
        ".m4a"
    )

    if not file.filename or not file.filename.lower().endswith(SUPPORTED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    save_path = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    # save uploaded file
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # rebuild index from uploads folder
    rag.retriever.build_from_folder("uploads")

    return {
        "message": f"{file.filename} uploaded successfully"
    }

@app.post("/query")
def query_rag(req: QueryRequest):
    has_local_documents = retriever.index is not None
    mode = RetrievalPlanner.decide(
        web_search=req.web_search,
        has_local_documents=has_local_documents
    )

    if mode == RetrievalMode.LOCAL:
        return rag.run(
            user_query=req.query,
            use_llm=req.use_llm,
            max_results=req.max_results
        )

    if mode == RetrievalMode.WEB:
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

    local_results = rag.run(
        user_query=req.query,
        use_llm=req.use_llm,
        max_results=req.max_results
    )
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

    return {
        "answer": (
            f"=== LOCAL KNOWLEDGE ===\n\n"
            f"{local_results['answer']}\n\n"
            f"=== WEB KNOWLEDGE ===\n\n"
            f"{web_context or 'No relevant web information found.'}"
        ),
        "sources": [*local_results.get("sources", []), *web_sources],
        "confidence": 0.90 if valid_sources else local_results.get("confidence", 0.5),
        "retrieval_mode": "hybrid",
        "merged_context": merged_context
    }
