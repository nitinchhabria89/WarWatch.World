import type { Metadata } from 'next';
import CountryRiskClient from './CountryRiskClient';

export const metadata: Metadata = {
  title: 'Country War Risk Assessment 2026 — WarWatch.World',
  description:
    'How current global conflicts affect your country — economic, energy, security and trade risk analysis powered by AI.',
  keywords: [
    'country risk assessment', 'geopolitical risk by country', 'war risk assessment',
    'conflict impact by country', 'country security risk', 'geopolitical threat level',
    'war impact economy', 'country risk 2026', 'national security risk',
  ],
  openGraph: {
    title: 'Country War Risk Assessment 2026 — WarWatch.World',
    description:
      'AI-powered analysis of how active global conflicts affect your country — economic, energy, security and trade risks.',
    url: 'https://warwatch.world/country-risk',
  },
  alternates: { canonical: 'https://warwatch.world/country-risk' },
};

export default function CountryRiskPage() {
  return <CountryRiskClient />;
}
