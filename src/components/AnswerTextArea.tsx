'use client';

import { QuestionType } from '@/types';

interface AnswerTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  questionType: QuestionType;
}

export default function AnswerTextArea({ value, onChange, questionType }: AnswerTextAreaProps) {
  const placeholder =
    questionType === 'behavioral'
      ? 'Structure your answer using the STAR method:\n\nSituation: Set the context...\nTask: Describe your responsibility...\nAction: Explain what you did...\nResult: Share the outcome...'
      : questionType === 'case'
      ? 'Walk through your analysis step by step. Consider the key factors, trade-offs, and your recommendation...'
      : 'Describe what you would do and why. Consider the stakeholders involved and potential consequences...';

  const charCount = value.length;
  const minChars = 50;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={8}
        className="w-full rounded-lg border border-gray-300 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed"
      />
      <div className="mt-1 flex justify-between text-xs">
        <span className={charCount >= minChars ? 'text-green-600' : 'text-gray-400'}>
          {charCount >= minChars ? 'Minimum length met' : `${minChars - charCount} more characters needed`}
        </span>
        <span className="text-gray-400">{charCount} characters</span>
      </div>
    </div>
  );
}
