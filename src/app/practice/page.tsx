'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import {
  QuestionType,
  Difficulty,
  AnswerMode,
  GeneratedQuestion,
  FeedbackResponse,
} from '@/types';
import QuestionConfig from '@/components/QuestionConfig';
import QuestionDisplay from '@/components/QuestionDisplay';
import AnswerModeToggle from '@/components/AnswerModeToggle';
import AnswerTextArea from '@/components/AnswerTextArea';
import AnswerMultipleChoice from '@/components/AnswerMultipleChoice';
import FeedbackPanel from '@/components/FeedbackPanel';
import LoadingSpinner from '@/components/LoadingSpinner';

type Phase = 'config' | 'loading-question' | 'answering' | 'loading-feedback' | 'feedback';

export default function PracticePage() {
  const { profile, hasProfile } = useProfile();

  const [phase, setPhase] = useState<Phase>('config');
  const [questionType, setQuestionType] = useState<QuestionType>('behavioral');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [jobDescription, setJobDescription] = useState('');
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [answerMode, setAnswerMode] = useState<AnswerMode>('text');
  const [answerText, setAnswerText] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState('');

  async function generateQuestion() {
    setPhase('loading-question');
    setError('');

    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionType,
          difficulty,
          profile: hasProfile ? profile : null,
          jobDescription: jobDescription.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate question');
      }

      const data: GeneratedQuestion = await res.json();
      setQuestion(data);
      setAnswerText('');
      setSelectedOptionId(null);
      setPhase('answering');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('config');
    }
  }

  async function submitAnswer() {
    if (answerMode === 'text' && answerText.trim().length < 50) {
      setError('Please write at least 50 characters.');
      return;
    }
    if (answerMode === 'multiple-choice' && !selectedOptionId) {
      setError('Please select an option.');
      return;
    }

    setPhase('loading-feedback');
    setError('');

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answerText: answerMode === 'text' ? answerText : undefined,
          selectedOptionId: answerMode === 'multiple-choice' ? selectedOptionId : undefined,
          answerMode,
          profile: hasProfile ? profile : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to evaluate answer');
      }

      const data: FeedbackResponse = await res.json();
      setFeedback(data);
      setPhase('feedback');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('answering');
    }
  }

  function resetAll() {
    setPhase('config');
    setQuestion(null);
    setAnswerText('');
    setSelectedOptionId(null);
    setFeedback(null);
    setError('');
  }

  function trySameType() {
    setQuestion(null);
    setAnswerText('');
    setSelectedOptionId(null);
    setFeedback(null);
    setError('');
    generateQuestion();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Practice Interview</h1>
        <p className="mt-2 text-gray-600">
          {hasProfile
            ? 'Questions will be personalized to your profile.'
            : 'Set up your profile for personalized questions.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 font-medium">
            Dismiss
          </button>
        </div>
      )}

      {phase === 'config' && (
        <QuestionConfig
          questionType={questionType}
          difficulty={difficulty}
          onTypeChange={setQuestionType}
          onDifficultyChange={setDifficulty}
          jobDescription={jobDescription}
          onJobDescriptionChange={setJobDescription}
          onGenerate={generateQuestion}
          loading={false}
        />
      )}

      {phase === 'loading-question' && (
        <LoadingSpinner text="Generating your interview question..." />
      )}

      {phase === 'answering' && question && (
        <div className="space-y-6">
          <QuestionDisplay question={question} />

          <AnswerModeToggle mode={answerMode} onChange={setAnswerMode} />

          {answerMode === 'text' ? (
            <AnswerTextArea
              value={answerText}
              onChange={setAnswerText}
              questionType={question.questionType}
            />
          ) : (
            <AnswerMultipleChoice
              options={question.multipleChoiceOptions}
              selectedId={selectedOptionId}
              onSelect={setSelectedOptionId}
            />
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={submitAnswer}
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Submit Answer
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="rounded-lg border border-gray-300 px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {phase === 'loading-feedback' && (
        <LoadingSpinner text="Evaluating your answer..." />
      )}

      {phase === 'feedback' && feedback && question && (
        <div className="space-y-6">
          <QuestionDisplay question={question} />

          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Your Answer</p>
            <p className="text-sm text-gray-700">
              {answerMode === 'text'
                ? answerText
                : `Option ${selectedOptionId}: ${question.multipleChoiceOptions.find(o => o.id === selectedOptionId)?.text}`}
            </p>
          </div>

          <FeedbackPanel
            feedback={feedback}
            onTryAnother={resetAll}
            onTrySameType={trySameType}
          />
        </div>
      )}
    </div>
  );
}
