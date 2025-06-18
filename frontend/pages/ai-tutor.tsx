import { useState } from "react";
import { generateGoalPlan } from "../lib/apiClient";

export default function AiTutorGoal() {
  const [role, setRole] = useState("");
  const [days, setDays] = useState(7);
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setPlan(null);

    try {
      const data = await generateGoalPlan({ role, days });
      setPlan(data);
    } catch (err) {
      alert("❌ Failed to fetch plan. Please check your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen py-20 px-4 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">
        🎯 Goal-Oriented AI Tutor
      </h1>

      <div className="max-w-xl mx-auto mb-8 text-center">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. AI Engineer"
          className="text-black w-full px-4 py-2 rounded mb-4"
        />
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="text-black w-full px-4 py-2 rounded mb-4"
          min={1}
          max={30}
        />
        <button
          onClick={generatePlan}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
        <p className="text-sm mt-2 text-indigo-200">
          Hello AI Tutor! Let’s generate your plan.
        </p>
      </div>

      {plan && (
        <div className="max-w-3xl mx-auto bg-white rounded p-6 text-black">
          <h2 className="text-2xl font-bold mb-4">
            {plan.message || "Your Plan"}
          </h2>
          {plan.daily_plan.map((day: any, i: number) => (
            <div key={i} className="mb-6">
              <h3 className="font-bold text-lg mb-1">
                {day.day}: {day.topic}
              </h3>
              <ul className="ml-4 list-disc">
                <li>
                  📘 Article: <a href={day.article} className="text-blue-600" target="_blank" rel="noopener noreferrer">{day.article}</a>
                </li>
                <li>
                  🎥 Video: <a href={day.video} className="text-blue-600" target="_blank" rel="noopener noreferrer">{day.video}</a>
                </li>
                <li>
                  🎓 Course: <a href={day.course} className="text-blue-600" target="_blank" rel="noopener noreferrer">{day.course}</a>
                </li>
                <li>💡 Tip: {day.tip}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
