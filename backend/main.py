# backend/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# Import routers and utilities
from ai_tutor_api import router as ai_tutor_router
from interview_api import router as interview_router
from generate_flashcard_api import router as flashcard_router
from generate_test_api import router as test_router

# Import fuzzy extractor + study planner
from study_plan_generator import extract_weak_topics, generate_study_plan

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (allow all origins during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🛡️ In production, restrict to frontend domain(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routers
app.include_router(interview_router)
app.include_router(flashcard_router)
app.include_router(test_router)
app.include_router(ai_tutor_router)

# Health check
@app.get("/")
async def read_root():
    return {"message": "CareerMate backend is running!"}

# Study plan generator endpoint
@app.post("/generate-study-plan")
async def generate_study_plan_endpoint(request: Request):
    score_data = await request.json()
    weak_topics = extract_weak_topics(score_data)  # 🧠 uses fuzzy matching
    return generate_study_plan(weak_topics)
