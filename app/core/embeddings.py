from sentence_transformers import SentenceTransformer

def load_model(path="./model/all-MiniLM-L6-v2"):
    return SentenceTransformer(path)

def create_embeddings(model, texts):
    return model.encode(texts)
