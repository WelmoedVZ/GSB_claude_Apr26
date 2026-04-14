import { GeneratedQuestion } from '@/types';
import { DIFFICULTY_LEVELS, QUESTION_TYPES } from '@/lib/constants';

interface QuestionDisplayProps {
  question: GeneratedQuestion;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const typeInfo = QUESTION_TYPES.find(t => t.value === question.questionType);
  const diffInfo = DIFFICULTY_LEVELS.find(d => d.value === question.difficulty);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {typeInfo?.icon} {typeInfo?.label}
        </span>
        {diffInfo && (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${diffInfo.bg} ${diffInfo.color}`}>
            {diffInfo.label}
          </span>
        )}
      </div>

      {question.context && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          <p className="font-medium text-gray-500 text-xs uppercase mb-1">Scenario Context</p>
          {question.context}
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
        {question.question}
      </h2>
    </div>
  );
}
