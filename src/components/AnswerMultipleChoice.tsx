'use client';

import { MultipleChoiceOption } from '@/types';

interface AnswerMultipleChoiceProps {
  options: MultipleChoiceOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function AnswerMultipleChoice({ options, selectedId, onSelect }: AnswerMultipleChoiceProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
            selectedId === option.id
              ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              selectedId === option.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {option.id}
          </span>
          <span className="text-sm text-gray-900 leading-relaxed pt-1">
            {option.text}
          </span>
        </button>
      ))}
    </div>
  );
}
