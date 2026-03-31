export type Severity = 'war' | 'escalating' | 'instability' | 'stable';

export interface ConflictEvent {
  date: string; // YYYY-MM-DD
  description: string;
  tags: string[];
  source?: string;
}

export interface MarketImpact {
  oil: 'high' | 'medium' | 'low' | 'none';
  gold: 'high' | 'medium' | 'low' | 'none';
}

export interface Conflict {
  id: string;
  name: string;
  countries: string[];
  countryCodes: string[]; // ISO 3166-1 alpha-2
  severity: Severity;
  status: string;
  summary: string;
  startDate: string;
  lastUpdated: string;
  tags: string[];
  events: ConflictEvent[];
  marketImpact: MarketImpact;
  pinned?: boolean;       // Always shown first, regardless of severity sort
  globalImpact?: string;  // One-line summary of wider world impact
}

export interface DailyReport {
  date: string; // YYYY-MM-DD
  headline: string;
  summary: string;
  regions: {
    name: string;
    content: string;
  }[];
  marketAnalysis: string;
  generatedAt: string; // ISO timestamp
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const SEVERITY_ORDER: Record<Severity, number> = {
  war: 0,
  escalating: 1,
  instability: 2,
  stable: 3,
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  war: '#EF4444',
  escalating: '#F97316',
  instability: '#EAB308',
  stable: '#22C55E',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  war: 'Active War',
  escalating: 'Escalating',
  instability: 'Instability',
  stable: 'Stable',
};
