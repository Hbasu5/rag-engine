import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap } from "lucide-react";

import { AuroraBackground } from "@/components/rag/AuroraBackground";
import { LeftSidebar } from "@/components/rag/LeftSidebar";
import { ModeSwitcher } from "@/components/rag/ModeSwitcher";
import { RetrievalPipeline } from "@/components/rag/RetrievalPipeline";
import { EmptyState, MessageBubble } from "@/components/rag/Messages";
import { InputDock } from "@/components/rag/InputDock";
import { SourcePanel } from "@/components/rag/SourcePanel";
import { WebSearchDialog } from "@/components/rag/WebSearchDialog";
import { UploadModal } from "@/components/rag/UploadModal";
import { KnowledgePanel } from "@/components/rag/KnowledgePanel";

import { MODES, initialPipeline, useRag, type Message, type StageState } from "@/lib/rag-store";
import { classifyFile, postQuery, uploadFile } from "@/lib/rag-api";
import type { SourceItem } from "@/lib/rag-api";

export function RagWorkspace() {
  const {
    mode,
    webSearchActive,
    webMaxResults,
    messages,
    pushMessage,
    updateMessage,
    activeSources,
    openSources,
    setWebSources,
    addAsset,
    setUpload,
    pipeline,
    setPipeline,
    isThinking,
    setThinking,
  } = useRag();

  const [webDialogOpen, setWebDialogOpen] = useState(false);
  const [panelKind, setPanelKind] = useState<
    "docs" | "ocr" | "audio" | "web" | null
  >(null);

  const docInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  /* ---------- Pipeline orchestration ---------- */
  const runPipelineAnimation = async (web: boolean) => {
    const stages = initialPipeline(web);
    setPipeline(stages);
    // step through stages while waiting for backend
    const order = stages.map((s) => s.id);
    let i = 0;
    const interval = setInterval(() => {
      setPipeline(
        order.map((id, idx) => {
          let status: StageState["status"] = "idle";
          if (idx < i) status = "done";
          else if (idx === i) status = "active";
          return {
            id,
            label: stages[idx].label,
            status,
          };
        }),
      );
      i = Math.min(i + 1, order.length - 1);
    }, 480);
    return () => {
      clearInterval(interval);
      setPipeline(
        order.map((id, idx) => ({
          id,
          label: stages[idx].label,
          status: "done",
        })),
      );
    };
  };

  /* ---------- Send ---------- */
  const handleSend = async (text: string) => {
    if (isThinking) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    pushMessage(userMsg);

    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      streaming: true,
      createdAt: Date.now(),
      mode,
    };
    pushMessage(assistantMsg);

    setThinking(true);
    const finishStages = await runPipelineAnimation(webSearchActive);

    try {
      const res = await postQuery({
        query: text,
        use_llm: currentMode.useLLM,
        ...(webSearchActive
          ? { web_search: true, max_results: webMaxResults }
          : {}),
      });
      finishStages();
      // Capture web sources for the sidebar (matches original behaviour)
      if (res.sources?.length) {
        const webOnly = res.sources.filter((s) => s.kind === "web");
        if (webOnly.length) setWebSources(webOnly);
      }
      streamInto(assistantId, res.answer, res.sources);
    } catch (err) {
      finishStages();
      updateMessage(assistantId, {
        content:
          "⚠️ " + (err instanceof Error ? err.message : "Request failed"),
        streaming: false,
      });
      setThinking(false);
    }
  };

  const streamInto = (
    id: string,
    full: string,
    sources: SourceItem[],
  ) => {
    // Cinematic reveal — batched via rAF so we don't thrash React or layout.
    // Reveals ~3-5 tokens per frame instead of a setTimeout per token.
    const chunks = full.split(/(\s+)/);
    let idx = 0;
    const tick = () => {
      if (idx >= chunks.length) {
        updateMessage(id, { content: full, streaming: false, sources });
        setThinking(false);
        return;
      }
      const step = 3 + Math.floor(Math.random() * 3);
      idx = Math.min(chunks.length, idx + step);
      updateMessage(id, { content: chunks.slice(0, idx).join("") });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Upload ---------- */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;

    setUpload({
      open: true,
      message: f.name,
      progress: 0,
      status: "uploading",
    });

    try {
      const data = await uploadFile(f, (pct, stage) => {
        setUpload({
          progress: pct,
          status: pct < 100 ? "uploading" : "processing",
          message: pct < 100 ? `${stage} · ${f.name}` : stage,
        });
      });
      const cls = classifyFile(f.name);
      if (cls !== "other") addAsset(cls, f.name);
      setUpload({
        progress: 100,
        status: "done",
        message: data.message || `${f.name} indexed successfully`,
      });
    } catch (err) {
      setUpload({
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed",
      });
    }
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <AuroraBackground />

      <LeftSidebar
        onOpenPanel={(k) => setPanelKind(k)}
        onAttachDoc={() => docInputRef.current?.click()}
        onAttachAudio={() => audioInputRef.current?.click()}
      />

      {/* Main workspace */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 px-3 sm:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="md:hidden flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg grid place-items-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-[14px] font-semibold tracking-tight">
                RAG Intelligence
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2.5">
              <StatusPill icon={Activity} tone="primary" label="Pipeline" value={isThinking ? "Running" : "Ready"} pulse={isThinking} />
              <StatusPill icon={ShieldCheck} tone="emerald" label="Index" value="Synced" />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
            <ModeSwitcher />
          </div>
        </header>

        {/* Mode description strip */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 sm:px-6 pb-2"
        >
          <div className="max-w-3xl mx-auto text-[11.5px] text-muted-foreground flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--primary)" }}
            />
            <span className="font-medium text-foreground/85">
              {currentMode.label}
            </span>
            <span className="opacity-60">·</span>
            <span>{currentMode.description}</span>
          </div>
        </motion.div>

        {/* Conversation */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin px-3 sm:px-6"
        >
          <div className="max-w-3xl mx-auto py-4">
            {messages.length === 0 ? (
              <div className="min-h-[60vh] flex">
                <EmptyState />
              </div>
            ) : (
              <>
                {isThinking && <RetrievalPipeline stages={pipeline} />}
                {messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    onOpenSources={(s) => openSources(s)}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        <InputDock
          onSend={handleSend}
          disabled={isThinking}
          onAttachDoc={() => docInputRef.current?.click()}
          onAttachAudio={() => audioInputRef.current?.click()}
          onOpenWebDialog={() => setWebDialogOpen(true)}
        />
      </main>

      {/* Hidden file inputs preserving original upload flow */}
      <input
        ref={docInputRef}
        type="file"
        hidden
        accept=".txt,.md,.png,.jpg,.jpeg"
        onChange={handleFileChange}
      />
      <input
        ref={audioInputRef}
        type="file"
        hidden
        accept=".mp3,.wav,.m4a"
        onChange={handleFileChange}
      />

      <SourcePanel sources={activeSources} onClose={() => openSources(null)} />
      <WebSearchDialog
        open={webDialogOpen}
        onClose={() => setWebDialogOpen(false)}
        onConfirm={() => {
          useRag.getState().toggleWebSearch(true);
          setWebDialogOpen(false);
        }}
      />
      <UploadModal />
      <KnowledgePanel
        kind={panelKind}
        onClose={() => setPanelKind(null)}
      />
    </div>
  );
}

function StatusPill({
  icon: Icon,
  tone,
  label,
  value,
  pulse,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "emerald";
  label: string;
  value: string;
  pulse?: boolean;
}) {
  const color = tone === "primary" ? "var(--primary)" : "var(--emerald)";
  return (
    <div className="glass rounded-full pl-2 pr-3 py-1 flex items-center gap-2">
      <span className="relative h-5 w-5 rounded-full grid place-items-center"
        style={{
          background: `color-mix(in oklab, ${color} 14%, transparent)`,
        }}>
        <Icon className="h-3 w-3" />
        {pulse && (
          <span
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ ["--tw-shadow" as never]: `0 0 0 0 ${color}` }}
          />
        )}
      </span>
      <span className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="text-[11.5px] text-foreground/90">{value}</span>
    </div>
  );
}
