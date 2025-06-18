import { useEffect, useState } from "react";
import Layout from "../components/Layout";

interface TestSession {
  role: string;
  date: string;
  questions: {
    question: string;
    userAnswer: string;
    feedback: string;
    f1: number;
    precision: number;
    recall: number;
  }[];
  summary: {
    f1: number;
    precision: number;
    recall: number;
  };
}

export default function TestHistoryPage() {
  const [sessions, setSessions] = useState<TestSession[]>([]);

  useEffect(() => {
    const items: TestSession[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("careerMate_test_")) {
        const value = localStorage.getItem(key);
        if (value) items.push(JSON.parse(value));
      }
    }
    setSessions(items.sort((a, b) => b.date.localeCompare(a.date))); // newest first
  }, []);

  return (
    <Layout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">📂 My Test History</h1>
        {sessions.length === 0 ? (
          <p>No saved test results found.</p>
        ) : (
          sessions.map((s, idx) => (
            <div key={idx} className="border p-4 mb-6 rounded shadow bg-white text-black">
              <p><strong>🧑‍💼 Role:</strong> {s.role}</p>
              <p><strong>📅 Date:</strong> {new Date(s.date).toLocaleString()}</p>
              <p><strong>🎯 Avg F1:</strong> {s.summary.f1.toFixed(2)}</p>
              <p><strong>📊 Precision:</strong> {s.summary.precision.toFixed(2)}</p>
              <p><strong>📥 Recall:</strong> {s.summary.recall.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
