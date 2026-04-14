'use client';

import { AnswerMode } from '@/types';

interface AnswerModeToggleProps {
  mode: AnswerMode;
  onChange: (mode: AnswerMode) => void;
}

export default function AnswerModeToggle({ mode, onChange }: AnswerModeToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      <button
        type="button"
        onClick={() => onChange('text')}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          mode === 'text'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Written Answer
      </button>
      <button
        type="button"
        onClick={() => onChange('multiple-choice')}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          mode === 'multiple-choice'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Multiple Choice
      </button>
    </div>
  );
}
