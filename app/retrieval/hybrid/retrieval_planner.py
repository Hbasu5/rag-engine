from app.retrieval.hybrid.retrieval_modes import RetrievalMode


class RetrievalPlanner:

    @staticmethod
    def decide(
        web_search: bool,
        has_local_documents: bool
    ) -> RetrievalMode:

        if web_search and has_local_documents:
            return RetrievalMode.HYBRID

        if web_search:
            return RetrievalMode.WEB

        return RetrievalMode.LOCAL