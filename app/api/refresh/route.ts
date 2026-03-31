import { NextResponse } from 'next/server';
import { getConflicts, saveConflicts } from '@/lib/conflicts';
import { fetchConflictNews } from '@/lib/newsapi';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!process.env.NEWSAPI_KEY) {
    return NextResponse.json({ error: 'NEWSAPI_KEY not configured' }, { status: 503 });
  }

  const conflicts = getConflicts();
  const today = new Date().toISOString().slice(0, 10);
  let updated = 0;

  for (const conflict of conflicts) {
    const newEvents = await fetchConflictNews(conflict);
    if (newEvents.length > 0) {
      // Prepend new events, deduplicate by description
      const existingDescs = new Set(conflict.events.map((e) => e.description));
      const fresh = newEvents.filter((e) => !existingDescs.has(e.description));
      if (fresh.length > 0) {
        conflict.events = [...fresh, ...conflict.events].slice(0, 20);
        conflict.lastUpdated = today;
        updated++;
      }
    }
  }

  saveConflicts(conflicts);
  return NextResponse.json({ updated, timestamp: new Date().toISOString() });
}
