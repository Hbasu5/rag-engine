import os
import faiss
import pickle


def save_index(index, texts, path="data"):
    os.makedirs(path, exist_ok=True)

    index_path = os.path.join(path, "faiss.index")
    meta_path = os.path.join(path, "metadata.pkl")

    # Save FAISS index
    faiss.write_index(index, index_path)

    # Save metadata (text chunks)
    with open(meta_path, "wb") as f:
        pickle.dump(texts, f)

    print(f"Index saved at {index_path}")


def load_index(path="data"):
    index_path = os.path.join(path, "faiss.index")
    meta_path = os.path.join(path, "metadata.pkl")

    if not os.path.exists(index_path) or not os.path.exists(meta_path):
        raise FileNotFoundError("FAISS index or metadata not found. Build first.")

    # Load FAISS index
    index = faiss.read_index(index_path)

    # Load metadata
    with open(meta_path, "rb") as f:
        texts = pickle.load(f)

    return index, texts
