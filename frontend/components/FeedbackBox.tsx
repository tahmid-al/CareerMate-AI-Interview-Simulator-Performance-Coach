// src/components/FeedbackBox.tsx
type Props = {
  feedback: string;
};

const FeedbackBox = ({ feedback }: Props) => (
  <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded-xl whitespace-pre-line">
    <strong>Feedback:</strong>
    <p>{feedback}</p>
  </div>
);

export default FeedbackBox;