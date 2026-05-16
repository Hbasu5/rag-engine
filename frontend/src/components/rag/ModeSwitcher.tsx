import { motion } from "framer-motion";
import { MODES, type Mode } from "@/lib/rag-store";
import { useRag } from "@/lib/rag-store";

export function ModeSwitcher() {
  const { mode, setMode } = useRag();

  return (
    <div className="glass rounded-full p-1 flex items-center gap-0.5 relative">
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id as Mode)}
            className="relative px-3 py-1.5 text-[12px] rounded-full transition-colors"
            title={m.description}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow)",
                }}
              />
            )}
            <span
              className={`relative font-medium ${
                active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
