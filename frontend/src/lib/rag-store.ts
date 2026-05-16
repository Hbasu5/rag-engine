import { create } from "zustand";
import type { SourceItem } from "./rag-api";

export type Mode = "Auto" | "Hybrid" | "Local" | "Deep" | "Web";

export interface ModeMeta {
  id: Mode;
  label: string;
  short: string;
  description: string;
  useLLM: boolean;
}

export const MODES: ModeMeta[] = [
  { id: "Auto", label: "Auto", short: "AU", description: "Adaptive routing across local + LLM.", useLLM: true },
  { id: "Hybrid", label: "Hybrid", short: "HY", description: "Blend local vector store with LLM synthesis.", useLLM: true },
  { id: "Local", label: "Strict Local", short: "SL", description: "Only your indexed knowledge. No LLM.", useLLM: false },
  { id: "Deep", label: "Deep Reasoning", short: "DR", description: "Multi-step retrieval with extended context.", useLLM: true },
  { id: "Web", label: "Web Enhanced", short: "WE", description: "Augment retrieval with live web search.", useLLM: true },
];

export type PipelineStage =
  | "parse"
  | "embed"
  | "vector"
  | "rerank"
  | "web"
  | "synthesis"
  | "stream";

export interface StageState {
  id: PipelineStage;
  label: string;
  status: "idle" | "active" | "done" | "skipped";
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
  pipeline?: StageState[];
  streaming?: boolean;
  createdAt: number;
  mode?: Mode;
}

interface AssetLists {
  docs: string[];
  ocr: string[];
  audio: string[];
  web: SourceItem[];
}

interface UploadState {
  open: boolean;
  message: string;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
}

interface RagStore {
  messages: Message[];
  mode: Mode;
  webSearchActive: boolean;
  webMaxResults: number;
  assets: AssetLists;
  upload: UploadState;
  activeSources: SourceItem[] | null;
  pipeline: StageState[];
  isThinking: boolean;

  setMode: (m: Mode) => void;
  toggleWebSearch: (on?: boolean) => void;
  setWebMaxResults: (n: number) => void;
  pushMessage: (m: Message) => void;
  updateMessage: (id: string, patch: Partial<Message>) => void;
  openSources: (s: SourceItem[] | null) => void;
  addAsset: (kind: "doc" | "ocr" | "audio", name: string) => void;
  setWebSources: (s: SourceItem[]) => void;
  setUpload: (u: Partial<UploadState> & { open?: boolean }) => void;
  setPipeline: (p: StageState[]) => void;
  setThinking: (b: boolean) => void;
}

const baseStages = (web: boolean): StageState[] => [
  { id: "parse", label: "Query parsing", status: "idle" },
  { id: "embed", label: "Embedding", status: "idle" },
  { id: "vector", label: "Vector search", status: "idle" },
  { id: "rerank", label: "Reranking", status: "idle" },
  ...(web
    ? ([{ id: "web", label: "Web retrieval", status: "idle" }] as StageState[])
    : []),
  { id: "synthesis", label: "Synthesis", status: "idle" },
  { id: "stream", label: "Response stream", status: "idle" },
];

export const initialPipeline = baseStages;

export const useRag = create<RagStore>((set) => ({
  messages: [],
  mode: "Auto",
  webSearchActive: false,
  webMaxResults: 3,
  assets: { docs: [], ocr: [], audio: [], web: [] },
  upload: { open: false, message: "", progress: 0, status: "uploading" },
  activeSources: null,
  pipeline: baseStages(false),
  isThinking: false,

  setMode: (m) => set({ mode: m }),
  toggleWebSearch: (on) =>
    set((s) => ({ webSearchActive: on ?? !s.webSearchActive })),
  setWebMaxResults: (n) => set({ webMaxResults: n }),
  pushMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  updateMessage: (id, patch) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),
  openSources: (s) => set({ activeSources: s }),
  addAsset: (kind, name) =>
    set((s) => {
      const key = kind === "doc" ? "docs" : kind === "ocr" ? "ocr" : "audio";
      return { assets: { ...s.assets, [key]: [...s.assets[key], name] } };
    }),
  setWebSources: (sources) =>
    set((s) => ({ assets: { ...s.assets, web: sources } })),
  setUpload: (u) =>
    set((s) => ({ upload: { ...s.upload, ...u, open: u.open ?? s.upload.open } })),
  setPipeline: (p) => set({ pipeline: p }),
  setThinking: (b) => set({ isThinking: b }),
}));
