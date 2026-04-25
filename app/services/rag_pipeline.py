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
    def __init__(self, retriever, llm=None):
        self.retriever = retriever
        self.llm = llm
        self.answer_engine = AnswerEngine()

    def query(self, user_query: str):
        chunks = self.retriever.retrieve(user_query)

        chunks = clean_chunks(chunks)
        chunks = chunks[:3]

        context_text = format_context(chunks)

        fallback = self.answer_engine.generate(user_query, chunks)

        if self.llm:
            try:
                context_text = format_context(chunks)
                return self.llm.generate(user_query, context_text)
            except:
                print("LLM UNAVAILABLE! USING FALLBACK MEASURES...")

        return fallback