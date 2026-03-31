import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getConflicts } from '@/lib/conflicts';

export const dynamic = 'force-dynamic';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface CountryRiskData {
  overallScore: number;
  economicScore: number;
  energyScore: number;
  securityScore: number;
  tradeScore: number;
  migrationScore: number;
  summary: string;
  relevantConflicts: string[];
  indicators: {
    oilDependency:   { status: string; trend: 'up' | 'down' | 'stable' };
    tradePartners:   { status: string; trend: 'up' | 'down' | 'stable' };
    currencyExposure:{ status: string; trend: 'up' | 'down' | 'stable' };
    diaspora:        { status: string; trend: 'up' | 'down' | 'stable' };
    travelAdvisory:  { status: string; trend: 'up' | 'down' | 'stable' };
  };
  generatedAt: string;
}

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get('country');
  const name    = req.nextUrl.searchParams.get('name');

  if (!country || !name) {
    return NextResponse.json({ error: 'country and name required' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 503 });
  }

  const conflicts = await getConflicts();
  const conflictList = conflicts
    .map((c) => `- ${c.name} (${c.severity}): ${c.status}`)
    .join('\n');

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1200,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a geopolitical risk analyst. Always respond with valid JSON only. Never include markdown or explanation.',
      },
      {
        role: 'user',
        content: `Assess the geopolitical risk for ${name} (ISO: ${country}) based on the current active global conflicts listed below.

Active conflicts:
${conflictList}

Return a JSON object with EXACTLY these fields:
{
  "overallScore": number 0-100 (composite risk),
  "economicScore": number 0-100 (economic disruption risk),
  "energyScore": number 0-100 (energy and oil supply risk),
  "securityScore": number 0-100 (physical security risk),
  "tradeScore": number 0-100 (trade and supply chain risk),
  "migrationScore": number 0-100 (migration and refugee pressure),
  "summary": "150-200 word journalist-tone paragraph explaining specifically how the listed conflicts affect ${name} — economic, energy, security and trade impacts. Factual, no alarmism.",
  "relevantConflicts": ["array of conflict names from the list above most relevant to ${name}"],
  "indicators": {
    "oilDependency":    { "status": "one-line factual description", "trend": "up|down|stable" },
    "tradePartners":    { "status": "one-line factual description", "trend": "up|down|stable" },
    "currencyExposure": { "status": "one-line factual description", "trend": "up|down|stable" },
    "diaspora":         { "status": "one-line factual description", "trend": "up|down|stable" },
    "travelAdvisory":   { "status": "one-line factual description", "trend": "up|down|stable" }
  }
}

Base scores on real geopolitical and economic relationships. Even low-risk countries should reflect indirect oil/trade exposure (minimum ~10-15 on energyScore and tradeScore).`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';

  try {
    const data = JSON.parse(raw) as Omit<CountryRiskData, 'generatedAt'>;
    const result: CountryRiskData = { ...data, generatedAt: new Date().toISOString() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
  }
}
