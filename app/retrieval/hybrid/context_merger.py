class ContextMerger:

    @staticmethod
    def merge(
        local_chunks=None,
        web_chunks=None
    ):

        local_chunks = local_chunks or []
        web_chunks = web_chunks or []

        combined = []

        for chunk in local_chunks:
            combined.append({
                "source_type": "local",
                "content": chunk.page_content,
                "metadata": chunk.metadata
            })

        for chunk in web_chunks:
            combined.append({
                "source_type": "web",
                "content": chunk.get("content", ""),
                "metadata": {
                    "url": chunk.get("url"),
                    "title": chunk.get("title")
                }
            })

        return combined