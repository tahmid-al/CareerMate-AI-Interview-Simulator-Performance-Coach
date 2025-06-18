// File: lib/apiClient.ts

import { ENDPOINTS } from "./endpoints";
import {
  QuestionResponse,
  AnswerSubmission,
  Flashcard,
  StudyPlan,
} from "./types";

// ✅ Use Cloudflare tunnel URL via .env.local
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://prostate-lee-opt-card.trycloudflare.com";

/**
 * Generic helper for POST requests.
 * @param url  The path portion of the endpoint (e.g. '/get-question')
 * @param data The payload to send
 * @returns    The JSON-decoded response body
 */
async function postData<T>(url: string, data: any): Promise<T> {
  const fullUrl = `${BASE_URL}${url}`;
  const res = await fetch(fullUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} — ${text}`);
  }
  return (await res.json()) as T;
}

/**
 * Fetches a new interview question for the given role.
 * @param role  e.g. "Data Scientist"
 */
export function getQuestion(role: string): Promise<QuestionResponse> {
  return postData<QuestionResponse>(ENDPOINTS.GET_QUESTION, { role });
}

/**
 * Submits the candidate's answer.
 * @param payload  { session_id, question, answer }
 */
export function submitAnswer(payload: AnswerSubmission): Promise<{ message: string }> {
  return postData<{ message: string }>(ENDPOINTS.SUBMIT_ANSWER, payload);
}

/**
 * Retrieves feedback for the given session.
 * Uses a GET with query param `session_id`.
 */
export async function getFeedback(session_id: string): Promise<{ feedback: string }> {
  const url = `${BASE_URL}${ENDPOINTS.GET_FEEDBACK}?session_id=${encodeURIComponent(session_id)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} — ${text}`);
  }
  return (await res.json()) as { feedback: string };
}

/**
 * Generates flashcards for the given list of topic tags.
 * @param tags  e.g. ["ML:Overfitting", "Bias-Variance Tradeoff"]
 */
export function getFlashcards(tags: string[]): Promise<{ flashcards: Flashcard[] }> {
  return postData<{ flashcards: Flashcard[] }>(ENDPOINTS.GENERATE_FLASHCARDS, {
    topic_tags: tags,
  });
}

/**
 * Generates a study plan based on score data array.
 * @param data  Array of objects with { id, f1, precision, recall } or similar.
 */
export function generateStudyPlan(data: any): Promise<StudyPlan> {
  return postData<StudyPlan>(ENDPOINTS.GENERATE_STUDY_PLAN, data);
}

/**
 * Generates a goal-based study plan for a given role and time frame.
 * @param payload  { role: string, days: number }
 */
export function generateGoalPlan(payload: { role: string, days: number }): Promise<any> {
  return postData<any>("/ai-tutor/goal-plan", payload);
}

// ✅ Fix for Docker Build: export postData explicitly
export { postData };