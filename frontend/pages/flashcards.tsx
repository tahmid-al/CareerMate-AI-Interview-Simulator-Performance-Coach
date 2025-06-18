import { useState } from "react";
import FlashcardCard from "../components/FlashcardCard";
import { getFlashcards } from "../lib/apiClient";

interface Flashcard {
  question: string;
  answer: string;
}

export default function FlashcardsPage() {
  const [tags, setTags] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    const list = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    if (!list.length) {
      setError("Please enter at least one topic.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getFlashcards(list);
      setCards(res.flashcards || []);
    } catch (err) {
      console.error(err);
      setError("Failed to generate flashcards.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Flashcard Generator</h1>
      <p className="text-gray-300 mb-6">Enter topics to generate flashcards with AI</p>
      <input
        type="text"
        placeholder="e.g. Overfitting, Neural Networks"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full max-w-xl px-4 py-2 text-black rounded mb-4"
      />
      <button
        onClick={generate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded mb-6"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <div className="space-y-4">
        {cards.length === 0 && !loading && (
          <p className="text-gray-400">No flashcards yet. Enter a topic to begin.</p>
        )}
        {cards.map((card, i) => (
          <FlashcardCard key={i} question={card.question} answer={card.answer} />
        ))}
      </div>
    </div>
  );
}