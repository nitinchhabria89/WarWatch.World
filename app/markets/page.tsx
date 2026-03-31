import type { Metadata } from 'next';
import { getConflicts } from '@/lib/conflicts';
import AdUnit from '@/components/AdUnit';
import SeverityBadge from '@/components/SeverityBadge';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'Markets & Conflict Impact',
  description:
    'See how active global conflicts affect oil and gold commodity prices. Correlation table updated in real-time.',
};

const IMPACT_CLASSES: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-orange-400 bg-orange-500/10',
  low: 'text-yellow-400 bg-yellow-500/10',
  none: 'text-gray-600 bg-white/5',
};

const IMPACT_ICONS: Record<string, string> = {
  high: '🔴',
  medium: '🟠',
  low: '🟡',
  none: '⚪',
};

export default function MarketsPage() {
  const conflicts = getConflicts();
  const highImpactOil = conflicts.filter((c) => c.marketImpact.oil === 'high').length;
  const highImpactGold = conflicts.filter((c) => c.marketImpact.gold === 'high').length;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Billboard */}
      <div className="flex justify-center mb-6">
        <AdUnit slot="markets-billboard" style={{ width: 728, height: 90 }} className="hidden md:block" />
        <AdUnit slot="markets-billboard-mobile" style={{ width: 320, height: 50 }} className="md:hidden" />
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-1">Markets & Conflict Impact</h1>
        <p className="text-gray-400 text-sm">
          How active conflicts correlate with commodity price pressure
        </p>
      </div>

      <DisclaimerBanner />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Conflicts', value: conflicts.length, sub: 'being tracked', icon: '⚔️' },
          { label: 'High Oil Risk', value: highImpactOil, sub: 'conflicts', icon: '🛢️' },
          { label: 'High Gold Risk', value: highImpactGold, sub: 'conflicts', icon: '🥇' },
          {
            label: 'Risk Level',
            value: highImpactOil >= 3 ? 'Elevated' : highImpactOil >= 2 ? 'Moderate' : 'Low',
            sub: 'for commodities',
            icon: '📊',
          },
        ].map((card) => (
          <div key={card.label} className="bg-[#111827] border border-white/10 rounded-lg p-4">
            <div className="text-xl mb-1">{card.icon}</div>
            <div className="text-lg font-bold text-white">{card.value}</div>
            <div className="text-xs text-gray-400">{card.label}</div>
            <div className="text-xs text-gray-600">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Conflict → Market table */}
          <div className="bg-[#111827] border border-white/10 rounded-lg overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white">Conflict Impact on Commodities</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Conflict</th>
                    <th className="text-left px-4 py-3">Severity</th>
                    <th className="text-center px-4 py-3">🛢️ Oil</th>
                    <th className="text-center px-4 py-3">🥇 Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {conflicts.map((conflict) => (
                    <tr key={conflict.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-200">{conflict.name}</p>
                        <p className="text-gray-600 mt-0.5">{conflict.countries.join(', ')}</p>
                      </td>
                      <td className="px-4 py-3">
                        <SeverityBadge severity={conflict.severity} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize ${IMPACT_CLASSES[conflict.marketImpact.oil]}`}
                        >
                          {IMPACT_ICONS[conflict.marketImpact.oil]} {conflict.marketImpact.oil}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize ${IMPACT_CLASSES[conflict.marketImpact.gold]}`}
                        >
                          {IMPACT_ICONS[conflict.marketImpact.gold]} {conflict.marketImpact.gold}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* In-content ad */}
          <div className="flex justify-center my-4">
            <AdUnit slot="markets-in-content" style={{ width: 300, height: 250 }} />
          </div>

          {/* Key routes */}
          <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
            <p className="text-sm font-semibold text-white mb-3">Critical Chokepoints at Risk</p>
            <div className="space-y-2">
              {[
                { name: 'Strait of Hormuz', related: 'Iran–Israel–US, Yemen–Houthi', pct: '21% of global oil' },
                { name: 'Red Sea / Bab el-Mandeb', related: 'Yemen–Houthi', pct: '12% of global trade' },
                { name: 'Black Sea', related: 'Russia–Ukraine', pct: 'Wheat & fertilizer routes' },
                { name: 'South China Sea', related: 'China–Philippines', pct: '$3T annual trade' },
              ].map((route) => (
                <div key={route.name} className="flex items-start justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-gray-200">{route.name}</p>
                    <p className="text-[10px] text-gray-500">{route.related}</p>
                  </div>
                  <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-1 rounded shrink-0">
                    {route.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <AdUnit slot="markets-sidebar" style={{ width: 300, height: 600 }} />
          <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Impact Key</p>
            {Object.entries(IMPACT_ICONS).map(([level, icon]) => (
              <div key={level} className="flex items-center gap-2 py-1 text-xs">
                <span>{icon}</span>
                <span className="capitalize text-gray-400">{level}</span>
                <span className="text-gray-600 text-[10px] ml-auto">
                  {level === 'high'
                    ? 'Direct causal link'
                    : level === 'medium'
                    ? 'Indirect pressure'
                    : level === 'low'
                    ? 'Marginal effect'
                    : 'No notable effect'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 text-center px-2">
            Market correlations are analytical assessments, not financial advice. Commodity prices are driven by many factors.
          </p>
        </div>
      </div>
    </div>
  );
}
