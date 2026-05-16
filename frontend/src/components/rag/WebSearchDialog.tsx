import { motion, AnimatePresence } from "framer-motion";
import { Globe, X } from "lucide-react";
import { useRag } from "@/lib/rag-store";
import { useState } from "react";

export function WebSearchDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { webMaxResults, setWebMaxResults } = useRag();
  const [val, setVal] = useState(webMaxResults);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 grid place-items-center p-4"
          >
            <div className="glass-strong rounded-2xl w-full max-w-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl grid place-items-center"
                    style={{
                      background:
                        "color-mix(in oklab, var(--cyan) 14%, transparent)",
                      border:
                        "1px solid color-mix(in oklab, var(--cyan) 40%, transparent)",
                    }}
                  >
                    <Globe className="h-5 w-5" style={{ color: "var(--cyan)" }} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-semibold tracking-tight">
                      Web Enhancement
                    </h2>
                    <p className="text-[12px] text-muted-foreground">
                      Augment retrieval with live results
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg grid place-items-center hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-2 flex items-center justify-between text-[12px]">
                <span className="text-foreground/80">Max results</span>
                <span className="font-mono text-primary tabular-nums">{val}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={val}
                onChange={(e) => setVal(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10.5px] font-mono text-muted-foreground mt-1">
                <span>1</span>
                <span>10</span>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-[13px] text-foreground/70 hover:text-foreground hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setWebMaxResults(val);
                    onConfirm();
                  }}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium text-primary-foreground"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  Enable
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
