import json
import os
import re
import urllib.parse
import difflib

# Load dataset
def load_question_data(filepath=None):
    if filepath is None:
        filepath = os.path.join(os.path.dirname(__file__), "data", "careermate_full_dataset.json")
    with open(filepath, "r") as f:
        return json.load(f)

# Coursera direct course mapper + fallback
def get_direct_coursera_course(query: str) -> str:
    base = "https://www.coursera.org/learn/"
    mapping = {
        "overfitting": "regularization-in-machine-learning",
        "missing data": "data-cleaning",
        "neural network": "neural-networks-deep-learning",
        "gradient descent": "machine-learning",
        "bias variance": "intro-to-machine-learning",
        "classification": "classification-models",
        "clustering": "unsupervised-learning",
        "decision tree": "intro-to-decision-trees",
        "support vector machine": "machine-learning-svm",
        "deep learning": "deep-learning-specialization",
        "feature engineering": "feature-engineering",
        "regression": "regression-models",
        "recommendation system": "recommender-systems",
        "nlp": "natural-language-processing",
        "time series": "time-series-forecasting",
        "computer vision": "computer-vision-basics",
        "data pipeline": "data-science-methodology",
        "data visualization": "data-visualization",
        "pca": "dimensionality-reduction",
        "eda": "data-analysis-with-python",
        "imbalanced dataset": "machine-learning-data-imbalance"
    }

    for keyword, slug in mapping.items():
        if keyword in query.lower():
            return f"{base}{slug}"

    return f"https://www.coursera.org/search?query={urllib.parse.quote(query)}"

# Flashcard/demo recommendation
def suggest_flashcard_or_demo(question: str) -> str:
    lower_q = question.lower()
    if "overfitting" in lower_q:
        return "Flashcard: What is Overfitting?"
    elif "missing data" in lower_q:
        return "Demo Q: How would you handle missing values in a customer churn dataset?"
    elif "gradient descent" in lower_q:
        return "Flashcard: What is Gradient Descent?"
    elif "imbalanced" in lower_q:
        return "Demo Q: What methods address class imbalance in classification problems?"
    return "Answer a related interview question or flashcard."

# 🔍 Fuzzy topic extractor
def extract_weak_topics(score_data, threshold=0.7):
    keywords = [
        item["question"].strip().lower()
        for item in score_data
        if isinstance(item, dict)
        and "question" in item
        and isinstance(item.get("f1", 1.0), (int, float))
        and item.get("f1", 1.0) < threshold
    ]

    dataset = load_question_data()
    weak_topics = []

    for role, qas in dataset.items():
        for item in qas:
            question_text = item.get("question", "").strip().lower()
            for keyword in keywords:
                sim_score = difflib.SequenceMatcher(None, keyword, question_text).ratio()
                if keyword in question_text or question_text in keyword or sim_score > 0.75:
                    weak_topics.append({
                        "question": item["question"],
                        "answer": item["answer"],
                        "role": role,
                        "f1": next((entry["f1"] for entry in score_data if entry["question"].strip().lower() in keyword), 0.0)
                    })
                    break

    # 🛑 Fallback if nothing matched
    if not weak_topics:
        for keyword in keywords:
            weak_topics.append({
                "question": keyword.title(),
                "answer": "Explore this concept with curated articles, videos, and flashcards.",
                "role": "AI",
                "f1": 0.6
            })

    return weak_topics

# 🧠 Study plan generator
def generate_study_plan(weak_topics):
    plan = {}

    for topic in weak_topics:
        question = topic["question"]
        role = topic.get("role", "AI")
        f1 = topic.get("f1", 0.0)

        difficulty = "very hard" if f1 < 0.45 else "hard" if f1 < 0.65 else "medium"
        readable_query = "+".join(re.findall(r'\w+', question))
        youtube_link = f"https://www.youtube.com/results?search_query={readable_query}"
        article_link = f"https://www.geeksforgeeks.org/search/?q={readable_query}"
        coursera_link = get_direct_coursera_course(question)
        flashcard_or_demo = suggest_flashcard_or_demo(question)

        plan[question] = {
            "role": role,
            "difficulty": difficulty,
            "day_1": f"Read article: {article_link}",
            "day_2": f"Watch video: {youtube_link}",
            "day_3": f"Take Coursera course: {coursera_link}",
            "day_4": flashcard_or_demo
        }

    return plan
