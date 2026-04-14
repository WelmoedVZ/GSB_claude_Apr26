import { FeedbackResponse } from '@/types';
import ScoreDisplay from './ScoreDisplay';
import StrengthsList from './StrengthsList';
import ImprovementsList from './ImprovementsList';
import StarEvaluation from './StarEvaluation';

interface FeedbackPanelProps {
  feedback: FeedbackResponse;
  onTryAnother: () => void;
  onTrySameType: () => void;
}

export default function FeedbackPanel({ feedback, onTryAnother, onTrySameType }: FeedbackPanelProps) {
  return (
    <div className="space-y-6">
      <ScoreDisplay score={feedback.overallScore} />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm leading-relaxed text-gray-700">{feedback.summary}</p>
      </div>

      <StrengthsList strengths={feedback.strengths} />
      <ImprovementsList improvements={feedback.improvements} />

      {feedback.starEvaluation && (
        <StarEvaluation evaluation={feedback.starEvaluation} />
      )}

      {feedback.personalizedTips.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
            Personalized Tips
          </h3>
          <div className="space-y-2">
            {feedback.personalizedTips.map((tip, i) => (
              <div key={i} className="flex gap-3 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3">
                <svg className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-800">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onTryAnother}
          className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Try Another Question
        </button>
        <button
          type="button"
          onClick={onTrySameType}
          className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Same Type, New Question
        </button>
      </div>
    </div>
  );
}
