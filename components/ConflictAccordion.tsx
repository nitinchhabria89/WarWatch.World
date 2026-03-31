'use client';

import { useState } from 'react';
import type { Conflict } from '@/lib/types';
import SeverityBadge from './SeverityBadge';
import { formatDate } from '@/lib/utils';
import clsx from 'clsx';

interface Props {
  conflicts: Conflict[];
  filterTag?: string;
  filterSeverity?: string;
}

const TAG_COLORS: Record<string, string> = {
  Airstrike: 'bg-red-500/20 text-red-400',
  Diplomatic: 'bg-blue-500/20 text-blue-400',
  Sanctions: 'bg-purple-500/20 text-purple-400',
  Military: 'bg-orange-500/20 text-orange-400',
  Casualties: 'bg-red-700/20 text-red-300',
  Humanitarian: 'bg-green-500/20 text-green-400',
  News: 'bg-gray-500/20 text-gray-400',
};

function EventTag({ tag }: { tag: string }) {
  const cls = TAG_COLORS[tag] ?? 'bg-white/10 text-gray-400';
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cls}`}>{tag}</span>
  );
}

function ConflictItem({ conflict }: { conflict: Conflict }) {
  const [open, setOpen] = useState(conflict.pinned ?? false);
  const isPinned = conflict.pinned ?? false;

  return (
    <div
      className={clsx(
        'rounded-lg overflow-hidden transition-all',
        isPinned
          ? 'border border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.12)] bg-red-500/[0.03]'
          : 'border border-white/10'
      )}
    >
      {/* Pinned banner */}
      {isPinned && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border-b border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
            Critical — Most Watched Conflict
          </span>
          <span className="ml-auto text-[10px] text-red-500/70">Pinned</span>
        </div>
      )}

      {/* Global impact strip */}
      {isPinned && conflict.globalImpact && (
        <div className="px-4 py-2 bg-orange-500/10 border-b border-orange-500/20 flex items-start gap-2">
          <span className="text-orange-400 text-xs shrink-0 mt-px">⚠</span>
          <p className="text-xs text-orange-300/80">{conflict.globalImpact}</p>
        </div>
      )}

      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'w-full text-left p-4 flex items-center justify-between gap-3 transition-colors',
          isPinned ? 'hover:bg-red-500/5' : 'hover:bg-white/5'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={clsx(
              'rounded-full shrink-0 animate-pulse-slow',
              isPinned ? 'w-3 h-3' : 'w-2 h-2',
              conflict.severity === 'war' && 'bg-red-500',
              conflict.severity === 'escalating' && 'bg-orange-500',
              conflict.severity === 'instability' && 'bg-yellow-500',
              conflict.severity === 'stable' && 'bg-green-500'
            )}
          />
          <div className="min-w-0">
            <p className={clsx('font-semibold text-white truncate', isPinned ? 'text-base' : 'text-sm')}>
              {conflict.name}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{conflict.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SeverityBadge severity={conflict.severity} size="sm" />
          <svg
            className={clsx('w-4 h-4 text-gray-500 transition-transform', open && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/10 p-4 bg-white/[0.02] animate-fade-in">
          {/* Summary */}
          <p className="text-gray-400 text-xs leading-relaxed mb-4">{conflict.summary}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {conflict.tags.map((tag) => (
              <EventTag key={tag} tag={tag} />
            ))}
          </div>

          {/* Market Impact */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: '🛢️ Oil Impact', value: conflict.marketImpact.oil },
              { label: '🥇 Gold Impact', value: conflict.marketImpact.gold },
            ].map((m) => (
              <div key={m.label} className="bg-white/5 rounded p-2 text-xs">
                <span className="text-gray-500">{m.label}</span>
                <span
                  className={clsx(
                    'ml-2 font-semibold capitalize',
                    m.value === 'high' && 'text-red-400',
                    m.value === 'medium' && 'text-orange-400',
                    m.value === 'low' && 'text-yellow-400',
                    m.value === 'none' && 'text-gray-500'
                  )}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Event Log */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Event Log</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {conflict.events.map((event, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="shrink-0 text-gray-600 w-24 pt-0.5">{formatDate(event.date)}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {event.tags.map((t) => (
                        <EventTag key={t} tag={t} />
                      ))}
                    </div>
                    <p className="text-gray-400 leading-relaxed">{event.description}</p>
                    {event.source && (
                      <p className="text-gray-600 mt-0.5">— {event.source}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-600 mt-3">
            Conflict began {formatDate(conflict.startDate)} · Last updated {formatDate(conflict.lastUpdated)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ConflictAccordion({ conflicts, filterTag, filterSeverity }: Props) {
  const filtered = conflicts.filter((c) => {
    if (filterSeverity && c.severity !== filterSeverity) return false;
    if (filterTag && !c.tags.includes(filterTag)) return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">No conflicts match the selected filters.</p>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((conflict) => (
        <ConflictItem key={conflict.id} conflict={conflict} />
      ))}
    </div>
  );
}
