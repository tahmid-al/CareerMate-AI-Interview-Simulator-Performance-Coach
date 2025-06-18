// src/hooks/useInterview.ts
import { useState } from 'react';
import { postData } from '../lib/apiClient';
import { ENDPOINTS } from '../lib/endpoints';
import { QuestionResponse, AnswerSubmission } from '../lib/types';

export default function useInterview() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuestion = async (role: string) => {
    setLoading(true);
    try {
      const res: QuestionResponse = await postData(ENDPOINTS.GET_QUESTION, { role });
      setSessionId(res.session_id);
      setQuestion(res.question);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const payload: AnswerSubmission = { session_id: sessionId, question, answer };
      await postData(ENDPOINTS.SUBMIT_ANSWER, payload);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
    setLoading(false);
  };

  const getFeedback = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINTS.GET_FEEDBACK}?session_id=${sessionId}`);
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Failed to get feedback:", error);
    }
    setLoading(false);
  };

  return {
    sessionId,
    question,
    answer,
    setAnswer,
    feedback,
    loading,
    fetchQuestion,
    submitAnswer,
    getFeedback,
  };
}