import { NextResponse } from 'next/server';
import { getConflicts, saveConflicts } from '@/lib/conflicts';
import { fetchConflictNews } from '@/lib/newsapi';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!process.env.NEWSAPI_KEY) {
    return NextResponse.json({ error: 'NEWSAPI_KEY not configured' }, { status: 503 });
  }

  const conflicts = await getConflicts();
  const today = new Date().toISOString().slice(0, 10);
  let updated = 0;
  const log: Record<string, number> = {};

  for (const conflict of conflicts) {
    const newEvents = await fetchConflictNews(conflict);
    log[conflict.id] = newEvents.length;

    if (newEvents.length > 0) {
      // Prepend new events, deduplicate by first 100 chars of description
      const existingSnippets = new Set(conflict.events.map((e) => e.description.slice(0, 100)));
      const fresh = newEvents.filter((e) => !existingSnippets.has(e.description.slice(0, 100)));
      if (fresh.length > 0) {
        conflict.events = [...fresh, ...conflict.events].slice(0, 20);
        conflict.lastUpdated = today;
        updated++;
      }
    }
  }

  await saveConflicts(conflicts);
  return NextResponse.json({ updated, timestamp: new Date().toISOString(), newsPerConflict: log });
}
