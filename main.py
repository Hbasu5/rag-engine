from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

from app.core.retriever_engine import RetrieverEngine
from app.services.rag_pipeline import RAGPipeline
from app.llm.gemini import GeminiLLM
from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    use_llm: bool = True

app = FastAPI()

@app.get("/")
def serve_ui():
    return FileResponse("index.html")

# 🔍 RETRIEVER
retriever = RetrieverEngine()
retriever.load("data")

# 🤖 LLM
api_key = os.getenv("GEMINI_API_KEY")
llm = GeminiLLM(api_key=api_key)

# 🚀 PIPELINE
rag = RAGPipeline(retriever=retriever, llm=llm)

@app.post("/query")
def query_rag(req: QueryRequest):
    results = rag.query(req.query)

    return {
        "answer": str(results),
        "sources": [],
        "confidence": 0.9
    }