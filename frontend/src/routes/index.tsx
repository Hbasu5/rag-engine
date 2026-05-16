import { createFileRoute } from "@tanstack/react-router";
import { RagWorkspace } from "@/components/rag/RagWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RAG Intelligence — Multimodal AI Workspace" },
      {
        name: "description",
        content:
          "A cinematic multimodal RAG workspace with live retrieval visualization, source attribution, and intelligent mode switching.",
      },
      { property: "og:title", content: "RAG Intelligence" },
      {
        property: "og:description",
        content:
          "Cinematic multimodal RAG workspace — documents, OCR, audio, and web retrieval in one elite interface.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <RagWorkspace />;
}
