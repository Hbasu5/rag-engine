from app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline()

rag.build_from_folder("data/raw")

# 📂 Later runs
rag.load()

while True:
    q = input("\nAsk something (or type 'exit'): ")
    if q.lower() == "exit":
        break

    results = rag.query(q)

    for i, (text, dist, score) in enumerate(results, 1):
        print(f"\n{i}. {text.strip()}\n")