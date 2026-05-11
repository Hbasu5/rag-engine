from fastapi import FastAPI
from fastapi.responses import FileResponse
import os
from fastapi import UploadFile, File
import shutil

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

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # only txt allowed for now
    if not file.filename.endswith(".txt"):
        return {"error": "Only .txt files supported"}

    save_path = f"uploads/{file.filename}"

    # save uploaded file
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # build new index from uploaded file
    rag.retriever.build_from_folder("uploads")

    return {
        "message": f"{file.filename} uploaded successfully"
    }

@app.post("/query")
def query_rag(req: QueryRequest):
    results = rag.run(user_query=req.query,use_llm=req.use_llm)

    return results
