'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { COUNTRIES, flagEmoji, type Country } from '@/lib/countries';
import type { CountryRiskData } from '@/app/api/country-risk/route';
import AdUnit from '@/components/AdUnit';
import DisclaimerBanner from '@/components/DisclaimerBanner';

// ── Cache helpers ─────────────────────────────────────────────────────────────
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

function getCached(code: string): CountryRiskData | null {
  try {
    const raw = localStorage.getItem(`ww_cr:${code}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: CountryRiskData; ts: number };
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(`ww_cr:${code}`); return null; }
    return data;
  } catch { return null; }
}

function setCached(code: string, data: CountryRiskData) {
  try { localStorage.setItem(`ww_cr:${code}`, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

// ── Severity helpers ──────────────────────────────────────────────────────────
function scoreToLevel(score: number): { label: string; color: string; bg: string; border: string } {
  if (score >= 70) return { label: 'CRITICAL', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/40' };
  if (score >= 45) return { label: 'HIGH',     color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' };
  if (score >= 25) return { label: 'ELEVATED', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' };
  return              { label: 'LOW',      color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/40' };
}

function scoreColor(score: number) {
  if (score >= 70) return '#EF4444';
  if (score >= 45) return '#F97316';
  if (score >= 25) return '#EAB308';
  return '#22C55E';
}

// ── Circular Gauge ────────────────────────────────────────────────────────────
function CircularGauge({ score }: { score: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const offset = C - (score / 100) * C;
  const color = scoreColor(score);

  return (
    <svg viewBox="0 0 120 120" className="w-36 h-36">
      <circle cx="60" cy="60" r={R} fill="none" stroke="#1f2937" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={R}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={C}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="60" y="55" textAnchor="middle" fill="white" fontSize="26" fontFamily="monospace" fontWeight="bold">
        {score}
      </text>
      <text x="60" y="72" textAnchor="middle" fill="#6b7280" fontSize="10">
        / 100
      </text>
    </svg>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function DimensionBar({ label, score, icon }: { label: string; score: number; icon: string }) {
  const color = score >= 70 ? 'bg-red-500' : score >= 45 ? 'bg-orange-500' : score >= 25 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-300 flex items-center gap-1.5"><span>{icon}</span>{label}</span>
        <span className="text-xs font-mono text-gray-400">{score}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />;
}

// ── Trend badge ───────────────────────────────────────────────────────────────
function TrendBadge({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up')     return <span className="text-red-400 text-xs">↑ Rising</span>;
  if (trend === 'down')   return <span className="text-green-400 text-xs">↓ Falling</span>;
  return                         <span className="text-gray-400 text-xs">→ Stable</span>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CountryRiskClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected]   = useState<Country | null>(null);
  const [search, setSearch]       = useState('');
  const [dropOpen, setDropOpen]   = useState(false);
  const [data, setData]           = useState<CountryRiskData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState(false);
  const [detecting, setDetecting] = useState(false);
  const dropRef                   = useRef<HTMLDivElement>(null);

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  // ── Load analysis for a country ────────────────────────────────────────────
  const loadCountry = useCallback(async (country: Country, force = false) => {
    setSelected(country);
    setError(null);
    setDropOpen(false);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('country', country.code);
    router.replace(`/country-risk?${params.toString()}`, { scroll: false });

    // Update page title
    document.title = `${country.name} War Risk Assessment 2026 — WarWatch.World`;

    // Check cache
    if (!force) {
      const cached = getCached(country.code);
      if (cached) { setData(cached); return; }
    }

    setLoading(true);
    setData(null);

    try {
      const res = await fetch(`/api/country-risk?country=${country.code}&name=${encodeURIComponent(country.name)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: CountryRiskData = await res.json();
      setCached(country.code, json);
      setData(json);
    } catch (e) {
      // Try to show stale cache on error
      const stale = getCached(country.code);
      if (stale) { setData(stale); }
      else { setError('Analysis temporarily unavailable. Please try again.'); }
    } finally {
      setLoading(false);
    }
  }, [router, searchParams]);

  // ── Init: URL param or IP detection ────────────────────────────────────────
  useEffect(() => {
    const paramCode = searchParams.get('country')?.toUpperCase();
    if (paramCode) {
      const found = COUNTRIES.find((c) => c.code === paramCode);
      if (found) { loadCountry(found); return; }
    }

    // Auto-detect via ipapi.co
    setDetecting(true);
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((d) => {
        const found = COUNTRIES.find((c) => c.code === d.country_code);
        if (found) loadCountry(found);
      })
      .catch(() => {})
      .finally(() => setDetecting(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  // ── Share button ─────────────────────────────────────────────────────────────
  function handleShare() {
    const url = `${window.location.origin}/country-risk?country=${selected?.code ?? ''}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const level = data ? scoreToLevel(data.overallScore) : null;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Billboard ad */}
      <div className="flex justify-center mb-6">
        <AdUnit slot="country-risk-billboard" style={{ width: 728, height: 90 }} className="hidden md:block" />
        <AdUnit slot="country-risk-billboard-mobile" style={{ width: 320, height: 50 }} className="md:hidden" />
      </div>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Country Risk Assessment</h1>
        <p className="text-sm text-gray-400 mt-1">
          AI analysis of how active global conflicts affect any country — economic, energy, security and trade risks.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Country Selector */}
      <div className="relative mb-6" ref={dropRef}>
        <button
          onClick={() => setDropOpen((v) => !v)}
          className="w-full md:w-80 flex items-center justify-between gap-3 px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-sm hover:border-white/20 transition-colors"
        >
          <span className="flex items-center gap-2 text-left">
            {detecting ? (
              <span className="text-gray-500 text-xs">Detecting your location…</span>
            ) : selected ? (
              <>
                <span className="text-xl leading-none">{flagEmoji(selected.code)}</span>
                <span className="text-white">{selected.name}</span>
                <span className="text-gray-500 text-xs font-mono">{selected.code}</span>
              </>
            ) : (
              <span className="text-gray-500">Select your country</span>
            )}
          </span>
          <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${dropOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropOpen && (
          <div className="absolute z-50 mt-1 w-full md:w-80 bg-[#111827] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <input
                autoFocus
                type="text"
                placeholder="Search countries…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-xs text-gray-500">No countries found</li>
              )}
              {filtered.map((c) => (
                <li key={c.code}>
                  <button
                    onClick={() => { setSearch(''); loadCountry(c); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5 ${selected?.code === c.code ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300'}`}
                  >
                    <span className="text-lg leading-none w-7">{flagEmoji(c.code)}</span>
                    <span className="flex-1">{c.name}</span>
                    <span className="text-[10px] font-mono text-gray-600">{c.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main content */}
      {!selected && !detecting && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🌍</div>
          <p className="text-gray-400">Select a country above to view its conflict risk assessment.</p>
        </div>
      )}

      {(selected || detecting) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / main column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Hero card */}
            <div className={`border rounded-xl p-5 ${level ? `${level.bg} ${level.border}` : 'border-white/10 bg-[#111827]'}`}>
              {loading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="w-36 h-36 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
              ) : data && selected ? (
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <CircularGauge score={data.overallScore} />
                  <div className="text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                      <span className="text-3xl">{flagEmoji(selected.code)}</span>
                      <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Overall Risk Score</p>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-widest ${level!.color} ${level!.bg} border ${level!.border}`}>
                      {level!.label}
                    </span>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {copied ? (
                          <><span className="text-green-400">✓</span> Link copied!</>
                        ) : (
                          <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>Share</>
                        )}
                      </button>
                      <button
                        onClick={() => loadCountry(selected, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-3">{error}</p>
                  {selected && (
                    <button onClick={() => loadCountry(selected, true)} className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors">
                      Retry
                    </button>
                  )}
                </div>
              ) : null}
            </div>

            {/* Five dimensions */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Risk Dimensions</h3>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-7" />)}
                </div>
              ) : data ? (
                <div className="space-y-4">
                  <DimensionBar label="Economic Impact"        score={data.economicScore}  icon="🔴" />
                  <DimensionBar label="Energy & Oil Security"  score={data.energyScore}    icon="⚡" />
                  <DimensionBar label="Physical Security"      score={data.securityScore}  icon="🛡️" />
                  <DimensionBar label="Trade & Supply Chain"   score={data.tradeScore}     icon="🚢" />
                  <DimensionBar label="Migration Pressure"     score={data.migrationScore} icon="🚶" />
                </div>
              ) : (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-7" />)}
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">AI Risk Analysis</h3>
                <span className="text-[10px] text-gray-600">AI-generated · Updated every 6 hours</span>
              </div>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : data ? (
                <p className="text-sm text-gray-300 leading-relaxed">{data.summary}</p>
              ) : (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4" />)}
                </div>
              )}
            </div>

            {/* Relevant Conflicts */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Relevant Conflicts</h3>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
                </div>
              ) : data ? (
                data.relevantConflicts.length > 0 ? (
                  <div className="space-y-2">
                    {data.relevantConflicts.map((name) => (
                      <Link
                        key={name}
                        href="/wars"
                        className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                      >
                        <span className="text-sm text-gray-300">{name}</span>
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No direct conflicts identified — indirect risks apply via oil prices, trade routes, and regional instability.</p>
                )
              ) : (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
                </div>
              )}
            </div>

            {/* Key Indicators Table */}
            <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white">Key Indicators</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wide">
                      <th className="text-left px-5 py-2.5">Indicator</th>
                      <th className="text-left px-5 py-2.5">Status</th>
                      <th className="text-left px-5 py-2.5">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading || !data ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="px-5 py-3"><Skeleton className="h-4 w-32" /></td>
                          <td className="px-5 py-3"><Skeleton className="h-4 w-40" /></td>
                          <td className="px-5 py-3"><Skeleton className="h-4 w-16" /></td>
                        </tr>
                      ))
                    ) : (
                      <>
                        {([
                          ['Oil Import Dependency',        data.indicators.oilDependency],
                          ['Trade Partners at Risk',       data.indicators.tradePartners],
                          ['Currency Exposure',            data.indicators.currencyExposure],
                          ['Diaspora in Conflict Zones',   data.indicators.diaspora],
                          ['Active Travel Advisories',     data.indicators.travelAdvisory],
                        ] as [string, { status: string; trend: 'up' | 'down' | 'stable' }][]).map(([label, ind]) => (
                          <tr key={label} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-5 py-3 text-gray-300 font-medium">{label}</td>
                            <td className="px-5 py-3 text-gray-400">{ind.status}</td>
                            <td className="px-5 py-3"><TrendBadge trend={ind.trend} /></td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <AdUnit slot="country-risk-sidebar" style={{ width: 300, height: 600 }} />

            <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Risk Scale</p>
              {[
                { label: 'CRITICAL', range: '70–100', color: 'text-red-400',    dot: 'bg-red-500' },
                { label: 'HIGH',     range: '45–69',  color: 'text-orange-400', dot: 'bg-orange-500' },
                { label: 'ELEVATED', range: '25–44',  color: 'text-yellow-400', dot: 'bg-yellow-500' },
                { label: 'LOW',      range: '0–24',   color: 'text-green-400',  dot: 'bg-green-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 py-1.5 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                  <span className={`font-bold ${item.color}`}>{item.label}</span>
                  <span className="text-gray-600 ml-auto font-mono">{item.range}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About This Analysis</p>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li className="flex gap-2"><span>🤖</span><span>Generated by Groq LLaMA</span></li>
                <li className="flex gap-2"><span>🔄</span><span>Cached 6 hours per country</span></li>
                <li className="flex gap-2"><span>📡</span><span>Based on live conflict data</span></li>
                <li className="flex gap-2"><span>⚠️</span><span>For informational use only</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Copied toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 text-sm rounded-lg shadow-lg">
          ✓ Link copied to clipboard
        </div>
      )}
    </div>
  );
}
