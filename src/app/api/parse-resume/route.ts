import { NextResponse } from 'next/server';
import anthropic from '@/lib/anthropic';
import { buildResumeParsingPrompt } from '@/lib/prompts';
import { ParseResumeResponse } from '@/types';

export async function POST(request: Request) {
  try {
    let resumeText = '';
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse');
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } else {
      const body = await request.json();
      resumeText = body.resumeText || '';
    }

    if (resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please provide more content.' },
        { status: 400 }
      );
    }

    const { systemPrompt, userMessage } = buildResumeParsingPrompt(resumeText);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = parseJSON(text);

    if (!parsed || !parsed.currentRole) {
      return NextResponse.json(
        { error: 'Failed to parse resume. Please try again.' },
        { status: 500 }
      );
    }

    const result: ParseResumeResponse = {
      industry: (parsed.industry as string) || '',
      currentRole: (parsed.currentRole as string) || '',
      experienceLevel: (parsed.experienceLevel as string) || '',
      skills: (parsed.skills as string) || '',
      careerGoals: (parsed.careerGoals as string) || '',
      summary: (parsed.summary as string) || '',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Parse resume error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume. Please try again.' },
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
