import type { Metadata } from 'next';
import { getConflicts } from '@/lib/conflicts';
import AdUnit from '@/components/AdUnit';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import WarsClient from '@/components/WarsClient';

export const metadata: Metadata = {
  title: 'Active Wars & Conflicts 2025 — Live Updates',
  description:
    'Full list of every active war and armed conflict in 2025. Filter by severity, region and type. Chronological event logs, casualty data, and real-time updates on every ongoing conflict worldwide.',
  keywords: [
    'active wars 2025', 'list of wars', 'ongoing conflicts', 'armed conflicts today',
    'war list', 'current wars in the world', 'military conflicts 2025',
    'Russia Ukraine war', 'Gaza war', 'Sudan conflict', 'war updates today',
  ],
  openGraph: {
    title: 'Active Wars & Conflicts 2025 — Live Updates | WarWatch.World',
    description: 'Full list of every active war and armed conflict in 2025 with live updates, event logs and severity ratings.',
    url: 'https://warwatch.world/wars',
  },
  alternates: { canonical: 'https://warwatch.world/wars' },
};

export default function WarsPage({
  searchParams,
}: {
  searchParams: { tag?: string; severity?: string };
}) {
  const conflicts = getConflicts();
  const { tag, severity } = searchParams;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Billboard */}
      <div className="flex justify-center mb-6">
        <AdUnit slot="wars-billboard" style={{ width: 728, height: 90 }} className="hidden md:block" />
        <AdUnit slot="wars-billboard-mobile" style={{ width: 320, height: 50 }} className="md:hidden" />
      </div>

      <DisclaimerBanner />

      <WarsClient conflicts={conflicts} tag={tag} severity={severity} />
    </div>
  );
}
