# backend/ai_tutor_api.py (append this)
from fastapi import APIRouter, Request
from ai_tutor_engine import generate_goal_plan

router = APIRouter()

@router.post("/ai-tutor/goal-plan")
async def goal_oriented_plan(request: Request):
    try:
        data = await request.json()
        role = data.get("role")
        days = int(data.get("days", 7))
        if not role:
            return {"error": "Missing role"}
        return generate_goal_plan(role, days)
    except Exception as e:
        return {"error": str(e)}
