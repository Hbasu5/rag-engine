from pydantic import BaseModel
from typing import List


class QueryRequest(BaseModel):
    query: str
    use_llm: bool = True


class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float