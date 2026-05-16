import { motion, AnimatePresence } from "framer-motion";
import { useRag } from "@/lib/rag-store";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export function UploadModal() {
  const { upload, setUpload } = useRag();

  return (
    <AnimatePresence>
      {upload.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              <div className="flex items-center gap-3 mb-5">
                <StatusIcon status={upload.status} />
                <div className="flex-1">
                  <h2 className="text-[15px] font-semibold tracking-tight">
                    {upload.status === "done"
                      ? "Index updated"
                      : upload.status === "error"
                        ? "Upload failed"
                        : upload.status === "processing"
                          ? "Processing indices"
                          : "Encrypting & uploading"}
                  </h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5 break-words">
                    {upload.message || "Working…"}
                  </p>
                </div>
              </div>

              {upload.status !== "error" && (
                <>
                  <div className="relative h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: "var(--gradient-primary)" }}
                      animate={{ width: `${upload.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                    {upload.status !== "done" && (
                      <div
                        className="absolute inset-0 animate-shimmer rounded-full"
                        style={{ mixBlendMode: "overlay" }}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-right text-[11px] font-mono text-muted-foreground tabular-nums">
                    {upload.progress}%
                  </div>
                </>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setUpload({ open: false })}
                  className="px-4 py-2 rounded-lg text-[13px] text-foreground/80 hover:bg-white/[0.04] transition-colors"
                >
                  {upload.status === "done" || upload.status === "error"
                    ? "Close"
                    : "Dismiss"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "done")
    return (
      <div className="h-9 w-9 rounded-xl grid place-items-center bg-emerald-500/15 border border-emerald-500/40">
        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" />
      </div>
    );
  if (status === "error")
    return (
      <div className="h-9 w-9 rounded-xl grid place-items-center bg-destructive/15 border border-destructive/40">
        <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
      </div>
    );
  return (
    <div
      className="h-9 w-9 rounded-xl grid place-items-center"
      style={{
        background: "color-mix(in oklab, var(--primary) 14%, transparent)",
        border: "1px solid color-mix(in oklab, var(--primary) 40%, transparent)",
      }}
    >
      <Loader2 className="h-4.5 w-4.5 text-primary animate-spin" />
    </div>
  );
}
