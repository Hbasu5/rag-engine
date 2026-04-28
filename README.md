### Note: The README might not be up-to-date with the current code/folder structure since development focus is in implementing new features. I will try my best to update it as soon as possible😄.

# 🧠 RAG Engine

A modular **Retrieval-Augmented Generation (RAG)** system built for scalable, real-world AI applications.

---

## 🚀 Overview

This project implements the core pipeline of a RAG system:

* 🔍 Semantic retrieval using embeddings
* ⚡ Fast similarity search with FAISS
* 🧠 Hybrid ranking (semantic + keyword)
* 🧩 Modular design for easy extension (LLMs, APIs, datasets)

> Designed to start simple and scale into a full AI system.

---

## 🧱 Architecture

```
User Query
    ↓
Embedding (query)
    ↓
Vector Search (FAISS)
    ↓
Top-K Retrieval
    ↓
Ranking (semantic + keyword)
    ↓
Context Output → (LLM ready)
```

---

## ✨ Features

* Sentence-level chunking for precise retrieval
* Semantic similarity search using embeddings
* FAISS-based vector database
* Hybrid ranking to improve relevance
* Modular structure for scalability
* Local-first setup (can be extended to APIs)

---

## 📁 Project Structure

```
rag-engine/
│
├── app/
│   │
│   ├── core/                     # 🧠 Core logic (no I/O)
│   │   ├── __init__.py
│   │   ├── chunking.py
│   │   ├── embeddings.py
│   │   ├── retriever.py
│   │
│   ├── storage/                  # 💾 Persistence layer
│   │   ├── faiss_store.py
│   │
│   ├── ingestion/                # 📂 Data loading
│   │   ├── loader.py             # txt/md (PDF later)
│   │
│   ├── services/                 # ⚙️ Orchestration
│       ├── __init__.py
│       ├── rag_pipeline.py
│
│
├── data/                         # ⚠️ Runtime-generated (gitignored)
│   ├── raw/                      # user files
│   │   ├── *.txt
│   │   ├── *.md
│   │
│   ├── faiss.index
│   ├── metadata.pkl
│
├── models/                       # 🤖 Embedding models (gitignored)
│
│
├── test.py                       # Scratch testing (gitignored)
├── main.py                       # Entry point
├── requirements.txt
├── README.md
├── Dare.md
├── .gitignore
```

IMPORTANT NOTES:
* data\ folder is  only added as a part of a feature release, and is left for immediate start-up without any prior training, future pushes will not be made for \data\.
* sample.txt is AI Generated and has be added for immediate exploration of the system; future pushes will not have any new changes.
* everything in main.py is from test.py; it is hard-tested and hence main.py is free for any errors.
---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rag-engine.git
cd rag-engine
```

---

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 3. Download embedding model

Download from:
https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2

Place inside:

```
model/all-MiniLM-L6-v2/
```

---

### 4. Run the system

```bash
python main.py
```

---

## 🧪 Example

**sample.txt may either have or not have this!**
```
Ask something: What is Python?

Top Matches:

- Python is a programming language used for AI and web development.
```

---

## 🧠 How it Works

1. Text is split into meaningful chunks
2. Each chunk is converted into embeddings
3. FAISS indexes embeddings for fast search
4. Query is embedded and compared
5. Relevant chunks are retrieved and ranked

---

## 🔌 Extensibility

This system is designed to be extended:

* 🔹 Plug in LLMs (OpenAI, local models, etc.)
* 🔹 Add PDF or document ingestion **(done in feature release; document ingestion)**
* 🔹 Replace embedding providers
* 🔹 Build APIs or UI layers

---

## 🚧 Future Improvements

* Context-aware response generation
* Multi-document ingestion (PDF, web, etc.)
* Persistent vector storage
* API backend (FastAPI)
* UI interface

---

## 🧨 Why this Project?

Most RAG implementations focus only on LLMs.

This project focuses on the **retrieval layer**, which is the foundation of any reliable RAG system.

---

## 📌 Tech Stack

* Python
* SentenceTransformers
* FAISS
* NumPy

---

## 📄 License

MIT License

---


© 2026- HARDIK BASU
