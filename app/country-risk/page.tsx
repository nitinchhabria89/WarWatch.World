import type { Metadata } from 'next';
import { Suspense } from 'react';
import CountryRiskClient from './CountryRiskClient';

export const metadata: Metadata = {
  title: 'Country War Risk Assessment 2026',
  description:
    'How current global conflicts affect your country — economic, energy, security and trade risk analysis powered by AI.',
  openGraph: {
    title: 'Country War Risk Assessment 2026 — WarWatch.World',
    description:
      'AI-powered analysis of how active global conflicts affect your country — economic, energy, security and trade risks.',
    url: 'https://warwatch.world/country-risk',
  },
  alternates: { canonical: 'https://warwatch.world/country-risk' },
};

export default function CountryRiskPage() {
  return (
    <Suspense fallback={<div className="max-w-screen-xl mx-auto px-4 py-8"><div className="animate-pulse h-8 bg-white/5 rounded w-48 mb-4" /><div className="animate-pulse h-4 bg-white/5 rounded w-80" /></div>}>
      <CountryRiskClient />
    </Suspense>
  );
}
