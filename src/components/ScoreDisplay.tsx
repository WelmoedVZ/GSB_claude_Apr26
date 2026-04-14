interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const getColor = () => {
    if (score >= 8) return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-200', label: 'Excellent' };
    if (score >= 6) return { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200', label: 'Good' };
    if (score >= 4) return { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-200', label: 'Fair' };
    return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-200', label: 'Needs Work' };
  };

  const color = getColor();

  return (
    <div className={`flex items-center gap-4 rounded-xl ${color.bg} p-5 ring-1 ${color.ring}`}>
      <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-white ${color.text} ring-2 ${color.ring}`}>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div>
        <div className={`text-lg font-semibold ${color.text}`}>{color.label}</div>
        <div className="text-sm text-gray-600">out of 10</div>
      </div>
    </div>
  );
}
