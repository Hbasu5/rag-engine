from app.core.embeddings import load_model
from app.core.chunking import chunk_text
from app.core.retriever import build_index, search_index
from app.storage.faiss_store import save_index, load_index
from app.ingestion.loader import load_documents


class RetrieverEngine:
    def __init__(self):
        self.model = load_model()
        self.index = None
        self.texts = None

    def build_from_folder(self, folder="data/raw"):

        documents = load_documents(folder)

        print("DOCUMENTS:", documents)

        chunks = []

        for doc in documents:

            print("DOC:", repr(doc))

            chunked = chunk_text(doc)

            print("CHUNKED:", chunked)

            chunks.extend(chunked)

        print("FINAL CHUNKS:", chunks)

        if not chunks:
            raise ValueError("No chunks generated.")

        embeddings = self.model.encode(chunks)

        print("EMBEDDINGS TYPE:", type(embeddings))
        print("EMBEDDINGS:", embeddings)

        self.index = build_index(embeddings)

        self.texts = chunks

        save_index(self.index, self.texts)

        print("Index built and saved.")

    def load(self, path="data"):
        self.index, self.texts = load_index(path)
        print("Index loaded.")

    def retrieve(self, question, k=5):
        query_vec = self.model.encode([question])
        results = search_index(query_vec, self.index, self.texts, question, k)
        return results
