# File: backend/interview_api.py

from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel
import uuid, re, json, os, random

from rag_engine import RAGEngine
from generate_feedback import generate_feedback
from generate_question_llm import generate_dynamic_question  # LLM fallback

router = APIRouter()

# ─── Initialize RAG ────────────────────────────────────────────────────────────
rag = RAGEngine()
rag.load_data("data/careermate_full_dataset.json")
rag.build_index()

# In-memory session store
SESSIONS: dict[str, dict] = {}

# ─── Request Models ─────────────────────────────────────────────────────────────
class QuestionRequest(BaseModel):
    role: str

class AnswerSubmission(BaseModel):
    session_id: str
    question: str
    answer: str

# ─── 1) Get an interview question ───────────────────────────────────────────────
@router.post("/get-question")
def get_question(req: QuestionRequest):
    role = req.role
    # Try RAG first
    results = rag.search(f"interview for {role}", k=3)

    # If RAG returns junk or empty, fall back to LLM
    fallback = False
    for r in results:
        q = r["question"]
        if "Profession" in q or "_26" in q:
            fallback = True
            break

    if fallback or not results:
        question_text = generate_dynamic_question(role)
        print(f"[⚠️ LLM Fallback] Generated question for '{role}': {question_text}")
    else:
        question_text = results[0]["question"]

    # Create new session
    session_id = str(uuid.uuid4())
    SESSIONS[session_id] = {
        "role": role,
        "qa": [{"question": question_text}]
    }

    return {"session_id": session_id, "question": question_text}

# ─── 2) Submit an answer ────────────────────────────────────────────────────────
@router.post("/submit-answer")
def submit_answer(data: AnswerSubmission):
    session = SESSIONS.get(data.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Store the candidate's answer
    session["qa"][-1]["answer"] = data.answer
    return {"message": "Answer saved. You can now call /get-feedback."}

# ─── 3) Get feedback for the last answer ────────────────────────────────────────
@router.get("/get-feedback")
def get_feedback(session_id: str = Query(..., description="Session ID returned by /get-question")):
    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    last = session["qa"][-1]
    question = last["question"]
    answer = last.get("answer", "")

    feedback = generate_feedback(question, answer)
    last["feedback"] = feedback

    # Persist session to disk
    sessions_dir = os.path.join(os.path.dirname(__file__), "sessions")
    os.makedirs(sessions_dir, exist_ok=True)
    safe = re.sub(r"[^0-9A-Za-z_-]", "_", session_id)
    with open(os.path.join(sessions_dir, f"{safe}.json"), "w") as f:
        json.dump(session, f, indent=2)

    return {"feedback": feedback}

# ─── 4) Generate a “test” of 5 random Q&A pairs ─────────────────────────────────
@router.get("/generate-test")
def generate_test(role: str = Query(..., description="Role name to pull questions for")):
    # Grab up to 20 nearest neighbors from RAG, then sample 5
    all_qas = rag.search(f"interview for {role}", k=20)
    sample = random.sample(all_qas, min(5, len(all_qas)))

    return {
        "role": role,
        "test": [
            {"question": qa["question"], "answer": qa["answer"]}
            for qa in sample
        ]
    }

# ─── 5) Save a completed test result ────────────────────────────────────────────
@router.post("/save-test-result")
def save_test_result(data: dict = Body(..., description="Arbitrary JSON payload with your test results")):
    try:
        base = os.path.dirname(__file__)
        sessions_dir = os.path.join(base, "sessions")
        os.makedirs(sessions_dir, exist_ok=True)

        # Use provided timestamp or generate a UUID
        ts = data.get("date", str(uuid.uuid4()))
        safe = re.sub(r"[^0-9A-Za-z_-]", "_", ts)

        with open(os.path.join(sessions_dir, f"test_{safe}.json"), "w") as f:
            json.dump(data, f, indent=2)

        return {"message": "Test result saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))