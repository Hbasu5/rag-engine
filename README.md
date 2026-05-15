# 🧠 RAG Engine

A modular multimodal **Retrieval-Augmented Generation (RAG)** system built for scalable real-world AI applications.

Supports:
- local knowledge retrieval
- OCR ingestion
- audio transcription
- live web retrieval
- hybrid multimodal querying

---

# 🚀 Overview

RAG Engine has evolved from a text-only prototype into a hybrid multimodal retrieval system capable of combining:

- 📄 uploaded documents
- 🖼️ OCR image extraction
- 🎤 audio transcription
- 🌐 live internet retrieval

through a unified semantic retrieval pipeline.

---

# ✨ Features

# 🔍 Hybrid Retrieval System

- Semantic similarity search
- FAISS vector database
- Dynamic Top-K retrieval
- Local + web retrieval routing
- Structured retrieval context assembly

---

# 📄 Dynamic Upload System

- Runtime document uploads
- Automatic chunking
- Embedding generation
- Dynamic vector index rebuilding
- Upload observability

---

# 🖼️ OCR Ingestion

Supports:
- `.png`
- `.jpg`
- `.jpeg`

Powered by:
- pytesseract
- Pillow

Capabilities:
- scanned text extraction
- screenshot ingestion
- printed English OCR

---

# 🎤 Audio Transcription

Supports:
- `.mp3`
- `.wav`
- `.m4a`

Powered by:
- Whisper (tiny)
- FFmpeg

Capabilities:
- speech-to-text ingestion
- transcript indexing
- audio-based retrieval

---

# 🌐 Live Web Retrieval

Implemented real-time internet augmentation pipeline.

### Web Retrieval Flow

```text
User Query
 ↓
Web Search
 ↓
URL Extraction
 ↓
Webpage Fetching
 ↓
Content Extraction
 ↓
Chunking
 ↓
Structured Web Context
 ↓
LLM Response
```

### Stack Used

- DDGS
- Requests
- Trafilatura

Features:
- live internet retrieval
- semantic webpage extraction
- structured web context
- web source tracking
- retrieval observability

---

# 💬 Consumer-Grade AI UI

Frontend redesigned from:
- developer utility UI

to:
- modern AI assistant interface

Features:
- chat-style interaction
- modality-aware UI
- upload progress tracking
- web search configuration dialog
- retrieval observability panels
- source inspection system
- interactive modality badges
- slash command support

---

# 🧠 Architecture

```text
FILE / WEB QUERY
        ↓
Extractor Router
 ├── TXT Extractor
 ├── OCR Extractor
 ├── Audio Extractor
 └── Web Retriever
        ↓
Normalized Text
        ↓
Chunking
        ↓
Embedding Generation
        ↓
FAISS Indexing
        ↓
Retriever Engine
        ↓
Structured Context
        ↓
LLM / Local Response
```

---

# 📁 Project Structure

```text
RAG/
│
├── app/
│   │
│   ├── core/
│   │   ├── chunking.py
│   │   ├── embeddings.py
│   │   ├── retriever.py
│   │   └── retriever_engine.py
│   │
│   ├── ingestion/
│   │   ├── extractors/
│   │   │   ├── txt_extractor.py
│   │   │   ├── ocr_extractor.py
│   │   │   ├── audio_extractor.py
│   │   │   └── extractor_router.py
│   │   │
│   │   └── loader.py
│   │
│   ├── retrieval/
│   │   ├── web_search.py
│   │   ├── web_scraper.py
│   │   └── web_context_builder.py
│   │
│   ├── llm/
│   │   ├── base.py
│   │   └── gemini.py
│   │
│   ├── services/
│   │   ├── answer_engine.py
│   │   └── rag_pipeline.py
│   │
│   └── storage/
│       └── faiss_store.py
│
├── uploads/
├── data/
├── model/
│
├── index.html
├── main.py
├── requirements.txt
├── README.md
└── .gitignore
```

---

# ⚙️ Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/rag-engine.git
cd rag-engine
```

---

## 2. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Download Embedding Model

Download:

https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2

Place inside:

```text
model/all-MiniLM-L6-v2/
```

---

## 4. Configure Gemini API Key

```bash
GEMINI_API_KEY=your_api_key
```

---

## 5. Install FFmpeg

Required for audio transcription.

Add FFmpeg to system PATH.

---

## 6. Run Server

```bash
python main.py
```

---

# 🌐 Access UI

```text
http://127.0.0.1:8000
```

---

# 📄 Supported Inputs

## Documents
- `.txt`
- `.md`

## OCR Images
- `.png`
- `.jpg`
- `.jpeg`

## Audio
- `.mp3`
- `.wav`
- `.m4a`

## Web
- live web retrieval
- semantic webpage extraction

---

# 🧠 Retrieval Capabilities

Current retrieval sources:
- uploaded documents
- OCR-extracted text
- audio transcripts
- live internet knowledge

---

# 🔌 Planned Upgrades

## v1.0.5-beta

Planned:
- metadata-aware retrieval
- multilingual audio
- reranking
- confidence scoring
- retrieval thresholding
- caching
- async retrieval
- observability expansion

---

# 🚧 Current Limitations

## OCR
- no handwriting support
- multilingual OCR still experimental
- no layout preservation

## Audio
- English-only
- no speaker diarization
- no multilingual transcription

## Web Retrieval
- no reranking
- no caching
- temporary retrieval context only

---

# 📌 Tech Stack

- Python
- FastAPI
- SentenceTransformers
- FAISS
- Gemini API
- Whisper
- Pytesseract
- Trafilatura
- HTML/CSS/JavaScript

---

# 📄 License

MIT License

---

© 2026 — HARDIK BASU
