from app.retrieval.hybrid.context_merger import ContextMerger


class HybridRetriever:

    @staticmethod
    def retrieve(
        local_chunks,
        web_chunks
    ):

        merged_context = ContextMerger.merge(
            local_chunks=local_chunks,
            web_chunks=web_chunks
        )

        return merged_context