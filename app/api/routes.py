from fastapi import APIRouter
from app.api.schemas import QueryRequest, QueryResponse

from app.services.rag_pipeline import RAGPipeline
from app.core.retriever_engine import RetrieverEngine
from app.llm.gemini import GeminiLLM

from app.retrieval.web.web_context_builder import build_web_context

from app.retrieval.hybrid.retrieval_planner import RetrievalPlanner
from app.retrieval.hybrid.retrieval_modes import RetrievalMode
from app.retrieval.hybrid.hybrid_retriever import HybridRetriever

import os


router = APIRouter()

api_key = os.getenv("GEMINI_API_KEY")

retriever = RetrieverEngine()

try:
    retriever.load("data")
except FileNotFoundError:
    print("⚠️ No existing FAISS index found.")

llm = GeminiLLM(api_key)

pipeline = RAGPipeline(
    retriever=retriever,
    llm=llm
)


@router.post("/query")
def query(req: QueryRequest):

    has_local_documents = retriever.index is not None

    planner = RetrievalPlanner()

    mode = planner.decide(
        web_search=req.web_search,
        has_local_documents=has_local_documents
    )

    print(f"🔍 Retrieval Mode: {mode}")

    # =========================
    # LOCAL RETRIEVAL
    # =========================
    if mode == RetrievalMode.LOCAL:

        result = pipeline.run(
            user_query=req.query,
            use_llm=req.use_llm
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
            "answer": web_context,
            "sources": web_sources,
            "confidence": 0.85
        }

    # =========================
    # HYBRID RETRIEVAL
    # =========================
    elif mode == RetrievalMode.HYBRID:

        # LOCAL RESULTS
        local_results = pipeline.run(
            user_query=req.query,
            use_llm=req.use_llm
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
            "sources": web_sources,
            "confidence": 0.90,
            "retrieval_mode": "hybrid",
            "merged_context": merged_context
        }