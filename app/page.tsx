'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Conflict, ConflictEvent, Severity } from '@/lib/types';
import { SEVERITY_COLORS, SEVERITY_LABELS, SEVERITY_ORDER } from '@/lib/types';
import CountryPanel from '@/components/CountryPanel';
import SeverityBadge from '@/components/SeverityBadge';
import AdUnit from '@/components/AdUnit';
import BreakingMarquee from '@/components/BreakingMarquee';
import { useTheme } from '@/components/ThemeProvider';
import { formatDate } from '@/lib/utils';

// Leaflet MUST be client-side only
const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false });

const TAG_ICONS: Record<string, string> = {
  Airstrike: '💥',
  Military: '⚔️',
  Diplomatic: '🤝',
  Sanctions: '📋',
  Ceasefire: '🕊️',
  Casualties: '🔴',
  Humanitarian: '🆘',
  News: '📡',
};

export default function HomePage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [selected, setSelected] = useState<Conflict | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Severity | 'all'>('all');
  const { theme } = useTheme();

  useEffect(() => {
    fetch('/api/conflicts')
      .then((r) => r.json())
      .then((data: Conflict[]) => {
        const sorted = [...data].sort(
          (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
        );
        setConflicts(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Flatten all events across conflicts, sorted newest first
  const allEvents = useMemo(() => {
    const flat: Array<{ conflict: Conflict; event: ConflictEvent }> = [];
    conflicts.forEach((c) => {
      c.events.forEach((e) => flat.push({ conflict: c, event: e }));
    });
    return flat.sort((a, b) => b.event.date.localeCompare(a.event.date));
  }, [conflicts]);

  const filteredEvents =
    activeFilter === 'all'
      ? allEvents
      : allEvents.filter((e) => e.conflict.severity === activeFilter);

  const warCount = conflicts.filter((c) => c.severity === 'war').length;
  const escalatingCount = conflicts.filter((c) => c.severity === 'escalating').length;

  return (
    <div className="min-h-screen">
      <h1 className="sr-only">Live War &amp; Conflict Tracker 2026 — Real-Time Global Crisis Map</h1>
      {/* ── Billboard Ad (970×250) ── */}
      <div className="w-full flex justify-center items-center py-2 px-4 border-b border-white/5" style={{ background: 'var(--cr-bg-alt)' }}>
        <AdUnit
          slot="1234567890"
          format="horizontal"
          style={{ width: 970, height: 90, maxWidth: '100%' }}
          className="w-full max-w-[970px]"
        />
      </div>

      {/* ── Breaking News Marquee ── */}
      {!loading && <BreakingMarquee conflicts={conflicts} />}

      {/* ── Full-Width Map Section ── */}
      <div className="relative w-full" style={{ height: '65vh', minHeight: 460, background: 'var(--cr-bg)' }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3 animate-pulse">🌍</div>
              <p className="text-gray-500 text-sm">Loading conflict data…</p>
            </div>
          </div>
        ) : (
          <WorldMap
            conflicts={conflicts}
            onSelectConflict={setSelected}
            selectedId={selected?.id ?? null}
            isDark={theme === 'dark'}
          />
        )}

        {/* Stats overlay — top of map */}
        {!loading && (
          <div className="absolute top-0 left-0 right-0 z-[500] pointer-events-none">
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-gray-300 font-mono">
                  <span className="text-red-400 font-bold">{conflicts.length}</span> conflicts tracked
                </span>
                {warCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {warCount} Active War{warCount > 1 ? 's' : ''}
                  </span>
                )}
                {escalatingCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {escalatingCount} Escalating
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Severity legend — bottom left */}
        {!loading && (
          <div className="absolute bottom-4 left-4 z-[500] bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {[
                { color: 'bg-red-500', label: 'Active War' },
                { color: 'bg-orange-500', label: 'Escalating' },
                { color: 'bg-yellow-500', label: 'Instability' },
                { color: 'bg-green-500', label: 'Stable' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                  <span className="text-[10px] text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map attribution hint */}
        {!loading && (
          <div className="absolute bottom-4 right-4 z-[500] text-[9px] text-gray-600 pointer-events-none">
            Click a marker to explore
          </div>
        )}

        {/* Country detail panel — slides in over map from right */}
        {selected && (
          <div className="absolute top-0 right-0 h-full w-80 border-l border-white/10 shadow-2xl z-[600] flex flex-col overflow-hidden animate-fade-in" style={{ background: 'var(--cr-card)' }}>
            <CountryPanel conflict={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>

      {/* ── Events Section with Sidebar Ads ── */}
      <div className="border-t border-white/5" style={{ background: 'var(--cr-bg-alt)' }}>
        <div className="max-w-screen-2xl mx-auto flex gap-0">

          {/* Left Rail Ad */}
          <div className="hidden xl:flex flex-col items-center py-6 px-3 w-[180px] shrink-0 border-r border-white/5">
            <div className="sticky top-20">
              <AdUnit
                slot="1111111111"
                format="vertical"
                style={{ width: 160, height: 600 }}
              />
            </div>
          </div>

          {/* Main events feed */}
          <div className="flex-1 min-w-0 px-4 py-6">
            {/* Section header */}
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Latest Intelligence Feed
                </h2>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 flex-wrap">
                {(['all', 'war', 'escalating', 'instability', 'stable'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                      activeFilter === f
                        ? f === 'all'
                          ? 'bg-white/20 text-white'
                          : f === 'war'
                          ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                          : f === 'escalating'
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                          : f === 'instability'
                          ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                          : 'bg-green-500/30 text-green-300 border border-green-500/50'
                        : 'bg-white/5 text-gray-500 border border-white/10 hover:text-gray-300'
                    }`}
                  >
                    {f === 'all' ? 'All Events' : SEVERITY_LABELS[f]}
                  </button>
                ))}
              </div>

              <Link
                href="/wars"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                Full conflict list →
              </Link>
            </div>

            {/* Events grid */}
            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-white/5">
                {filteredEvents.slice(0, 30).map(({ conflict, event }, i) => (
                  <div key={`${conflict.id}-${i}`}>
                    {/* In-feed ad every 8 events */}
                    {i > 0 && i % 8 === 0 && (
                      <div className="flex justify-center py-3">
                        <AdUnit
                          slot="2222222222"
                          format="rectangle"
                          style={{ width: 300, height: 250 }}
                        />
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelected(conflict);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Severity indicator */}
                        <div className="shrink-0 mt-0.5">
                          <span
                            className="block w-2.5 h-2.5 rounded-full mt-1"
                            style={{ backgroundColor: SEVERITY_COLORS[conflict.severity] }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-xs font-semibold"
                              style={{ color: SEVERITY_COLORS[conflict.severity] }}
                            >
                              {conflict.name}
                            </span>
                            <SeverityBadge severity={conflict.severity} size="sm" />
                            <span className="ml-auto text-[10px] text-gray-600 font-mono shrink-0">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 leading-snug group-hover:text-white transition-colors line-clamp-2">
                            {event.description}
                          </p>
                          {event.tags.length > 0 && (
                            <div className="flex gap-1.5 mt-1.5 flex-wrap">
                              {event.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500"
                                >
                                  {TAG_ICONS[tag] ?? '•'} {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Active conflicts quick summary */}
            {!loading && (
              <div className="mt-8 mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Active Conflicts Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {conflicts.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelected(c);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-left p-3 rounded-lg bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {c.name}
                        </span>
                        <SeverityBadge severity={c.severity} size="sm" />
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {c.status}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-600">
                        <span>Updated {formatDate(c.lastUpdated)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Rail Ad */}
          <div className="hidden xl:flex flex-col items-center py-6 px-3 w-[180px] shrink-0 border-l border-white/5">
            <div className="sticky top-20">
              <AdUnit
                slot="3333333333"
                format="vertical"
                style={{ width: 160, height: 600 }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
