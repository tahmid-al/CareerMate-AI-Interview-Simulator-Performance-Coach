import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { getQuestion, submitAnswer, getFeedback, postData } from "../lib/apiClient";

interface Flashcard {
  question: string;
  answer: string;
}

export default function Interview() {
  const [role, setRole] = useState("Data Scientist");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [recording, setRecording] = useState(false);
  const [studyPlan, setStudyPlan] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let interval: any;
    if (question && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [question, timer]);

  const handleGetQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setAnswer("");
    setStudyPlan([]);
    setFlashcards([]);
    try {
      const res = await getQuestion(role);
      setQuestion(res.question);
      setSessionId(res.session_id);
      setTimer(120);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    await submitAnswer({ session_id: sessionId, question, answer });
    const res = await getFeedback(sessionId);
    setFeedback(res.feedback);
    extractTopicsAndGenerateStudyPlan(res.feedback);
  };

  const extractTopicsAndGenerateStudyPlan = async (text: string) => {
    const keywords = [];
    const patterns = [
      /technical detail/gi,
      /metrics/gi,
      /STAR format/gi,
      /role/gi,
      /passive voice/gi,
      /challenges/gi
    ];
    for (const pattern of patterns) {
      if (pattern.test(text)) keywords.push(pattern.source);
    }
    if (keywords.length === 0) return;

    const res = await postData<{ plan: string[] }>("/generate-study-plan", keywords);
    setStudyPlan(res.plan || []);
  };

  const generateFlashcards = async () => {
    const res = await postData<{ flashcards: Flashcard[] }>("/generate-flashcards", {
      topic_tags: studyPlan
    });
    setFlashcards(res.flashcards || []);
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("SpeechRecognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Head>
        <title>Interview • CareerMate</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6 text-center">AI Interview Simulator</h1>

      <div className="mb-6">
        <label className="block mb-1">Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="text-black px-3 py-2 rounded w-full">
          {["Data Scientist", "AI Researcher", "Machine Learning Engineer", "Backend Developer", "Frontend Developer", "Product Manager"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGetQuestion}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mb-6"
      >
        {loading ? "Getting Question..." : "Start Interview"}
      </button>

      {question && (
        <div className="bg-gray-800 p-4 rounded text-white mb-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Question:</h2>
            <p className="text-sm">⏱️ Time Left: {timer}s</p>
          </div>
          <p className="mt-2">{question}</p>
        </div>
      )}

      {question && (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={timer === 0}
            rows={6}
            placeholder="Type your answer here..."
            className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          ></textarea>

          <div className="flex gap-4 mb-4">
            <button onClick={handleSubmitAnswer} className="bg-green-600 px-4 py-2 rounded text-white">
              Submit Answer
            </button>

            {!recording ? (
              <button onClick={startRecording} className="bg-yellow-500 px-4 py-2 rounded text-white">
                🎙 Start Voice
              </button>
            ) : (
              <button onClick={stopRecording} className="bg-red-600 px-4 py-2 rounded text-white">
                ⏹️ Stop
              </button>
            )}
          </div>
        </>
      )}

      {feedback && (
        <div className="bg-blue-900 p-4 rounded text-white mb-6">
          <h3 className="font-bold mb-2">Feedback:</h3>
          <pre className="whitespace-pre-wrap text-sm">{feedback}</pre>
        </div>
      )}

      {studyPlan.length > 0 && (
        <div className="bg-gray-900 p-4 rounded text-white mb-6">
          <h3 className="font-bold mb-2">📚 Suggested Study Plan:</h3>
          <ul className="list-disc ml-6">
            {studyPlan.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
          <button onClick={generateFlashcards} className="mt-4 bg-purple-600 px-4 py-2 rounded text-white">
            🧠 Generate Flashcards
          </button>
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="bg-slate-800 p-4 rounded text-white">
          <h3 className="font-bold mb-2">🧠 Flashcards:</h3>
          {flashcards.map((fc, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">Q: {fc.question}</p>
              <p className="text-sm text-green-300">A: {fc.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
