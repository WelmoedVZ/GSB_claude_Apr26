'use client';

import { UserProfile } from '@/types';
import { DEFAULT_PROFILE } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';

export function useProfile() {
  const [profile, setProfile, isLoaded] = useLocalStorage<UserProfile>(
    'interview-sim-profile',
    DEFAULT_PROFILE
  );

  const hasProfile =
    profile.industry.trim() !== '' ||
    profile.currentRole.trim() !== '' ||
    profile.resumeText.trim() !== '';

  return { profile, setProfile, hasProfile, isLoaded };
}
