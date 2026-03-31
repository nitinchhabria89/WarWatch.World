import fs from 'fs';
import path from 'path';
import type { Conflict, DailyReport } from './types';
import { SEVERITY_ORDER } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFLICTS_FILE = path.join(DATA_DIR, 'conflicts.json');
const CACHE_DIR = path.join(DATA_DIR, 'cache');

// On Vercel, the project directory is read-only. Use /tmp for writes so that
// the hourly refresh cron can persist updated data within the same lambda warm
// instance. Cold starts fall back to the bundled conflicts.json automatically.
const TMP_CONFLICTS = '/tmp/ww_conflicts.json';
const TMP_CACHE_DIR = '/tmp/ww_cache';

function readConflictsRaw(): Conflict[] {
  // Prefer the live-refreshed copy in /tmp (written by /api/refresh cron)
  if (fs.existsSync(TMP_CONFLICTS)) {
    try {
      return JSON.parse(fs.readFileSync(TMP_CONFLICTS, 'utf-8'));
    } catch {
      // corrupted — fall through to bundled
    }
  }
  return JSON.parse(fs.readFileSync(CONFLICTS_FILE, 'utf-8'));
}

export function getConflicts(): Conflict[] {
  const conflicts: Conflict[] = readConflictsRaw();
  return conflicts.sort((a, b) => {
    // Pinned always first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
  });
}

export function getConflictById(id: string): Conflict | undefined {
  return getConflicts().find((c) => c.id === id);
}

export function saveConflicts(conflicts: Conflict[]): void {
  // Write to /tmp so the save succeeds on Vercel (project dir is read-only)
  fs.writeFileSync(TMP_CONFLICTS, JSON.stringify(conflicts, null, 2));
}

export function getReport(date: string): DailyReport | null {
  // Check /tmp cache first, then bundled cache dir
  const tmpFile = path.join(TMP_CACHE_DIR, `report-${date}.json`);
  if (fs.existsSync(tmpFile)) {
    try { return JSON.parse(fs.readFileSync(tmpFile, 'utf-8')); } catch {}
  }
  const file = path.join(CACHE_DIR, `report-${date}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export function saveReport(report: DailyReport): void {
  fs.mkdirSync(TMP_CACHE_DIR, { recursive: true });
  const file = path.join(TMP_CACHE_DIR, `report-${report.date}.json`);
  fs.writeFileSync(file, JSON.stringify(report, null, 2));
}

export function listReportDates(): string[] {
  const dates = new Set<string>();

  // Collect from /tmp cache
  if (fs.existsSync(TMP_CACHE_DIR)) {
    fs.readdirSync(TMP_CACHE_DIR)
      .filter((f) => f.startsWith('report-') && f.endsWith('.json'))
      .forEach((f) => dates.add(f.replace('report-', '').replace('.json', '')));
  }

  // Collect from bundled cache
  if (fs.existsSync(CACHE_DIR)) {
    fs.readdirSync(CACHE_DIR)
      .filter((f) => f.startsWith('report-') && f.endsWith('.json'))
      .forEach((f) => dates.add(f.replace('report-', '').replace('.json', '')));
  }

  return [...dates].sort((a, b) => b.localeCompare(a)); // newest first
}
