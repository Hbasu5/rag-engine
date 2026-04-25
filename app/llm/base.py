class BaseLLM:
    def generate(self, query: str, context: list[str]) -> str:
        raise NotImplementedError("LLM must implement generate()")