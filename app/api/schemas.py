from pydantic import BaseModel
from typing import List


class QueryRequest(BaseModel):
    query: str
    use_llm: bool = True
    web_search: bool = False
    max_results: int = 10


class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float