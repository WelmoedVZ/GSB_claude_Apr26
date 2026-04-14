'use client';

import { QuestionType, Difficulty } from '@/types';
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/lib/constants';

interface QuestionConfigProps {
  questionType: QuestionType;
  difficulty: Difficulty;
  onTypeChange: (type: QuestionType) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  jobDescription: string;
  onJobDescriptionChange: (jd: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function QuestionConfig({
  questionType,
  difficulty,
  onTypeChange,
  onDifficultyChange,
  jobDescription,
  onJobDescriptionChange,
  onGenerate,
  loading,
}: QuestionConfigProps) {
  return (
    <div className="space-y-8">
      {/* Question Type */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Question Type
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {QUESTION_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onTypeChange(type.value)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                questionType === type.value
                  ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl">{type.icon}</div>
              <div className="mt-2 text-sm font-semibold text-gray-900">{type.label}</div>
              <div className="mt-1 text-xs text-gray-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Difficulty Level
        </h3>
        <div className="mt-3 flex gap-3">
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onDifficultyChange(level.value)}
              className={`rounded-lg border-2 px-6 py-2.5 text-sm font-medium transition-all ${
                difficulty === level.value
                  ? `${level.border} ${level.bg} ${level.color} ring-1 ring-current`
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Description (collapsible) */}
      <div>
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <span className="text-indigo-600 group-open:rotate-90 transition-transform">&#9654;</span>
            Job Description (Optional)
          </summary>
          <div className="mt-3">
            <textarea
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste a job description to generate questions tailored to that specific role..."
              rows={5}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {jobDescription.length}/3000 characters
            </p>
          </div>
        </details>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Question'}
      </button>
    </div>
  );
}
