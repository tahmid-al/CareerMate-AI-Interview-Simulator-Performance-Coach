# CareerMate: AI Interview Simulator & Performance Coach

![CareerMate Banner](https://cdn.discordapp.com/attachments/1126334457432788048/1145051628649844096/careermate_banner.png)

---

## 🌟 Overview

CareerMate is a modern, open-source AI career assistant that helps users **prepare for real job interviews**, get **automated feedback with NLP scoring**, and build knowledge using **LLM-powered flashcards** and a **personalized study plan generator**. Built with **FastAPI (Python)** and **Next.js (TypeScript)**, CareerMate supports both **cloud AI models** and **local LLMs via Ollama** for offline use.

---

## 🚀 Key Features

* 🎤 **AI Interview Simulator**: Role-specific questions using RAG and LLMs (OpenAI, Ollama)
* 📊 **Automated Answer Evaluation**: NLP-based scoring (F1, Precision, Recall) with feedback
* 💾 **Session Memory**: Store Q\&A sessions locally as JSON
* 🧠 **Flashcard Generator**: Instant LLM/static flashcards from topic tags
* 📚 **Study Plan Generator**: Personalized 4-day plans with Coursera, YouTube, and GfG links
* 🌐 **Frontend**: Fully responsive dark-mode UI built with React + Tailwind
* 🐳 **Dockerized**: Full-stack containerized app with volume-mounted Ollama model support
* 🔁 **Fuzzy Topic Matching**: Flexible matching for concept keywords
* 📌 **Direct Coursera Course Slug Matching**: Intelligent resource detection
* 🎥 **Auto YouTube/GfG Search**: Learning content from trusted sources
* 🔓 **Ngrok-Compatible**: One-line public web access
* 🔣 **Multi-format Score Input**: Accepts both raw string and structured JSON
* 📈 **Demo Suggestions**: Contextual quiz/demo suggestions for weak answers
* 🧩 **Modular APIs**: Flashcards, interviews, feedback, plan — all decoupled
* 🔄 **Frontend Autocomplete-ready**: Designed for expandable UX

---

## 🏗️ Architecture

```
+------------------+           +------------------+
|   Next.js Frontend| <------> |    FastAPI Backend|
+------------------+           +------------------+
                                   |
                                   v
                      +-----------------------------+
                      |  RAGEngine (Semantic Q&A)   |
                      |  Flashcard Generator (LLM)  |
                      |  Feedback Engine (BERTScore)|
                      |  Study Plan Generator       |
                      +-----------------------------+
```

### Models Used

* `sentence-transformers/all-MiniLM-L6-v2` for semantic search
* `BERTScore` for similarity and feedback
* Ollama local models (Mistral, Phi, etc.)
* Optional: OpenAI GPT-4 / Gemini via API key

---

## 📁 Project Structure

```
carrer-mate/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── ...
├── frontend/
│   ├── pages/
│   ├── Dockerfile
│   ├── ...
├── Dockerfile             # backend Dockerfile
├── docker-compose.yml     # compose for frontend + backend
├── .gitignore
└── README.md
```

---

## 🐳 Dockerized Setup

```bash
docker-compose up --build
```

### Expose Public with ngrok

```bash
ngrok http 8000  # backend
ngrok http 3000  # frontend
```

Update frontend API URLs accordingly.

---

## ⚙️ API Endpoints

| Endpoint               | Method | Description                          |
| ---------------------- | ------ | ------------------------------------ |
| `/get-question`        | POST   | Get role-specific interview question |
| `/submit-answer`       | POST   | Submit answer and store in session   |
| `/get-feedback`        | GET    | NLP-based feedback + scoring         |
| `/generate-flashcards` | POST   | Generate flashcards from topics      |
| `/generate-study-plan` | POST   | Personalized learning plan           |
| `/`                    | GET    | API health check                     |

---

## 🧪 Demo Flow

```bash
uvicorn main:app --reload
```

### 1. Get a Question

```json
{ "role": "Data Scientist" }
```

### 2. Submit an Answer

```json
{ "session_id": "...", "question": "...", "answer": "..." }
```

### 3. Get a Study Plan

```json
[{ "question": "What is overfitting?", "f1": 0.56 }]
```

### 4. Generate Flashcards

```json
{ "topic_tags": ["overfitting"] }
```

---

## 📦 Tech Stack

| Frontend | Backend   | AI/NLP Models         | Infra  |
| -------- | --------- | --------------------- | ------ |
| Next.js  | FastAPI   | Ollama, OpenAI        | Docker |
| React    | LangChain | BERTScore             | ngrok  |
| Tailwind | Faiss     | Sentence Transformers | GitHub |

---

## 📄 .gitignore Sample

```txt
node_modules/
__pycache__/
.next/
.env
.ollama/
*.log
```

---

## 👤 Author

**Tahmid Al Kawsar Chowdhury**
AI & Full-Stack Engineer | Final Year @ Woosong University
GitHub: [@tahmidalkawsarchowdhury](https://github.com/tahmidalkawsarchowdhury)

---

## 📜 License & Contributions

MIT License. PRs welcome. Fork the repo, make your changes, and open a PR.

> “CareerMate isn’t just an app — it’s your AI mentor.”

---
# CareerMate-AI-Interview-Simulator-Performance-Coach
