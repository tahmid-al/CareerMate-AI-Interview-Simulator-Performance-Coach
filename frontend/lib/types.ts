// frontend/lib/types.ts

// — Response when fetching a question
export interface QuestionResponse {
  session_id: string;
  question:   string;
}

// — Payload when submitting an answer
export interface AnswerSubmission {
  session_id: string;
  question:   string;
  answer:     string;
}

// — A single flashcard
export interface Flashcard {
  question: string;
  answer:   string;
}

// — The shape of your study-plan JSON
export interface StudyPlanTopic {
  difficulty: string;
  day_1:      string;
  day_2:      string;
  day_3:      string;
  day_4:      string;
}

// — Map from tag → plan
export interface StudyPlan {
  [tag: string]: StudyPlanTopic;
}

