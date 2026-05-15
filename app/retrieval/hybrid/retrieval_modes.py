from enum import Enum


class RetrievalMode(str, Enum):
    LOCAL = "local"
    WEB = "web"
    HYBRID = "hybrid"