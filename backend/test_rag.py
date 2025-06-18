# backend/test_rag.py

from rag_engine import RAGEngine

# Initialize RAG engine
rag = RAGEngine()
rag.load_data("data/questions_by_role.json")
rag.build_index()

# Sample query
query = "How do you prevent overfitting?"
results = rag.search(query, k=3)

# Print results
for res in results:
    print(f"🔹 Role: {res['role']}")
    print(f"Q: {res['question']}")
    print(f"A: {res['answer']}\n")