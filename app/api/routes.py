from fastapi import APIRouter
from app.api.schemas import QueryRequest, QueryResponse

from app.services.rag_pipeline import RAGPipeline
from app.core.retriever_engine import RetrieverEngine
from app.llm.gemini import GeminiLLM
import os

router = APIRouter()
api_key = os.getenv("GEMINI_API_KEY")
retriever = RetrieverEngine()
retriever.load()
llm = GeminiLLM(api_key)

pipeline = RAGPipeline(retriever=retriever, llm=llm)


@router.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    result = pipeline.run(
        user_query=req.query,
        use_llm=req.use_llm
    )
    return result