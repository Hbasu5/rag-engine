import numpy as np
import faiss

def build_index(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))
    return index


def keyword_score(query, text):
    stopwords = {"the", "is", "a", "an", "what", "about", "of", "in"}
    
    query_words = [w for w in query.lower().split() if w not in stopwords]
    text = text.lower()

    score = 0
    for word in query_words:
        if word in text:
            score += 2

    return score


def search(query, model, index, documents, k=5, threshold=1.2):
    query_embedding = model.encode([query])
    distances, indices = index.search(np.array(query_embedding), k)

    results = []
    for i, d in zip(indices[0], distances[0]):
        doc = documents[i]
        score = keyword_score(query, doc)

        if score == 0 and d > 0.9:
            continue

        if d < threshold:
            results.append((doc, d, score))

    results.sort(key=lambda x: (-x[2], x[1]))
    return results
