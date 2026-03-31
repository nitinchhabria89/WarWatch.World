import fs from 'fs';
import path from 'path';
import type { Conflict, DailyReport } from './types';
import { SEVERITY_ORDER } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFLICTS_FILE = path.join(DATA_DIR, 'conflicts.json');
const CACHE_DIR = path.join(DATA_DIR, 'cache');

// Vercel KV keys
const KV_CONFLICTS_KEY = 'ww:conflicts';
const KV_REPORT_DATES_KEY = 'ww:report-dates';

function kvEnabled(): boolean {
  return !!process.env.KV_REST_API_URL;
}

async function kvGet<T>(key: string): Promise<T | null> {
  const { kv } = await import('@vercel/kv');
  return kv.get<T>(key);
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const { kv } = await import('@vercel/kv');
  await kv.set(key, value);
}

async function kvSadd(key: string, ...members: string[]): Promise<void> {
  const { kv } = await import('@vercel/kv');
  await (kv.sadd as (key: string, ...members: string[]) => Promise<number>)(key, ...members);
}

async function kvSmembers(key: string): Promise<string[]> {
  const { kv } = await import('@vercel/kv');
  return (kv.smembers as (key: string) => Promise<string[]>)(key);
}

export async function getConflicts(): Promise<Conflict[]> {
  let conflicts: Conflict[];

  if (kvEnabled()) {
    const cached = await kvGet<Conflict[]>(KV_CONFLICTS_KEY);
    conflicts = cached ?? JSON.parse(fs.readFileSync(CONFLICTS_FILE, 'utf-8'));
  } else {
    conflicts = JSON.parse(fs.readFileSync(CONFLICTS_FILE, 'utf-8'));
  }

  return conflicts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
  });
}

export async function getConflictById(id: string): Promise<Conflict | undefined> {
  const conflicts = await getConflicts();
  return conflicts.find((c) => c.id === id);
}

export async function saveConflicts(conflicts: Conflict[]): Promise<void> {
  if (kvEnabled()) {
    await kvSet(KV_CONFLICTS_KEY, conflicts);
  } else {
    fs.writeFileSync(CONFLICTS_FILE, JSON.stringify(conflicts, null, 2));
  }
}

export async function getReport(date: string): Promise<DailyReport | null> {
  if (kvEnabled()) {
    return kvGet<DailyReport>(`ww:report:${date}`);
  }
  const file = path.join(CACHE_DIR, `report-${date}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export async function saveReport(report: DailyReport): Promise<void> {
  if (kvEnabled()) {
    await kvSet(`ww:report:${report.date}`, report);
    await kvSadd(KV_REPORT_DATES_KEY, report.date);
  } else {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const file = path.join(CACHE_DIR, `report-${report.date}.json`);
    fs.writeFileSync(file, JSON.stringify(report, null, 2));
  }
}

export async function listReportDates(): Promise<string[]> {
  if (kvEnabled()) {
    const dates = await kvSmembers(KV_REPORT_DATES_KEY);
    return dates.sort((a, b) => b.localeCompare(a));
  }
  if (!fs.existsSync(CACHE_DIR)) return [];
  return fs
    .readdirSync(CACHE_DIR)
    .filter((f) => f.startsWith('report-') && f.endsWith('.json'))
    .map((f) => f.replace('report-', '').replace('.json', ''))
    .sort((a, b) => b.localeCompare(a));
}
