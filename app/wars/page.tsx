import type { Metadata } from 'next';
import { getConflicts } from '@/lib/conflicts';
import ConflictAccordion from '@/components/ConflictAccordion';
import AdUnit from '@/components/AdUnit';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import PageHeading from '@/components/PageHeading';

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

const ALL_TAGS = ['Airstrike', 'Diplomatic', 'Sanctions', 'Military', 'Casualties', 'Humanitarian'];
const ALL_SEVERITIES = [
  { value: 'war', label: 'Active War' },
  { value: 'escalating', label: 'Escalating' },
  { value: 'instability', label: 'Instability' },
  { value: 'stable', label: 'Stable' },
];

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

      <PageHeading
        titleKey="wars.title"
        subtitleKey="wars.subtitle"
        subtitleParams={{ count: conflicts.length }}
      />

      <DisclaimerBanner />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/wars"
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !tag && !severity
              ? 'bg-white/10 border-white/20 text-white'
              : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All
        </a>

        <span className="text-gray-700 self-center text-xs">Severity:</span>
        {ALL_SEVERITIES.map((s) => (
          <a
            key={s.value}
            href={`/wars?severity=${s.value}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              severity === s.value
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {s.label}
          </a>
        ))}

        <span className="text-gray-700 self-center text-xs">Tag:</span>
        {ALL_TAGS.map((t) => (
          <a
            key={t}
            href={`/wars?tag=${t}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              tag === t
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            [{t}]
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ConflictAccordion conflicts={conflicts} filterTag={tag} filterSeverity={severity} />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <AdUnit slot="wars-sidebar" style={{ width: 300, height: 600 }} />
          <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Stats</p>
            {ALL_SEVERITIES.map((s) => {
              const count = conflicts.filter((c) => c.severity === s.value).length;
              return (
                <div key={s.value} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <span className="text-xs font-semibold text-white">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
