class AnswerEngine:
    def generate(self, query, chunks):
        if not chunks:
            return "No relevant information found."

        answer = "📌 Key Points:\n\n"

        seen = set()

        for chunk in chunks:
            lines = chunk.split(".")
            for line in lines:
                line = line.strip()

                if len(line) < 30:
                    continue

                if line in seen:
                    continue

                seen.add(line)
                answer += f"- {line}.\n"

        return answer