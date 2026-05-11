# 🧠 RAG Engine

A modular, upload-based **Retrieval-Augmented Generation (RAG)** system designed for scalable real-world AI applications.

---

# 🚀 Overview

This project implements a complete dynamic RAG pipeline:

- 📄 User document upload
- 🧩 Text chunking
- 🧠 Embedding generation
- ⚡ FAISS vector search
- 🔍 Hybrid retrieval
- 🤖 LLM + Local fallback routing
- 💬 Interactive web-based chat UI

> Built to evolve from a learning project into a fully extensible AI system.

---

# ✨ Features

## 🔍 Retrieval System
- Semantic similarity search
- Hybrid retrieval (semantic + keyword)
- FAISS vector database
- Top-K context retrieval

---

## 📄 Dynamic Upload System
- Upload `.txt` documents directly from UI
- Runtime indexing
- Automatic embedding generation
- Dynamic knowledge base rebuilding

---

## 🤖 AI Routing
- Gemini-powered response generation
- Local fallback answer engine
- Mode switching:
  - LLM Mode
  - Local Mode

---

## 💬 Interactive Web UI
- Chat-style interface
- Slash commands
- Upload attachment menu
- Source inspection popup
- Modal-based upload feedback

---

# 🧱 Architecture

```text
User Upload
     ↓
Document Processing
     ↓
Chunking
     ↓
Embedding Generation
     ↓
FAISS Indexing
     ↓
User Query
     ↓
Retriever Engine
     ↓
Top-K Context
     ↓
LLM / Local Routing
     ↓
Response + Sources
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
│   │   └── loader.py
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
├── uploads/                # User-uploaded files (gitignored)
│
├── data/                   # Runtime-generated vector DB (gitignored)
│
├── model/                  # Embedding models (gitignored)
│
├── index.html              # Frontend UI
├── main.py                 # FastAPI server
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

Set environment variable:

```bash
GEMINI_API_KEY=your_api_key
```

---

## 5. Run Server

```bash
python main.py
```

---

# 🌐 Access UI

Open:

```text
http://127.0.0.1:8000
```

---

# 📄 Supported File Types

Current:
- `.txt`

Planned:
- `.pdf`
- `.docx`
- OCR/Image ingestion
- Web ingestion

---

# 🧠 How It Works

1. User uploads document
2. System chunks document
3. Embeddings generated
4. FAISS builds searchable vector index
5. User sends query
6. Relevant chunks retrieved
7. LLM or Local engine generates response

---

# 🔌 Extensibility

Designed for future upgrades:

- PDF ingestion
- Multi-user sessions
- Query reranking
- Retrieval thresholding
- Metadata tracking
- Persistent workspaces
- Audio ingestion
- Web search integration

---

# 🚧 Current Limitations

- Uploads rebuild index globally
- No persistent user sessions yet
- Local answer engine is basic
- No reranking layer yet
- TXT support only

---

# 📌 Tech Stack

- Python
- FastAPI
- SentenceTransformers
- FAISS
- Gemini API
- HTML/CSS/JavaScript

---

# 📄 License

MIT License

---

© 2026 — HARDIK BASU
