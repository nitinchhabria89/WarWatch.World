import fs from 'fs';
import path from 'path';
import type { Conflict, DailyReport } from './types';
import { SEVERITY_ORDER } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFLICTS_FILE = path.join(DATA_DIR, 'conflicts.json');
const CACHE_DIR = path.join(DATA_DIR, 'cache');

export function getConflicts(): Conflict[] {
  const raw = fs.readFileSync(CONFLICTS_FILE, 'utf-8');
  const conflicts: Conflict[] = JSON.parse(raw);
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
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CONFLICTS_FILE, JSON.stringify(conflicts, null, 2));
}

export function getReport(date: string): DailyReport | null {
  const file = path.join(CACHE_DIR, `report-${date}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export function saveReport(report: DailyReport): void {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, `report-${report.date}.json`);
  fs.writeFileSync(file, JSON.stringify(report, null, 2));
}

export function listReportDates(): string[] {
  if (!fs.existsSync(CACHE_DIR)) return [];
  return fs
    .readdirSync(CACHE_DIR)
    .filter((f) => f.startsWith('report-') && f.endsWith('.json'))
    .map((f) => f.replace('report-', '').replace('.json', ''))
    .sort((a, b) => b.localeCompare(a)); // newest first
}
