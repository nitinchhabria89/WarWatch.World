'use client';

import { useMemo, useState } from 'react';
import type { Conflict } from '@/lib/types';
import { SEVERITY_COLORS } from '@/lib/types';
import { useLocale } from './LocaleProvider';

interface Props {
  conflicts: Conflict[];
}

const FEATURED_CONFLICT = 'iran'; // match by id substring

export default function BreakingMarquee({ conflicts }: Props) {
  const { t } = useLocale();
  const [hovered, setHovered] = useState(false);

  const items = useMemo(() => {
    // Show only the Iran-Israel-US War conflict events in the breaking ticker
    const featured = conflicts.find((c) => c.id.toLowerCase().includes(FEATURED_CONFLICT));
    const source = featured ? [featured] : conflicts.slice(0, 1);
    const flat: Array<{ name: string; description: string; color: string }> = [];
    source.forEach((c) => {
      c.events.forEach((e) => {
        flat.push({
          name: c.name,
          description: e.description,
          color: SEVERITY_COLORS[c.severity],
        });
      });
    });
    return flat.slice(0, 20);
  }, [conflicts]);

  if (!items.length) return null;

  const ticker = [...items, ...items];

  return (
    <div
      className="cr-marquee-wrap flex items-stretch overflow-hidden border-b border-white/5 bg-[#09101F]"
      style={{ height: 34 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Static "BREAKING" label */}
      <div className="shrink-0 flex items-center gap-2 px-4 bg-red-600 z-10 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-white text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
          {t('breaking.label')}
        </span>
      </div>

      {/* Separator */}
      <div className="w-px bg-red-800 shrink-0" />

      {/* Scrolling ticker */}
      <div className="relative flex-1 overflow-hidden flex items-center">
        {/* Fade masks */}
        <div className="cr-marquee-fade-l absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#09101F] to-transparent z-10 pointer-events-none" />
        <div className="cr-marquee-fade-r absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#09101F] to-transparent z-10 pointer-events-none" />

        {/* Pause indicator — shown on hover */}
        {hovered && (
          <div className="absolute right-10 z-20 flex items-center gap-1 px-2 py-0.5 bg-black/60 rounded text-[10px] text-gray-400 border border-white/10 select-none pointer-events-none">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            PAUSED
          </div>
        )}

        <div className="marquee-track flex items-center">
          {ticker.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-5 whitespace-nowrap">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 opacity-90"
                style={{ backgroundColor: item.color }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: item.color }}
              >
                {item.name}
              </span>
              <span className="text-gray-600">—</span>
              <span className="cr-marquee-text text-[11px] text-gray-400">
                {item.description}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
