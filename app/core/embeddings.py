_model = None

def load_model(path="./model/all-MiniLM-L6-v2"):
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(path)
        print("Embedding model loaded once")
    return _model

def create_embeddings(model, texts):
    return model.encode(texts)
