'use client';

import { useMemo } from 'react';
import type { Conflict } from '@/lib/types';
import { SEVERITY_COLORS } from '@/lib/types';
import { useLocale } from './LocaleProvider';

interface Props {
  conflicts: Conflict[];
}

export default function BreakingMarquee({ conflicts }: Props) {
  const { t } = useLocale();
  const items = useMemo(() => {
    const flat: Array<{ name: string; severity: string; description: string; color: string }> = [];
    conflicts.forEach((c) => {
      c.events.forEach((e) => {
        flat.push({
          name: c.name,
          severity: c.severity,
          description: e.description,
          color: SEVERITY_COLORS[c.severity],
        });
      });
    });
    return flat.slice(0, 25);
  }, [conflicts]);

  if (!items.length) return null;

  const ticker = [...items, ...items];

  return (
    // cr-marquee-wrap: themed via globals.css html.light overrides
    <div className="cr-marquee-wrap flex items-stretch overflow-hidden border-b border-white/5 bg-[#09101F]" style={{ height: 34 }}>

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
        {/* Fade masks — use CSS classes so light mode can override */}
        <div className="cr-marquee-fade-l absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#09101F] to-transparent z-10 pointer-events-none" />
        <div className="cr-marquee-fade-r absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#09101F] to-transparent z-10 pointer-events-none" />

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
