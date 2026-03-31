import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getConflicts, getReport, saveReport } from '@/lib/conflicts';
import type { DailyReport } from '@/lib/types';

export const dynamic = 'force-dynamic';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST() {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 503 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Return cached report if already generated today
  const cached = getReport(today);
  if (cached) return NextResponse.json(cached);

  const conflicts = getConflicts();
  const conflictSummary = conflicts
    .map((c) => `**${c.name}** (${c.severity}): ${c.status}`)
    .join('\n');

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2000,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a geopolitical intelligence analyst. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: `Generate a daily intelligence briefing for ${today}.

Current conflicts:
${conflictSummary}

Produce a JSON object with this exact structure:
{
  "headline": "string — compelling one-line briefing title",
  "summary": "string — 3-4 sentence executive summary of the global situation",
  "regions": [
    { "name": "Europe", "content": "2-3 sentences on European conflicts" },
    { "name": "Middle East", "content": "2-3 sentences on ME conflicts" },
    { "name": "Asia-Pacific", "content": "2-3 sentences on APAC conflicts" },
    { "name": "Africa & Americas", "content": "2-3 sentences on other regions" }
  ],
  "marketAnalysis": "string — 2-3 sentences on conflict impact on oil and gold markets"
}`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(text) as Omit<DailyReport, 'date' | 'generatedAt'>;

  const report: DailyReport = {
    ...parsed,
    date: today,
    generatedAt: new Date().toISOString(),
  };

  saveReport(report);
  return NextResponse.json(report);
}
