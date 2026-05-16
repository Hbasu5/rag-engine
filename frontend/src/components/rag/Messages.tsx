import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, User, FileText, Globe, ImageIcon, AudioLines, Quote, ChevronRight } from "lucide-react";
import type { Message } from "@/lib/rag-store";
import type { SourceItem } from "@/lib/rag-api";

function SourceIcon({ kind, className }: { kind?: SourceItem["kind"]; className?: string }) {
  const c = className ?? "h-3 w-3";
  if (kind === "web") return <Globe className={c} />;
  if (kind === "ocr") return <ImageIcon className={c} />;
  if (kind === "audio") return <AudioLines className={c} />;
  return <FileText className={c} />;
}

function MessageBubbleImpl({
  message,
  onOpenSources,
}: {
  message: Message;
  onOpenSources: (s: SourceItem[]) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-5 animate-fade-in">
        <div className="flex items-start gap-3 max-w-[78%] flex-row-reverse">
          <div className="h-8 w-8 rounded-full grid place-items-center flex-shrink-0 mt-0.5 border border-border/70 bg-surface-elevated">
            <User className="h-3.5 w-3.5 text-foreground/70" />
          </div>
          <div
            className="rounded-2xl rounded-tr-md px-4 py-2.5 text-[14px] leading-relaxed"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 252 / 0.5), oklch(0.5 0.18 240 / 0.4))",
              border: "1px solid oklch(0.72 0.18 252 / 0.4)",
            }}
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-6 animate-fade-in">
      <div className="flex items-start gap-3 max-w-[88%] w-full">
        <div
          className="h-8 w-8 rounded-full grid place-items-center flex-shrink-0 mt-0.5"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-medium text-foreground/80">
              Assistant
            </span>
            {message.mode && (
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground px-1.5 py-0.5 rounded border border-border/60">
                {message.mode}
              </span>
            )}
          </div>

          <div
            className={`text-[14.5px] leading-[1.65] text-foreground/95 whitespace-pre-wrap ${
              message.streaming ? "caret" : ""
            }`}
          >
            {message.content || (message.streaming ? "" : "")}
          </div>

          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {message.sources.slice(0, 5).map((s, i) => (
                <button
                  key={i}
                  onClick={() => onOpenSources(message.sources!)}
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-white/[0.025] px-2 py-1 text-[11px] text-foreground/80 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors max-w-[260px]"
                >
                  <span className="text-primary/80 group-hover:text-primary">
                    <SourceIcon kind={s.kind} />
                  </span>
                  <span className="truncate">{s.title}</span>
                  {typeof s.score === "number" && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {s.score.toFixed(2)}
                    </span>
                  )}
                </button>
              ))}
              {message.sources.length > 5 && (
                <button
                  onClick={() => onOpenSources(message.sources!)}
                  className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border/70 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  +{message.sources.length - 5} more
                </button>
              )}
              <button
                onClick={() => onOpenSources(message.sources!)}
                className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                <Quote className="h-3 w-3" /> Inspect
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleImpl, (prev, next) => {
  // Re-render only when this message's identity/content/streaming/sources change.
  return (
    prev.message === next.message &&
    prev.onOpenSources === next.onOpenSources
  );
});

export function EmptyState() {
  const suggestions = [
    "Summarize the indexed documents",
    "Compare the latest OCR results",
    "What's in the audio transcripts?",
    "/local explain my knowledge base",
  ];
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative inline-block mb-6"
        >
          <div
            className="h-20 w-20 rounded-3xl grid place-items-center mx-auto"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Sparkles className="h-9 w-9 text-primary-foreground" />
          </div>
          <span className="absolute inset-0 rounded-3xl animate-pulse-ring" />
        </motion.div>
        <h1 className="text-3xl font-semibold tracking-tight text-gradient mb-2">
          Ask your knowledge anything
        </h1>
        <p className="text-[14px] text-muted-foreground mb-6">
          Multimodal retrieval across documents, images, audio, and the web — synthesized in real time.
        </p>
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          {suggestions.map((s) => (
            <div
              key={s}
              className="text-left text-[12.5px] text-foreground/80 rounded-xl border border-border/60 bg-white/[0.02] px-3 py-2.5 hover:border-primary/40 hover:bg-primary/10 transition-colors cursor-default"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
