# File: backend/generate_question_llm.py

import requests
import random

# Store previously generated questions in memory (temp for this session)
past_questions = set()

def generate_dynamic_question(role: str, model: str = "mistral", max_attempts: int = 5) -> str:
    prompt_base = (
        f"Create a unique, intellectually challenging interview question for a {role}. "
        f"It should assess critical thinking, creativity, or domain-specific depth. "
        f"Do not use generic phrases like 'describe a time...'."
    )

    for attempt in range(max_attempts):
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={"model": model, "prompt": prompt_base, "stream": False},
                timeout=15
            )
            data = response.json()
            question = data.get("response", "").strip()

            if question and question not in past_questions:
                past_questions.add(question)
                return question
        except Exception as e:
            print(f"[⚠️ LLM Gen Error Attempt {attempt+1}] {e}")

    # Fallback if repeated or failed
    fallback = f"What is the most complex challenge you faced as a {role}, and how did you solve it?"
    return fallback if fallback not in past_questions else f"What would you improve in your previous {role} role?"