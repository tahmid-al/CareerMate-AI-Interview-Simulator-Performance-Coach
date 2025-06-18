// src/components/FlashcardCard.tsx

import React from "react";

type Props = {
  question: string;
  answer: string;
};

const FlashcardCard = ({ question, answer }: Props) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 m-2 border border-indigo-300 cursor-pointer hover:shadow-xl transition-shadow">
    <h3 className="text-lg font-semibold text-indigo-700">{question}</h3>
    <p className="text-gray-800 mt-2">{answer}</p>
  </div>
);

export default FlashcardCard;
