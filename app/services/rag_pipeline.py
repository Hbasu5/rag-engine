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

    # =========================
    # RETRIEVAL STAGE
    # =========================
    def retrieve_chunks(
        self,
        user_query: str,
        limit: int = 10
    ):

        chunks = self.retriever.retrieve(user_query)

        chunks = clean_chunks(chunks)
        chunks = chunks[:limit]

        return chunks

    # =========================
    # GENERATION STAGE
    # =========================
    def generate_answer(
        self,
        user_query: str,
        chunks,
        use_llm: bool = True
    ):

        if not chunks:
            return {
                "answer": "No relevant information found.",
                "sources": [],
                "confidence": 0.0,
                "mode": "none"
            }

        context_text = format_context(chunks)

        if use_llm and self.llm:

            try:

                llm_answer = self.llm.generate(
                    user_query,
                    context_text
                )

                return {
                    "answer": llm_answer,
                    "sources": chunks,
                    "confidence": 0.85,
                    "mode": "LLM"
                }

            except Exception:

                print("LLM FAILED, USING FALLBACK")

        fallback_answer = self.answer_engine.generate(
            user_query,
            chunks
        )

        return {
            "answer": fallback_answer,
            "sources": chunks,
            "confidence": 0.5,
            "mode": "Local"
        }

    # =========================
    # FULL PIPELINE
    # =========================
    def run(
        self,
        user_query: str,
        use_llm: bool = True,
        max_results: int = 10
    ):

        chunks = self.retrieve_chunks(
            user_query=user_query,
            limit=max_results
        )

        return self.generate_answer(
            user_query=user_query,
            chunks=chunks,
            use_llm=use_llm
        )