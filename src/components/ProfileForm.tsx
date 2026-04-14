'use client';

import { UserProfile } from '@/types';
import { EXPERIENCE_LEVELS } from '@/lib/constants';

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onSave: () => void;
  onClear: () => void;
  saved: boolean;
}

export default function ProfileForm({ profile, onChange, onSave, onClear, saved }: ProfileFormProps) {
  function updateField(field: keyof UserProfile, value: string) {
    onChange({ ...profile, [field]: value });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Profile Details</h3>
      <p className="mt-1 text-sm text-gray-500">
        This information personalizes your interview questions and feedback.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={profile.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Your name"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <input
            id="industry"
            type="text"
            value={profile.industry}
            onChange={(e) => updateField('industry', e.target.value)}
            placeholder="e.g., Technology, Finance, Healthcare, Consulting"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="currentRole" className="block text-sm font-medium text-gray-700">
            Current Role
          </label>
          <input
            id="currentRole"
            type="text"
            value={profile.currentRole}
            onChange={(e) => updateField('currentRole', e.target.value)}
            placeholder="e.g., Software Engineer, Product Manager, Analyst"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            value={profile.experienceLevel}
            onChange={(e) => updateField('experienceLevel', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select experience level</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Key Skills
          </label>
          <input
            id="skills"
            type="text"
            value={profile.skills}
            onChange={(e) => updateField('skills', e.target.value)}
            placeholder="e.g., leadership, data analysis, project management"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700">
            Career Goals
          </label>
          <textarea
            id="careerGoals"
            value={profile.careerGoals}
            onChange={(e) => updateField('careerGoals', e.target.value)}
            placeholder="What role are you targeting? What are your career aspirations?"
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        {saved && (
          <span className="text-sm text-green-600">Profile saved to browser storage</span>
        )}
      </div>
    </div>
  );
}
