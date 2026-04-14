import { NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';
import { buildQuestionGenerationPrompt } from '@/lib/prompts';
import { GenerateQuestionRequest, GeneratedQuestion } from '@/types';

export async function POST(request: Request) {
  try {
    const body: GenerateQuestionRequest = await request.json();

    if (!body.questionType || !body.difficulty) {
      return NextResponse.json(
        { error: 'questionType and difficulty are required' },
        { status: 400 }
      );
    }

    const { systemPrompt, userMessage } = buildQuestionGenerationPrompt(
      body.questionType,
      body.difficulty,
      body.profile,
      body.jobDescription,
    );

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = parseJSON(text);

    if (!parsed || !parsed.question || !Array.isArray(parsed.multipleChoiceOptions)) {
      return NextResponse.json(
        { error: 'Failed to generate a valid question. Please try again.' },
        { status: 500 }
      );
    }

    const result: GeneratedQuestion = {
      question: parsed.question as string,
      context: (parsed.context as string) || undefined,
      multipleChoiceOptions: parsed.multipleChoiceOptions as GeneratedQuestion['multipleChoiceOptions'],
      questionType: body.questionType,
      difficulty: body.difficulty,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate question error:', error);
    return NextResponse.json(
      { error: 'Failed to generate question. Please try again.' },
      { status: 500 }
    );
  }
}

function parseJSON(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from the response
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
