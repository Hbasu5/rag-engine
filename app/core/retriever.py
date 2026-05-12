import numpy as np
import faiss


def build_index(embeddings):
    embeddings = np.array(embeddings)
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))
    return index


def keyword_score(query, text):
    stopwords = {"the", "is", "a", "an", "what", "about", "of", "in"}

    query_words = [w for w in query.lower().split() if w not in stopwords]
    text_words = set(text.lower().split())

    score = 0
    for word in query_words:
        if word in text_words:
            score += 3  # stronger signal

    return score


def search_index(query_embedding, index, texts, query, k=5):
    distances, indices = index.search(np.array(query_embedding), k)

    results = []
    for i, d in zip(indices[0], distances[0]):
        text = texts[i]
        score = keyword_score(query, text)

        if score == 0 and d > 0.8:
            continue

        if d < 0.3:
            score += 2

        results.append({
            "text": text,
            "distance": float(d),
            "keyword_score": score
        })


    results.sort(key=lambda x: (-x["keyword_score"], x["distance"]))


    return [r["text"] for r in results]