interface ImprovementsListProps {
  improvements: string[];
}

export default function ImprovementsList({ improvements }: ImprovementsListProps) {
  if (improvements.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-3">
        Areas for Improvement
      </h3>
      <div className="space-y-2">
        {improvements.map((item, i) => (
          <div key={i} className="flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3">
            <svg className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-sm text-gray-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
