import { NextRequest, NextResponse } from 'next/server';

// Uses the same free endpoint Chrome browser uses — no API key required.
// Responses are cached by the caller (localStorage) to minimise requests.
async function googleTranslate(text: string, target: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h on edge
  if (!res.ok) throw new Error(`Translate HTTP ${res.status}`);
  const data = await res.json();
  // Response shape: [ [ [translated, original], ... ], ... ]
  return (data[0] as [string, string][]).map(([t]) => t).join('');
}

export async function POST(req: NextRequest) {
  try {
    const { texts, target } = (await req.json()) as { texts: string[]; target: string };

    if (!texts?.length || !target) {
      return NextResponse.json({ error: 'texts[] and target are required' }, { status: 400 });
    }

    // Don't translate if target is English
    if (target === 'en') {
      return NextResponse.json({ translations: texts });
    }

    // Translate all texts in parallel (batch of up to 20)
    const translations = await Promise.all(
      texts.map((t) => googleTranslate(t, target).catch(() => t)) // fallback to original on error
    );

    return NextResponse.json({ translations });
  } catch (err) {
    console.error('[translate]', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
