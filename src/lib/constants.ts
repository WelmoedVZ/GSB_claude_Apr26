import { UserProfile } from '@/types';

export const QUESTION_TYPES = [
  {
    value: 'behavioral' as const,
    label: 'Behavioral (STAR)',
    description: 'Tell me about a time when...',
    icon: '🎯',
  },
  {
    value: 'case' as const,
    label: 'Open-ended Case',
    description: 'Analyze a business scenario',
    icon: '💼',
  },
  {
    value: 'situational' as const,
    label: 'Situational Judgment',
    description: 'What would you do if...',
    icon: '🧭',
  },
];

export const DIFFICULTY_LEVELS = [
  { value: 'easy' as const, label: 'Easy', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { value: 'medium' as const, label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: 'hard' as const, label: 'Hard', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  industry: '',
  experienceLevel: '',
  careerGoals: '',
  currentRole: '',
  skills: '',
  resumeText: '',
};
