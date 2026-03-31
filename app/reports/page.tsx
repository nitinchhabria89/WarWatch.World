import type { Metadata } from 'next';
import Link from 'next/link';
import { listReportDates, getReport } from '@/lib/conflicts';
import AdUnit from '@/components/AdUnit';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Intelligence Reports',
  description:
    'Daily AI-generated geopolitical intelligence briefings covering active global conflicts, regional breakdowns, and commodity market impact.',
};

export default function ReportsPage() {
  const dates = listReportDates();
  const latest = dates[0] ? getReport(dates[0]) : null;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Billboard */}
      <div className="flex justify-center mb-6">
        <AdUnit slot="reports-billboard" style={{ width: 728, height: 90 }} className="hidden md:block" />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Intelligence Reports</h1>
        <p className="text-gray-400 text-sm">
          AI-generated daily briefings · Updated every 24 hours
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {dates.length === 0 && !latest ? (
            <div className="bg-[#111827] border border-white/10 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-sm mb-3">No reports generated yet.</p>
              <p className="text-gray-600 text-xs">
                Reports are generated daily. The first report will appear after the scheduled job runs,
                or you can trigger one manually via <code className="text-blue-400">POST /api/generate-report</code>.
              </p>
            </div>
          ) : (
            <>
              {latest && (
                <Link
                  href={`/reports/${latest.date}`}
                  className="block bg-[#111827] border border-blue-500/30 rounded-lg p-5 hover:border-blue-500/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs text-blue-400 font-medium uppercase tracking-wide">Latest · {formatDate(latest.date)}</span>
                      <h2 className="text-white font-semibold mt-1">{latest.headline}</h2>
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-3">{latest.summary}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )}

              {dates.slice(1).map((date) => {
                const report = getReport(date);
                if (!report) return null;
                return (
                  <Link
                    key={date}
                    href={`/reports/${date}`}
                    className="block bg-[#111827] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-gray-500">{formatDate(date)}</span>
                        <p className="text-gray-300 text-sm font-medium mt-0.5">{report.headline}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        <div className="space-y-4">
          <AdUnit slot="reports-sidebar" style={{ width: 300, height: 600 }} />
          <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">About Reports</p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex gap-2"><span>📊</span><span>Covers all active conflicts</span></li>
              <li className="flex gap-2"><span>🌍</span><span>Regional breakdowns</span></li>
              <li className="flex gap-2"><span>🛢️</span><span>Oil &amp; gold market analysis</span></li>
              <li className="flex gap-2"><span>🔄</span><span>Generated daily at midnight UTC</span></li>
              <li className="flex gap-2"><span>🤖</span><span>Powered by Claude AI</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
