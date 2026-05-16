// Lightweight client for the existing RAG backend.
// Preserves the original endpoints and payload shapes from the legacy HTML:
//   POST /upload     (multipart, field "file")
//   POST /query      (JSON {query, use_llm, web_search?, max_results?})
// Override base URL with VITE_RAG_API_BASE if the backend lives on another host.

const BASE = (import.meta.env.VITE_RAG_API_BASE ?? "").replace(/\/$/, "");

export interface SourceItem {
  // The backend returns an arbitrary array. We coerce to a friendly shape but
  // also keep the raw value so nothing is lost.
  raw: unknown;
  title: string;
  snippet?: string;
  score?: number;
  kind?: "web" | "doc" | "ocr" | "audio" | "chunk" | "unknown";
  url?: string;
}

export interface QueryResponse {
  answer: string;
  sources: SourceItem[];
  raw: unknown;
}

function normalizeSource(s: unknown): SourceItem {
  if (typeof s === "string") {
    const url = /^https?:\/\//i.test(s) ? s : undefined;
    return { raw: s, title: s, kind: url ? "web" : "chunk", url };
  }
  if (s && typeof s === "object") {
    const o = s as Record<string, unknown>;
    const title =
      (o.title as string) ||
      (o.source as string) ||
      (o.name as string) ||
      (o.url as string) ||
      "Source";
    const snippet =
      (o.snippet as string) || (o.text as string) || (o.content as string);
    const score = typeof o.score === "number" ? (o.score as number) : undefined;
    const url = typeof o.url === "string" ? (o.url as string) : undefined;
    const kindRaw = ((o.type as string) || (o.kind as string) || "")
      .toString()
      .toLowerCase();
    let kind: SourceItem["kind"] = "chunk";
    if (kindRaw.includes("web") || url) kind = "web";
    else if (kindRaw.includes("ocr") || kindRaw.includes("image")) kind = "ocr";
    else if (kindRaw.includes("audio")) kind = "audio";
    else if (kindRaw.includes("doc") || kindRaw.includes("pdf")) kind = "doc";
    return { raw: s, title, snippet, score, kind, url };
  }
  return { raw: s, title: String(s), kind: "unknown" };
}

export async function postQuery(payload: {
  query: string;
  use_llm: boolean;
  web_search?: boolean;
  max_results?: number;
}): Promise<QueryResponse> {
  const res = await fetch(`${BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${res.statusText}`);
  const data = (await res.json()) as {
    answer?: string;
    sources?: unknown[];
  };
  return {
    answer: data.answer || "No response",
    sources: Array.isArray(data.sources) ? data.sources.map(normalizeSource) : [],
    raw: data,
  };
}

export type UploadProgress = (percent: number, stage: string) => void;

export function uploadFile(
  file: File,
  onProgress?: UploadProgress,
): Promise<{ message: string; error?: string }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE}/upload`, true);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct, pct < 100 ? "Encrypting & uploading" : "Processing indices");
      }
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.error || data.detail || `Upload failed: ${xhr.status}`));
      } catch {
        reject(new Error("Invalid response from upload endpoint"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}

export function classifyFile(name: string): "doc" | "ocr" | "audio" | "other" {
  const n = name.toLowerCase();
  if (/\.(txt|md)$/.test(n)) return "doc";
  if (/\.(png|jpe?g)$/.test(n)) return "ocr";
  if (/\.(mp3|wav|m4a)$/.test(n)) return "audio";
  return "other";
}
