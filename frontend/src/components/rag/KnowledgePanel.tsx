import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Globe, Image as ImageIcon, AudioLines, ExternalLink } from "lucide-react";
import { useRag } from "@/lib/rag-store";
import type { SourceItem } from "@/lib/rag-api";

const META = {
  docs: { Icon: FileText, label: "Documents", color: "var(--primary)" },
  ocr: { Icon: ImageIcon, label: "OCR Images", color: "var(--violet)" },
  audio: { Icon: AudioLines, label: "Audio Files", color: "var(--emerald)" },
  web: { Icon: Globe, label: "Web Sources", color: "var(--cyan)" },
} as const;

export function KnowledgePanel({
  kind,
  onClose,
}: {
  kind: keyof typeof META | null;
  onClose: () => void;
}) {
  const { assets } = useRag();
  const items: (string | SourceItem)[] = kind
    ? kind === "web"
      ? assets.web
      : (assets[kind] as string[])
    : [];
  const meta = kind ? META[kind] : null;

  return (
    <AnimatePresence>
      {kind && meta && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/70"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 grid place-items-center p-4 pointer-events-none"
          >
            <div className="glass-strong rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col pointer-events-auto">
              <header className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-xl grid place-items-center"
                    style={{
                      background: `color-mix(in oklab, ${meta.color} 14%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${meta.color} 40%, transparent)`,
                    }}
                  >
                    <meta.Icon className="h-4 w-4" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold tracking-tight">
                      {meta.label}
                    </h2>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg grid place-items-center hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
                {items.length === 0 && (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    Nothing here yet.
                  </div>
                )}
                {items.map((it, i) => {
                  if (typeof it === "string") {
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-border/70 bg-white/[0.025] p-3 text-[13px] text-foreground/90 break-words"
                      >
                        {it}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-border/70 bg-white/[0.025] p-3"
                    >
                      <div className="text-[13px] text-foreground/95 break-words">
                        {it.title}
                      </div>
                      {it.snippet && (
                        <div className="text-[12px] text-muted-foreground mt-1 line-clamp-3">
                          {it.snippet}
                        </div>
                      )}
                      {it.url && (
                        <a
                          href={it.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary mt-2"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
