from app.services.answer_engine import AnswerEngine

def clean_chunks(chunks):
    cleaned = []

    for chunk in chunks:
        text = chunk.strip().lower()

        if len(text) < 40:
            continue

        if any(word in text for word in ["chapter", "section"]):
            continue

        cleaned.append(chunk)

    return cleaned


def format_context(chunks):
    formatted = ""
    for i, chunk in enumerate(chunks):
        formatted += f"[Source {i+1}]\n{chunk}\n\n"
    return formatted


class RAGPipeline:
    def query(self, query: str):
        docs = self.retriever.retrieve(query)
        return self.llm.generate(query, docs)
    def __init__(self, retriever, llm=None):
        self.retriever = retriever
        self.llm = llm
        self.answer_engine = AnswerEngine()

    def run(self, user_query: str, use_llm: bool = True):
        chunks = self.retriever.retrieve(user_query)

        chunks = clean_chunks(chunks)
        chunks = chunks[:3]


        if not chunks:
            return {
                "answer": "No relevant information found.",
                "sources": [],
                "confidence": 0.0
            }

        context_text = format_context(chunks)

        # Always prepare fallback
        fallback_answer = self.answer_engine.generate(user_query, chunks)


        if use_llm and self.llm:
            try:
                llm_answer = self.llm.generate(user_query, context_text)

                return {
                    "answer": llm_answer,
                    "sources": chunks,
                    "confidence": 0.85
                }

            except Exception:
                print("LLM FAILED → USING FALLBACK")


        return {
            "answer": fallback_answer,
            "sources": chunks,
            "confidence": 0.5
        }