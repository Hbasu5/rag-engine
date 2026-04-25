from app.core.embeddings import load_model
import os

from app.core.retriever_engine import RetrieverEngine
from app.services.rag_pipeline import RAGPipeline
from app.llm.gemini import GeminiLLM


retriever = RetrieverEngine()
retriever.load("data")


api_key = os.getenv("GEMINI_API_KEY")
print("API KEY LOADED:", api_key is not None)

llm = GeminiLLM(api_key=api_key)


rag = RAGPipeline(
    retriever=retriever,
    llm=llm
)

# 📂 Later runs
# rag.load()

while True:
	try:
	    q = input("\nAsk something (or type 'exit'): ")
	    if q.lower() == "exit":
	        break

	    results = rag.query(q)
	    print("\n-----ANSWER-----")
	    print(results)
	    print("-----------------\n")
	except KeyboardInterrupt:
	    print("\nExiting...")
	    break