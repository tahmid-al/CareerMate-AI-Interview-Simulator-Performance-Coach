from typing import List
import requests
import re


def generate_flashcard_prompt(tag: str) -> str:
    return f"""Create a single high-quality flashcard for the topic: '{tag}'.
Format strictly as:
Question: What is {tag}?
Answer: [A clear, concise explanation with definition, importance, or usage.]"""


def call_ollama(prompt: str, model: str = "llama2:7b"):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": model, "prompt": prompt, "stream": False}
        )
        data = response.json()
        if "response" in data:
            return data["response"]
        else:
            print(f"[⚠️ Ollama Error] Response format unexpected: {data}")
            raise ValueError("Missing 'response' in Ollama output")
    except Exception as e:
        print(f"[🔥 Ollama Exception] {e}")
        raise


def parse_flashcard(raw: str):
    match = re.search(r"Question:\s*(.*?)\nAnswer:\s*(.*)", raw, re.DOTALL)
    if match:
        return {"question": match.group(1).strip(), "answer": match.group(2).strip()}
    else:
        return {"question": "Unknown", "answer": raw.strip()}


def generate_flashcards(tags: List[str]) -> List[dict]:
    cards = []
    for tag in tags:
        prompt = generate_flashcard_prompt(tag)
        try:
            raw = call_ollama(prompt)  # ✅ Uses default llama2:7b
            card = parse_flashcard(raw)
            cards.append(card)
        except Exception as e:
            print(f"[❌ Flashcard Gen Failed for '{tag}'] {e}")
    return cards


# Fallback: static templates for development or offline mode

def generate_flashcards_from_tags(tags: List[str]) -> List[dict]:
    return [
        {
            "question": f"What is {tag}?",
            "answer": f"{tag} is an important topic. Study its concepts, challenges, and relevance."
        }
        for tag in tags
    ]
