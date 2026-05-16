import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Database,
  Layers,
  Globe,
  Brain,
  Radio,
  type LucideIcon,
} from "lucide-react";
import type { PipelineStage, StageState } from "@/lib/rag-store";

const ICONS: Record<PipelineStage, LucideIcon> = {
  parse: Search,
  embed: Sparkles,
  vector: Database,
  rerank: Layers,
  web: Globe,
  synthesis: Brain,
  stream: Radio,
};

export function RetrievalPipeline({ stages }: { stages: StageState[] }) {
  return (
    <div className="glass rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
            Retrieval Pipeline
          </span>
        </div>
        <span className="text-[10.5px] font-mono text-muted-foreground/70">
          live
        </span>
      </div>

      <div className="relative">
        {/* connection rail */}
        <svg
          className="absolute left-0 right-0 top-5 h-6 w-full pointer-events-none"
          viewBox="0 0 100 1"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            stroke="url(#rail)"
            strokeWidth="0.4"
            strokeLinecap="round"
            className="animate-flow"
          />
          <defs>
            <linearGradient id="rail" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="oklch(0.72 0.18 252 / 0.05)" />
              <stop offset="50%" stopColor="oklch(0.72 0.18 252 / 0.7)" />
              <stop offset="100%" stopColor="oklch(0.78 0.16 220 / 0.05)" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
          {stages.map((s, i) => {
            const Icon = ICONS[s.id];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`relative h-10 w-10 rounded-xl grid place-items-center border transition-all ${
                    s.status === "active"
                      ? "border-primary/60 bg-primary/15"
                      : s.status === "done"
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : s.status === "skipped"
                          ? "border-border/40 bg-white/[0.015] opacity-40"
                          : "border-border/60 bg-white/[0.02]"
                  }`}
                  style={{
                    boxShadow:
                      s.status === "active"
                        ? "0 0 18px -2px oklch(0.72 0.18 252 / 0.55)"
                        : undefined,
                  }}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      s.status === "active"
                        ? "text-primary"
                        : s.status === "done"
                          ? "text-emerald-300"
                          : "text-muted-foreground"
                    }`}
                  />
                  {s.status === "active" && (
                    <span className="absolute inset-0 rounded-xl animate-pulse-ring" />
                  )}
                </div>
                <span
                  className={`text-[10.5px] tracking-tight text-center leading-tight ${
                    s.status === "skipped"
                      ? "text-muted-foreground/40"
                      : "text-foreground/75"
                  }`}
                >
                  {s.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
