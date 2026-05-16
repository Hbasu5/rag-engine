import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Globe, Image as ImageIcon, AudioLines, ExternalLink } from "lucide-react";
import type { SourceItem } from "@/lib/rag-api";

function kindMeta(k?: SourceItem["kind"]) {
  switch (k) {
    case "web":
      return { Icon: Globe, label: "Web", color: "var(--cyan)" };
    case "ocr":
      return { Icon: ImageIcon, label: "OCR", color: "var(--violet)" };
    case "audio":
      return { Icon: AudioLines, label: "Audio", color: "var(--emerald)" };
    default:
      return { Icon: FileText, label: "Document", color: "var(--primary)" };
  }
}

export function SourcePanel({
  sources,
  onClose,
}: {
  sources: SourceItem[] | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {sources && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "100%", opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-3 top-3 bottom-3 z-50 w-full max-w-[420px] glass-strong rounded-2xl flex flex-col"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                  Retrieval
                </div>
                <h2 className="text-[15px] font-semibold tracking-tight mt-0.5">
                  Source attribution
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg grid place-items-center hover:bg-white/[0.05] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-2.5">
              {sources.length === 0 && (
                <div className="text-center text-muted-foreground py-12 text-sm">
                  No sources for this response.
                </div>
              )}
              {sources.map((s, i) => {
                const m = kindMeta(s.kind);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl border border-border/70 bg-white/[0.025] p-3.5 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-6 w-6 rounded-md grid place-items-center flex-shrink-0"
                          style={{
                            background: `color-mix(in oklab, ${m.color} 14%, transparent)`,
                            border: `1px solid color-mix(in oklab, ${m.color} 40%, transparent)`,
                          }}
                        >
                          <m.Icon className="h-3 w-3" style={{ color: m.color }} />
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-[0.14em] font-mono"
                          style={{ color: m.color }}
                        >
                          {m.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          #{(i + 1).toString().padStart(2, "0")}
                        </span>
                      </div>
                      {typeof s.score === "number" && (
                        <ScoreBadge score={s.score} />
                      )}
                    </div>
                    <div className="text-[13px] font-medium text-foreground/95 leading-snug break-words">
                      {s.title}
                    </div>
                    {s.snippet && (
                      <div className="mt-2 text-[12px] text-muted-foreground leading-relaxed line-clamp-4">
                        {s.snippet}
                      </div>
                    )}
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary-glow mt-2"
                      >
                        Open source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, score));
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-1.5 w-14 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct * 100}%`,
            background: "var(--gradient-primary)",
          }}
        />
      </div>
      <span className="text-[10.5px] font-mono text-muted-foreground tabular-nums">
        {pct.toFixed(2)}
      </span>
    </div>
  );
}
