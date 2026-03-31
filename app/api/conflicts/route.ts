import { NextResponse } from 'next/server';
import { getConflicts } from '@/lib/conflicts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const conflicts = getConflicts();
  return NextResponse.json(conflicts);
}
