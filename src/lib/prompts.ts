import { QuestionType, Difficulty, UserProfile } from '@/types';

export function buildQuestionGenerationPrompt(
  questionType: QuestionType,
  difficulty: Difficulty,
  profile?: UserProfile | null,
  jobDescription?: string | null,
) {
  const systemPrompt = `You are an expert behavioral interview coach with experience at top-tier companies (McKinsey, Google, Goldman Sachs, etc.).

Your task is to generate a single interview question with multiple choice options.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanation. Just the JSON object.

The JSON must have this exact structure:
{
  "question": "The interview question text",
  "context": "Optional scenario context or background for the question (omit if not needed)",
  "multipleChoiceOptions": [
    { "id": "A", "text": "Option A text" },
    { "id": "B", "text": "Option B text" },
    { "id": "C", "text": "Option C text" },
    { "id": "D", "text": "Option D text" }
  ]
}

For multiple choice options:
- One option should be clearly the strongest answer
- The other three should be plausible but less ideal
- Do NOT indicate which is correct in the JSON
- Make wrong answers realistic, not obviously bad`;

  let userMessage = `Generate a ${difficulty.toUpperCase()} difficulty ${getTypeLabel(questionType)} interview question.\n\n`;

  // Type-specific instructions
  if (questionType === 'behavioral') {
    userMessage += `This should be a behavioral question that starts with "Tell me about a time when..." or similar phrasing that asks about past experiences. The question should require the STAR method (Situation, Task, Action, Result) to answer well.\n\n`;
  } else if (questionType === 'case') {
    userMessage += `This should be an open-ended case question that presents a business scenario requiring structured analysis. The candidate should demonstrate analytical thinking, problem decomposition, and strategic reasoning.\n\n`;
  } else {
    userMessage += `This should be a situational judgment question that starts with "What would you do if..." or presents a hypothetical workplace situation. The question should test decision-making, professionalism, and stakeholder management.\n\n`;
  }

  // Difficulty calibration
  if (difficulty === 'easy') {
    userMessage += `Difficulty: EASY — Common scenarios, straightforward situations. Suitable for entry-level candidates.\n\n`;
  } else if (difficulty === 'medium') {
    userMessage += `Difficulty: MEDIUM — Nuanced situations requiring critical thinking and balancing competing priorities.\n\n`;
  } else {
    userMessage += `Difficulty: HARD — Complex, multi-stakeholder scenarios with ambiguity, conflicting interests, or high-stakes outcomes.\n\n`;
  }

  // Profile personalization
  if (profile && hasProfileData(profile)) {
    userMessage += `Candidate background:\n`;
    if (profile.industry) userMessage += `- Industry: ${profile.industry}\n`;
    if (profile.currentRole) userMessage += `- Current role: ${profile.currentRole}\n`;
    if (profile.experienceLevel) userMessage += `- Experience level: ${profile.experienceLevel}\n`;
    if (profile.skills) userMessage += `- Key skills: ${profile.skills}\n`;
    if (profile.careerGoals) userMessage += `- Career goals: ${profile.careerGoals}\n`;
    if (profile.resumeText) userMessage += `- Resume summary: ${profile.resumeText.slice(0, 1000)}\n`;
    userMessage += `\nTailor the question to be relevant to their background and career trajectory.\n\n`;
  }

  // Job description
  if (jobDescription && jobDescription.trim()) {
    const truncated = jobDescription.trim().slice(0, 3000);
    userMessage += `The question should be tailored to this job description:\n---\n${truncated}\n---\n\n`;
  }

  return { systemPrompt, userMessage };
}

