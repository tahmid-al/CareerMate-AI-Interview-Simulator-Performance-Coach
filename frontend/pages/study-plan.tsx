import { useState } from "react";
import { generateStudyPlan } from "../lib/apiClient";

export default function StudyPlanPage() {
  const [scoreInput, setScoreInput] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const parseF1 = (text: string) => {
    try {
      const match = text.match(/f1\s*[:=]?\s*(\d+(\.\d+)?)/i);
      if (!match) return null;
      let f1 = parseFloat(match[1]);
      if (f1 > 1) f1 /= 100;
      return Math.min(Math.max(f1, 0), 1);
    } catch {
      return null;
    }
  };

  const generatePlan = async () => {
    const f1 = parseF1(scoreInput);
    if (!f1 || !questionText.trim()) {
      setError("Please enter a valid F1 score and question.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateStudyPlan([{ question: questionText.trim(), f1 }]);
      setPlan(data);
    } catch (err) {
      setError("Failed to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-6">Study Plan Generator</h1>
      <p className="text-gray-300 mb-6">
        Enter your F1 score (with optional precision and recall), and the question you attempted.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="F1: 56 Precision: 60 Recall: 52"
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value)}
          className="px-4 py-2 text-black rounded"
        />
        <input
          type="text"
          placeholder="e.g. What is overfitting in machine learning?"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="px-4 py-2 text-black rounded"
        />
        <button
          onClick={generatePlan}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {plan && (
        <div className="text-left whitespace-pre-wrap bg-gray-800 text-white p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">📚 Generated Study Plan</h2>
          {Object.entries(plan).map(([topic, details]) => {
            const safeDetails = details as {
              difficulty: string;
              day_1: string;
              day_2: string;
              day_3: string;
              day_4: string;
            };
            return (
              <div key={topic} className="mb-6">
                <h3 className="text-indigo-300 font-bold">{topic}</h3>
                <p>🔥 <strong>Difficulty:</strong> {safeDetails.difficulty}</p>
                <p>
                  📘 <strong>Day 1:</strong>{" "}
                  <a href={safeDetails.day_1.split(" ").pop()} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
                    {safeDetails.day_1}
                  </a>
                </p>
                <p>
                  🎥 <strong>Day 2:</strong>{" "}
                  <a href={safeDetails.day_2.split(" ").pop()} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
                    {safeDetails.day_2}
                  </a>
                </p>
                <p>
                  📝 <strong>Day 3:</strong> {safeDetails.day_3}
                </p>
                <p>🧠 <strong>Day 4:</strong> {safeDetails.day_4}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}