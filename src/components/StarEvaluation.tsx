import { StarEvaluation as StarEvalType } from '@/types';

interface StarEvaluationProps {
  evaluation: StarEvalType;
}

const starElements = [
  { key: 'situation' as const, label: 'Situation', description: 'Setting the context' },
  { key: 'task' as const, label: 'Task', description: 'Defining your role' },
  { key: 'action' as const, label: 'Action', description: 'What you did' },
  { key: 'result' as const, label: 'Result', description: 'The outcome' },
];

export default function StarEvaluation({ evaluation }: StarEvaluationProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-3">
        STAR Framework Evaluation
      </h3>
      <div className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
        {starElements.map(({ key, label, description }) => {
          const item = evaluation[key];
          const score = item.score;
          const barColor =
            score >= 8 ? 'bg-green-500' :
            score >= 6 ? 'bg-blue-500' :
            score >= 4 ? 'bg-amber-500' :
            'bg-red-500';

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-semibold text-gray-900">{label}</span>
                  <span className="ml-2 text-xs text-gray-500">{description}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{score}/10</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${score * 10}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">{item.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
