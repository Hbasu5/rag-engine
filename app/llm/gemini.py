from google import genai
from app.llm.base import BaseLLM


class GeminiLLM(BaseLLM):
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def generate(self, query: str, context: str) -> str:
        prompt = f"""
You are a precise and factual assistant.

Answer the question using ONLY the relevant information from the context.

Ignore unrelated or noisy information.

If the context is insufficient, say: "Not enough information."

Context:
{context}

Question:
{query}

Give a clean, structured answer.
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config={
                "max_output_tokens": 300,
                "temperature": 0.2,
            }
        )
        print("LLM Called")
        return response.text