import { NextResponse } from 'next/server';
import { getConflicts } from '@/lib/conflicts';
import type { Conflict } from '@/lib/types';

export const dynamic = 'force-dynamic';

const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

function getLastUpdated(conflicts: Conflict[]): number {
  if (!conflicts.length) return 0;
  const dates = conflicts.map((c) => new Date(c.lastUpdated).getTime()).filter(Boolean);
  return dates.length ? Math.max(...dates) : 0;
}

export async function GET(request: Request) {
  const conflicts = await getConflicts();

  // Trigger a background refresh if data is older than 1 hour.
  const lastUpdated = getLastUpdated(conflicts);
  if (Date.now() - lastUpdated > REFRESH_INTERVAL_MS) {
    const base = new URL(request.url).origin;
    fetch(`${base}/api/refresh`, { method: 'POST' }).catch(() => {});
  }

  return NextResponse.json(conflicts);
}
