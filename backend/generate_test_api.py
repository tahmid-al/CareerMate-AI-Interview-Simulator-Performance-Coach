# backend/generate_test_api.py
from fastapi import APIRouter, Request
import random

router = APIRouter()

@router.post("/generate-test")
async def generate_test(request: Request):
    body = await request.json()
    role = body.get("role", "Data Scientist")

    question_bank = [
        {
            "question": f"What are key skills for a {role}?",
            "options": ["Python", "SQL", "Machine Learning", "All of the above"],
            "answer": "All of the above"
        },
        {
            "question": f"What is overfitting in ML?",
            "options": ["High bias", "High variance", "Perfect accuracy", "Low recall"],
            "answer": "High variance"
        },
        {
            "question": f"Which algorithm is suitable for classification tasks?",
            "options": ["K-Means", "Linear Regression", "Decision Tree", "PCA"],
            "answer": "Decision Tree"
        },
        {
            "question": f"What is the purpose of cross-validation?",
            "options": [
                "Reduce overfitting", "Improve GPU usage", "Tune epochs", "None of the above"
            ],
            "answer": "Reduce overfitting"
        },
        {
            "question": f"What does the 'dropout' layer prevent in neural networks?",
            "options": ["Underfitting", "Overfitting", "Bias", "Noise"],
            "answer": "Overfitting"
        },
        {
            "question": f"Which metric is best for imbalanced classification?",
            "options": ["Accuracy", "Precision", "Recall", "F1-score"],
            "answer": "F1-score"
        },
        {
            "question": f"What is the purpose of a confusion matrix?",
            "options": [
                "Show training speed", "Visualize model errors", "Optimize GPU", "Track logs"
            ],
            "answer": "Visualize model errors"
        },
        {
            "question": f"What does PCA stand for?",
            "options": [
                "Principal Component Analysis", "Partial Classification Approach",
                "Python Coded Algorithm", "Primary Clustering Algorithm"
            ],
            "answer": "Principal Component Analysis"
        },
        {
            "question": f"What is a hyperparameter in ML?",
            "options": [
                "Trainable layer weight", "Optimizer result", "Pre-set tuning value", "Loss function output"
            ],
            "answer": "Pre-set tuning value"
        },
        {
            "question": f"What’s the key idea behind gradient descent?",
            "options": [
                "Climbing hill", "Gradient increase", "Loss minimization", "Accuracy boosting"
            ],
            "answer": "Loss minimization"
        }
    ]

    questions = random.choices(question_bank, k=20)

    return {"questions": questions}