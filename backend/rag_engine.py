# backend/rag_engine.py

from sentence_transformers import SentenceTransformer
import faiss
import json
import numpy as np

class RAGEngine:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.questions = []
        self.answers = []
        self.metadata = []

    def load_data(self, path="/home/w202201111/carrer-mate/backend/data/careermate_full_dataset.json"):
        with open(path, 'r') as f:
            data = json.load(f)

        # Handle flat list format
        if isinstance(data, list):
            for item in data:
                question = item.get("interview_question")
                answer = item.get("sample_response")
                role = item.get("industry", "Unknown Role")
                if question and answer:
                    self.questions.append(question)
                    self.answers.append(answer)
                    self.metadata.append({"role": role})
        else:
            # Fallback if JSON is grouped by role
            for role, qas in data.items():
                for qa in qas:
                    self.questions.append(qa["question"])
                    self.answers.append(qa["answer"])
                    self.metadata.append({"role": role})

    def build_index(self):
        embeddings = self.model.encode(self.questions, convert_to_tensor=False)
        embeddings = np.array(embeddings).astype("float32")
        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embeddings)

    def search(self, query, k=3):
        query_vec = self.model.encode([query])
        query_vec = np.array(query_vec).astype("float32")
        D, I = self.index.search(query_vec, k)
        return [
            {
                "question": self.questions[i],
                "answer": self.answers[i],
                "role": self.metadata[i]["role"]
            } for i in I[0]
        ]