'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { DEFAULT_PROFILE } from '@/lib/constants';
import { ParseResumeResponse, UserProfile } from '@/types';
import ProfileForm from '@/components/ProfileForm';
import ResumeUpload from '@/components/ResumeUpload';

export default function ProfilePage() {
  const { profile, setProfile, isLoaded } = useProfile();
  const [draft, setDraft] = useState<UserProfile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const [synced, setSynced] = useState(false);

  // Sync draft from localStorage once loaded
  useEffect(() => {
    if (isLoaded && !synced) {
      setDraft(profile);
      setSynced(true);
    }
  }, [isLoaded, synced, profile]);

  function handleResumeParsed(data: ParseResumeResponse) {
    const updated = {
      ...draft,
      industry: data.industry || draft.industry,
      currentRole: data.currentRole || draft.currentRole,
      experienceLevel: data.experienceLevel || draft.experienceLevel,
      skills: data.skills || draft.skills,
      careerGoals: data.careerGoals || draft.careerGoals,
      resumeText: data.summary || draft.resumeText,
    };
    setDraft(updated);
    setProfile(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleSave() {
    setProfile(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleClear() {
    const empty = { ...DEFAULT_PROFILE };
    setDraft(empty);
    setProfile(empty);
    setSaved(false);
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
      <p className="mt-2 text-gray-600">
        Set up your background to get personalized interview questions and feedback.
      </p>

      <div className="mt-8 space-y-8">
        <ResumeUpload onParsed={handleResumeParsed} />
        <ProfileForm
          profile={draft}
          onChange={setDraft}
          onSave={handleSave}
          onClear={handleClear}
          saved={saved}
        />
      </div>
    </div>
  );
}