export function buildEvaluationPrompt(
  question: string,
  questionType: QuestionType,
  difficulty: Difficulty,
  answerText: string | undefined,
  selectedOptionId: string | undefined,
  selectedOptionText: string | undefined,
  allOptions: { id: string; text: string }[],
  answerMode: 'text' | 'multiple-choice',
  profile?: UserProfile | null,
) {
  const isBehavioral = questionType === 'behavioral';

  const systemPrompt = `You are an expert interview coach providing constructive, detailed feedback on interview answers.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanation. Just the JSON object.

The JSON must have this exact structure:
{
  "overallScore": <number 1-10>,
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  ${isBehavioral ? `"starEvaluation": {
    "situation": { "score": <1-10>, "feedback": "..." },
    "task": { "score": <1-10>, "feedback": "..." },
    "action": { "score": <1-10>, "feedback": "..." },
    "result": { "score": <1-10>, "feedback": "..." }
  },` : ''}
  "personalizedTips": ["tip 1", "tip 2", ...],
  "summary": "A 2-3 sentence overall assessment"
}

Scoring guidelines:
- Be encouraging but honest
- Cite specific parts of the answer when possible
- Provide actionable, specific improvements (not generic advice)
- Score calibrated to ${difficulty} difficulty (higher difficulty = higher expectations)
- 1-3: Poor — missing critical elements
- 4-5: Below average — some good points but significant gaps
- 6-7: Good — solid answer with room for improvement
- 8-9: Excellent — comprehensive and well-structured
- 10: Outstanding — would impress at any top company`;

  let userMessage = `Evaluate the following interview answer.\n\n`;
  userMessage += `Question type: ${getTypeLabel(questionType)}\n`;
  userMessage += `Difficulty: ${difficulty}\n`;
  userMessage += `Question: ${question}\n\n`;

  if (answerMode === 'text') {
    userMessage += `The candidate's written answer:\n---\n${answerText}\n---\n\n`;
  } else {
    userMessage += `The candidate selected option ${selectedOptionId}: "${selectedOptionText}"\n\n`;
    userMessage += `All available options were:\n`;
    for (const opt of allOptions) {
      userMessage += `${opt.id}: ${opt.text}\n`;
    }
    userMessage += `\nEvaluate whether this was the strongest choice and explain why or why not.\n\n`;
  }

  if (isBehavioral) {
    userMessage += `This is a behavioral question. Evaluate using the STAR framework:\n`;
    userMessage += `- Situation: Did they set clear context? Was the scenario specific?\n`;
    userMessage += `- Task: Did they define their specific role and responsibility?\n`;
    userMessage += `- Action: Did they describe concrete, specific actions they took?\n`;
    userMessage += `- Result: Did they quantify outcomes or describe the impact?\n\n`;
  }

  if (profile && hasProfileData(profile)) {
    userMessage += `Candidate background:\n`;
    if (profile.industry) userMessage += `- Industry: ${profile.industry}\n`;
    if (profile.currentRole) userMessage += `- Role: ${profile.currentRole}\n`;
    if (profile.experienceLevel) userMessage += `- Experience: ${profile.experienceLevel}\n`;
    if (profile.careerGoals) userMessage += `- Goals: ${profile.careerGoals}\n`;
    userMessage += `\nProvide tips relevant to their career stage and goals.\n`;
  }

  return { systemPrompt, userMessage };
}

export function buildResumeParsingPrompt(resumeText: string) {
  const systemPrompt = `You extract structured profile information from resume text.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanation. Just the JSON object.

The JSON must have this exact structure:
{
  "industry": "primary industry (e.g., Technology, Finance, Healthcare)",
  "currentRole": "most recent job title",
  "experienceLevel": "entry, mid, senior, or executive",
  "skills": "comma-separated list of top 8-10 skills",
  "careerGoals": "inferred career trajectory based on experience progression",
  "summary": "2-3 sentence professional summary"
}

For experienceLevel, use:
- "entry" for 0-2 years or intern/junior roles
- "mid" for 3-6 years
- "senior" for 7-15 years or senior/lead titles
- "executive" for VP, Director, C-suite, or 15+ years`;

  const userMessage = `Extract profile information from this resume:\n\n${resumeText.slice(0, 5000)}`;

  return { systemPrompt, userMessage };
}

function getTypeLabel(type: QuestionType): string {
  switch (type) {
    case 'behavioral': return 'behavioral (STAR method)';
    case 'case': return 'open-ended case';
    case 'situational': return 'situational judgment';
  }
}

function hasProfileData(profile: UserProfile): boolean {
  return !!(profile.industry || profile.currentRole || profile.experienceLevel || profile.resumeText);
}
