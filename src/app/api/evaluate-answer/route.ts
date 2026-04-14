import { NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';
import { buildEvaluationPrompt } from '@/lib/prompts';
import { EvaluateAnswerRequest, FeedbackResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const body: EvaluateAnswerRequest = await request.json();

    if (!body.question || !body.answerMode) {
      return NextResponse.json(
        { error: 'question and answerMode are required' },
        { status: 400 }
      );
    }

    const selectedOption = body.selectedOptionId
      ? body.question.multipleChoiceOptions.find(o => o.id === body.selectedOptionId)
      : undefined;

    const { systemPrompt, userMessage } = buildEvaluationPrompt(
      body.question.question,
      body.question.questionType,
      body.question.difficulty,
      body.answerText,
      body.selectedOptionId,
      selectedOption?.text,
      body.question.multipleChoiceOptions,
      body.answerMode,
      body.profile,
    );

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = parseJSON(text);

    if (!parsed || typeof parsed.overallScore !== 'number' || !Array.isArray(parsed.strengths)) {
      return NextResponse.json(
        { error: 'Failed to evaluate answer. Please try again.' },
        { status: 500 }
      );
    }

    const result: FeedbackResponse = {
      overallScore: parsed.overallScore as number,
      strengths: parsed.strengths as string[],
      improvements: parsed.improvements as string[],
      starEvaluation: parsed.starEvaluation as FeedbackResponse['starEvaluation'],
      personalizedTips: (parsed.personalizedTips as string[]) || [],
      summary: (parsed.summary as string) || '',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Evaluate answer error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer. Please try again.' },
      { status: 500 }
    );
  }
}

function parseJSON(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}
