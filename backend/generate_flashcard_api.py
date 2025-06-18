from fastapi import APIRouter, Request, HTTPException
from flashcard_generator import generate_flashcards, generate_flashcards_from_tags

router = APIRouter()

@router.post("/generate-flashcards")
async def generate_flashcards_endpoint(request: Request):
    try:
        # Parse JSON body
        body = await request.json()
        tags = body.get("topic_tags")

        # Validate input
        if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
            raise HTTPException(status_code=400, detail="`topic_tags` must be a list of strings.")

        try:
            # 🧠 Try generating with Ollama
            cards = generate_flashcards(tags)
        except Exception as e:
            print(f"[⚠️ Ollama Error Triggered Fallback] {e}")
            # ⛑️ Fallback to static generator
            cards = generate_flashcards_from_tags(tags)

        return {"flashcards": cards}

    except Exception as e:
        print(f"[🔥 API Error] {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
