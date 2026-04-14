interface StrengthsListProps {
  strengths: string[];
}

export default function StrengthsList({ strengths }: StrengthsListProps) {
  if (strengths.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">
        Strengths
      </h3>
      <div className="space-y-2">
        {strengths.map((strength, i) => (
          <div key={i} className="flex gap-3 rounded-lg border-l-4 border-green-400 bg-green-50 p-3">
            <svg className="h-5 w-5 shrink-0 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-800">{strength}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
