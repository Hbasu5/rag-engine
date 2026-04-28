from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="Hybrid RAG API",
    version="1.0"
)

# attach routes
app.include_router(router)