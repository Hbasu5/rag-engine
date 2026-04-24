from app.core.embeddings import load_model
from app.core.chunking import chunk_text
from app.core.retriever import build_index, search_index
from app.storage.faiss_store import save_index, load_index
from app.ingestion.loader import load_documents


class RAGPipeline:
    def __init__(self):
        self.model = load_model()
        self.index = None
        self.texts = None

    def build_from_folder(self, folder="data/raw"):
        documents = load_documents(folder)

        chunks = []
        for doc in documents:
            chunks.extend(chunk_text(doc))

        embeddings = self.model.encode(chunks)

        self.index = build_index(embeddings)
        self.texts = chunks

        save_index(self.index, self.texts)

        print("✅ Index built and saved.")

    # 📂 Load existing index
    def load(self, path="data"):
        self.index, self.texts = load_index(path)
        print("✅ Index loaded.")

    # 🔍 Query
    def query(self, question, k=5):
        query_vec = self.model.encode([question])

        results = search_index(query_vec, self.index, self.texts, question, k)

        return results