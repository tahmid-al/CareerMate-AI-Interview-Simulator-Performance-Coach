import random
import re
import urllib.parse
import json
import os

# Load existing dataset (QA + roles)
def load_dataset(path="data/careermate_full_dataset.json"):
    with open(path, "r") as f:
        return json.load(f)

def get_youtube_link(topic: str) -> str:
    query = "+".join(re.findall(r"\w+", topic))
    return f"https://www.youtube.com/results?search_query={query}"

def get_article_link(topic: str) -> str:
    query = "+".join(re.findall(r"\w+", topic))
    return f"https://www.geeksforgeeks.org/search/?q={query}"

def get_coursera_link(topic: str) -> str:
    mapping = {
        "cnn": "convolutional-neural-networks",
        "rnn": "recurrent-neural-networks",
        "transformer": "attention-mechanism",
        "overfitting": "regularization-in-machine-learning",
        "gradient descent": "machine-learning",
        "neural network": "neural-networks-deep-learning",
        "bias variance": "intro-to-machine-learning",
    }
    for k, v in mapping.items():
        if k in topic.lower():
            return f"https://www.coursera.org/learn/{v}"
    return f"https://www.coursera.org/search?query={urllib.parse.quote(topic)}"

def format_day_plan(topic, day_num):
    return {
        "topic": topic,
        "day": f"Day {day_num}",
        "article": get_article_link(topic),
        "video": get_youtube_link(topic),
        "course": get_coursera_link(topic),
        "tip": random.choice([
            "🧠 Practice with a real question.",
            "💡 Review past mistakes.",
            "🧪 Simulate an interview.",
            "🔁 Revise with flashcards."
        ])
    }

def generate_goal_plan(role: str, days: int = 7) -> dict:
    dataset = load_dataset()
    topics = []

    # Pull 20 unique role-related questions
    if role in dataset:
        qas = dataset[role]
    else:
        all_qas = sum(dataset.values(), [])
        qas = random.sample(all_qas, min(50, len(all_qas)))

    seen = set()
    for qa in qas:
        t = qa.get("question", "")
        if t and t not in seen:
            seen.add(t)
            topics.append(t)
        if len(topics) >= days:
            break

    plan = [format_day_plan(t, i+1) for i, t in enumerate(topics)]
    return {
        "role": role,
        "duration_days": days,
        "daily_plan": plan,
        "message": f"🎯 Your custom {days}-day AI Tutor plan for {role} is ready."
    }
