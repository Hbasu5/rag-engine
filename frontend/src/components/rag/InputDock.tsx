import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Globe, Send, Command, FileText, AudioLines, Lock, Sparkles } from "lucide-react";
import { useRag } from "@/lib/rag-store";

const SLASH_COMMANDS = [
  { cmd: "/auto", label: "Auto", desc: "Adaptive routing", icon: Sparkles, mode: "Auto" as const },
  { cmd: "/hybrid", label: "Hybrid", desc: "Local + LLM blend", icon: Sparkles, mode: "Hybrid" as const },
  { cmd: "/local", label: "Strict Local", desc: "Indexed knowledge only", icon: Lock, mode: "Local" as const },
  { cmd: "/deep", label: "Deep Reasoning", desc: "Multi-step retrieval", icon: Sparkles, mode: "Deep" as const },
  { cmd: "/web", label: "Web Enhanced", desc: "Augment with web search", icon: Globe, mode: "Web" as const },
];

export function InputDock({
  onSend,
  onAttachDoc,
  onAttachAudio,
  onOpenWebDialog,
  disabled,
}: {
  onSend: (text: string) => void;
  onAttachDoc: () => void;
  onAttachAudio: () => void;
  onOpenWebDialog: () => void;
  disabled?: boolean;
}) {
  const { webSearchActive, toggleWebSearch, setMode } = useRag();
  const [value, setValue] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  const submit = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
    setSlashOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      setSlashOpen(false);
      setAttachOpen(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);
    setSlashOpen(v.startsWith("/"));
  };

  const filteredSlash = SLASH_COMMANDS.filter((c) =>
    c.cmd.toLowerCase().startsWith(value.toLowerCase()),
  );

  return (
    <div className="px-3 pb-3 sm:px-6 sm:pb-5">
      <div className="max-w-3xl mx-auto relative">
        {/* Slash menu */}
        <AnimatePresence>
          {slashOpen && filteredSlash.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute left-0 right-0 bottom-full mb-2 glass-strong rounded-2xl p-1.5 z-20"
            >
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5">
                <Command className="h-3 w-3" /> Mode commands
              </div>
              {filteredSlash.map((c) => (
                <button
                  key={c.cmd}
                  onClick={() => {
                    setMode(c.mode);
                    setValue("");
                    setSlashOpen(false);
                    taRef.current?.focus();
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/[0.05] transition-colors text-left"
                >
                  <span className="h-7 w-7 rounded-md grid place-items-center border border-border/70 bg-white/[0.02]">
                    <c.icon className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="text-[13px] text-foreground/95">{c.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{c.desc}</span>
                  </span>
                  <span className="text-[10.5px] font-mono text-muted-foreground">
                    {c.cmd}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attach menu */}
        <AnimatePresence>
          {attachOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute left-3 bottom-full mb-2 glass-strong rounded-xl p-1.5 z-20 min-w-[200px]"
            >
              <AttachItem
                icon={<FileText className="h-3.5 w-3.5 text-primary" />}
                label="Upload Document"
                hint="PDF · TXT · MD · Image"
                onClick={() => {
                  setAttachOpen(false);
                  onAttachDoc();
                }}
              />
              <AttachItem
                icon={<AudioLines className="h-3.5 w-3.5 text-emerald-300" />}
                label="Upload Audio"
                hint="MP3 · WAV · M4A"
                onClick={() => {
                  setAttachOpen(false);
                  onAttachAudio();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="glass-strong rounded-2xl ring-1 ring-transparent focus-within:ring-primary/40 transition-shadow"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex items-end gap-2 p-2.5">
            <div className="flex items-center gap-1">
              <DockButton
                onClick={() => {
                  setAttachOpen((v) => !v);
                  setSlashOpen(false);
                }}
                active={attachOpen}
                title="Attach"
              >
                <Paperclip className="h-4 w-4" />
              </DockButton>
              <DockButton
                onClick={() => {
                  if (webSearchActive) toggleWebSearch(false);
                  else onOpenWebDialog();
                }}
                active={webSearchActive}
                title="Web search"
              >
                <Globe className="h-4 w-4" />
                <span className="text-[11px] hidden sm:inline">Search</span>
              </DockButton>
            </div>

            <textarea
              ref={taRef}
              value={value}
              onChange={onChange}
              onKeyDown={onKey}
              rows={1}
              disabled={disabled}
              placeholder="Ask anything · type / for commands…"
              className="flex-1 resize-none bg-transparent outline-none text-[14.5px] leading-relaxed placeholder:text-muted-foreground/70 py-2 max-h-[200px] scrollbar-thin"
            />

            <button
              onClick={submit}
              disabled={!value.trim() || disabled}
              className="h-9 w-9 rounded-xl grid place-items-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: value.trim() && !disabled ? "var(--shadow-glow)" : "none",
              }}
            >
              <Send className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-[10.5px] text-muted-foreground/70 text-center font-mono tracking-wide flex items-center justify-center gap-3">
          <span>↵ send</span>
          <span className="opacity-50">·</span>
          <span>⇧ ↵ newline</span>
          <span className="opacity-50">·</span>
          <span>/ commands</span>
        </div>
      </div>
    </div>
  );
}

function DockButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`h-9 px-2.5 rounded-xl flex items-center gap-1.5 transition-all border ${
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-transparent text-foreground/70 hover:text-foreground hover:bg-white/[0.04]"
      }`}
    >
      {children}
    </button>
  );
}

function AttachItem({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/[0.05] transition-colors text-left"
    >
      <span className="h-7 w-7 rounded-md grid place-items-center border border-border/70 bg-white/[0.02]">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13px] text-foreground/95">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}
