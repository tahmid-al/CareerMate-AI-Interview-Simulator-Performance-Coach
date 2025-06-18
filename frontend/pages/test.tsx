import { useState } from "react";
import { postData } from "../lib/apiClient";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const roles = [
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Researcher",
  "Frontend Developer",
  "Backend Developer",
  "Product Manager"
];

export default function TestPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const generateTest = async () => {
    if (!role.trim()) {
      setError("Please select or type a role.");
      return;
    }

    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      const data = await postData<{ questions: Question[] }>("/generate-test", { role });
      setQuestions(data.questions || []);
      setAnswers({});
    } catch (err) {
      console.error(err);
      setError("Failed to generate test.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number, option: string) => {
    setAnswers(prev => ({ ...prev, [index]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getAnswerStatus = (index: number) => {
    if (!submitted) return "";
    return answers[index] === questions[index].answer
      ? "text-green-400"
      : "text-red-400";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-8">Practice Test</h1>

      <div className="text-center mb-8">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-2 text-black rounded w-full max-w-md mb-4"
        >
          <option value="">-- Select a role --</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button
          onClick={generateTest}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Test"}
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      {questions.length > 0 && (
        <>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded text-white">
                <p className="font-semibold mb-2">
                  Q{index + 1}: {q.question}
                </p>
                <ul className="space-y-2">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`q-${index}`}
                          value={opt}
                          checked={answers[index] === opt}
                          onChange={() => handleAnswer(index, opt)}
                        />
                        <span className={`text-sm ${getAnswerStatus(index)}`}>
                          {opt}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                {submitted && (
                  <p className="mt-2 text-sm italic text-yellow-300">
                    Correct Answer: {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Submit Answers
            </button>
          </div>
        </>
      )}
    </div>
  );
}