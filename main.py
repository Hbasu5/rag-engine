import os
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"

from app.chunking import chunk_text
from app.embedding import load_model, create_embeddings
from app.retrieval import build_index, search

# -----------------------------
# 1. LOAD MODEL
# -----------------------------
model = load_model()

# -----------------------------
# 2. RAW DATA
# -----------------------------
raw_text = """
The sun is a star that produces energy through nuclear fusion.
It is the center of our solar system.
Python is a programming language used for AI and web development.
Artificial Intelligence is the simulation of human intelligence in machines.
"""

# -----------------------------
# 3. CHUNKING
# -----------------------------
documents = chunk_text(raw_text)

# -----------------------------
# 4. EMBEDDINGS
# -----------------------------
embeddings = create_embeddings(model, documents)

# -----------------------------
# 5. INDEX
# -----------------------------
index = build_index(embeddings)

# -----------------------------
# 6. CLI LOOP
# -----------------------------
while True:
    query = input("\nAsk something (or type 'exit'): ")

    if query.lower() == "exit":
        break

    results = search(query, model, index, documents)

    if not results:
        print("\nNo relevant results found.")
        continue

    print("\nTop Matches:\n")

    for text, dist, score in results:
        print(f"[Score: {score} | Distance: {dist:.2f}]")
        print("-", text)
        print()
