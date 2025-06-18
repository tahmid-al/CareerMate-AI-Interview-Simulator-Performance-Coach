from bert_score import score as bert_score
import requests
import random

def generate_reference_answer(question: str) -> str:
    prompt = f"Give a strong sample interview answer for:\n{question}"
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "mistral", "prompt": prompt, "stream": False}
        )
        return response.json()["response"].strip()
    except Exception as e:
        return "I developed a machine learning model to improve customer retention by identifying high-risk churn users."

def generate_feedback(question: str, answer: str) -> str:
    reference = generate_reference_answer(question)

    if not answer.strip():
        return "❌ You didn’t provide an answer. Try to write something!"
    elif len(answer.split()) < 20:
        return "⚠️ Your answer is too short. Try to elaborate with examples, tools used, or the outcome."
    elif any(phrase in answer.lower() for phrase in ["i don't know", "not sure", "can't say"]):
        return "⚠️ Avoid uncertainty. Interviewers expect confident, experience-based responses."

    try:
        P, R, F1 = bert_score([answer], [reference], lang="en", verbose=False, device="cpu")
        f1, p, r = F1.item(), P.item(), R.item()

        # 🎯 Intelligent coaching tips
        tips = [
            "🛠 Add more technical detail or tools used.",
            "📊 Include results or metrics to show impact.",
            "🧠 Make sure your answer follows the STAR format (Situation, Task, Action, Result).",
            "🎯 Clarify your core role and decision-making contribution.",
            "🔁 Avoid passive voice — be clear about what YOU did.",
            "🔍 Consider mentioning challenges and how you overcame them.",
        ]

        # Feedback based on F1 thresholds
        if f1 < 0.50:
            summary = "⚠️ Your answer needs significant improvement. Try to match the intent of the question more closely."
        elif f1 < 0.70:
            summary = "✅ Your answer is decent but can be made stronger."
        else:
            summary = "✅ Your response is meaningful."

        return (
            f"{summary}\n"
            f"F1 Score: {f1:.2f}, Precision: {p:.2f}, Recall: {r:.2f}.\n"
            f"{random.choice(tips)}"
        )

    except Exception as e:
        return f"❌ Feedback generation failed: {str(e)}"
