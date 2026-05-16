import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  AudioLines,
  Globe,
  Database,
  Cpu,
  Sparkles,
  Activity,
  ChevronRight,
  Settings,
  Plus,
} from "lucide-react";
import { useRag } from "@/lib/rag-store";
import { useState } from "react";

interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  count: number;
  kind: "docs" | "ocr" | "audio" | "web";
  accent: string;
}

export function LeftSidebar({
  onOpenPanel,
  onAttachDoc,
  onAttachAudio,
}: {
  onOpenPanel: (k: "docs" | "ocr" | "audio" | "web") => void;
  onAttachDoc: () => void;
  onAttachAudio: () => void;
}) {
  const { assets } = useRag();
  const [systemOpen, setSystemOpen] = useState(true);

  const sections: Section[] = [
    { id: "docs", label: "Documents", icon: FileText, count: assets.docs.length, kind: "docs", accent: "var(--primary)" },
    { id: "ocr", label: "OCR Assets", icon: ImageIcon, count: assets.ocr.length, kind: "ocr", accent: "var(--violet)" },
    { id: "audio", label: "Audio", icon: AudioLines, count: assets.audio.length, kind: "audio", accent: "var(--emerald)" },
    { id: "web", label: "Web Sources", icon: Globe, count: assets.web.length, kind: "web", accent: "var(--cyan)" },
  ];

  return (
    <aside className="hidden md:flex w-[260px] flex-shrink-0 flex-col gap-3 p-3 pl-4">
      {/* Brand */}
      <div className="glass rounded-2xl p-3.5 flex items-center gap-3">
        <div className="relative h-9 w-9 rounded-xl grid place-items-center"
          style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight">RAG Intelligence</div>
          <div className="text-[10.5px] text-muted-foreground font-mono uppercase tracking-[0.14em]">
            Workspace · v2
          </div>
        </div>
      </div>

      {/* Knowledge */}
      <div className="glass rounded-2xl p-2">
        <SidebarHeader label="Knowledge" hint="Indexed" />
        <div className="flex flex-col">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onOpenPanel(s.kind)}
              className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span
                  className="h-7 w-7 rounded-lg grid place-items-center border border-border/60"
                  style={{
                    background: `color-mix(in oklab, ${s.accent} 10%, transparent)`,
                  }}
                >
                  <s.icon className="h-3.5 w-3.5" style={{ color: s.accent }} />
                </span>
                <span className="text-[13px] text-foreground/90">{s.label}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <span className="tabular-nums">{s.count.toString().padStart(2, "0")}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 px-2 pt-2 pb-1">
          <SidebarAction onClick={onAttachDoc} icon={<FileText className="h-3.5 w-3.5" />} label="Doc" />
          <SidebarAction onClick={onAttachAudio} icon={<AudioLines className="h-3.5 w-3.5" />} label="Audio" />
        </div>
      </div>

      {/* System */}
      <div className="glass rounded-2xl p-2 flex-1 min-h-0">
        <button
          onClick={() => setSystemOpen((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2"
        >
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
            System
          </span>
          <motion.span animate={{ rotate: systemOpen ? 90 : 0 }}>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {systemOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-1 pb-1">
                <SystemRow icon={Database} label="Vector index" value="Ready" tone="ok" />
                <SystemRow icon={Cpu} label="Embedding model" value="bge-m3" tone="neutral" />
                <SystemRow icon={Activity} label="Pipeline" value="Idle" tone="neutral" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button className="glass rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-[12.5px] hover:bg-white/[0.04] transition-colors">
        <span className="flex items-center gap-2.5 text-foreground/80">
          <Settings className="h-3.5 w-3.5" /> Workspace settings
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </aside>
  );
}

function SidebarHeader({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
        {label}
      </span>
      {hint && (
        <span className="text-[10px] font-mono text-muted-foreground/70">{hint}</span>
      )}
    </div>
  );
}

function SidebarAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-white/[0.02] px-2 py-1.5 text-[11.5px] text-foreground/80 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
    >
      <Plus className="h-3 w-3" /> {icon} {label}
    </button>
  );
}

function SystemRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "ok" | "neutral";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-white/[0.03] transition-colors">
      <span className="flex items-center gap-2.5 text-[12px] text-foreground/80">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background:
              tone === "ok" ? "var(--emerald)" : "var(--muted-foreground)",
            boxShadow:
              tone === "ok"
                ? "0 0 8px color-mix(in oklab, var(--emerald) 60%, transparent)"
                : "none",
          }}
        />
        <span className="text-[11px] font-mono text-muted-foreground">{value}</span>
      </span>
    </div>
  );
}
