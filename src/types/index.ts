export type QuestionType = 'behavioral' | 'case' | 'situational';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AnswerMode = 'text' | 'multiple-choice';

export interface UserProfile {
  name: string;
  industry: string;
  experienceLevel: string;
  careerGoals: string;
  currentRole: string;
  skills: string;
  resumeText: string;
}

export interface GenerateQuestionRequest {
  questionType: QuestionType;
  difficulty: Difficulty;
  profile?: UserProfile | null;
  jobDescription?: string | null;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface GeneratedQuestion {
  question: string;
  context?: string;
  multipleChoiceOptions: MultipleChoiceOption[];
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface EvaluateAnswerRequest {
  question: GeneratedQuestion;
  answerText?: string;
  selectedOptionId?: string;
  answerMode: AnswerMode;
  profile?: UserProfile | null;
}

export interface StarEvaluation {
  situation: { score: number; feedback: string };
  task: { score: number; feedback: string };
  action: { score: number; feedback: string };
  result: { score: number; feedback: string };
}

export interface FeedbackResponse {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  starEvaluation?: StarEvaluation;
  personalizedTips: string[];
  summary: string;
}

export interface ParseResumeResponse {
  industry: string;
  currentRole: string;
  experienceLevel: string;
  skills: string;
  careerGoals: string;
  summary: string;
}
