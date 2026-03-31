'use client';

import { useState, useEffect } from 'react';
import type { Conflict } from '@/lib/types';
import SeverityBadge from './SeverityBadge';
import { formatDate } from '@/lib/utils';
import { useLocale } from './LocaleProvider';

interface Props {
  conflict: Conflict | null;
  onClose: () => void;
}

interface Translated {
  status: string;
  summary: string;
  globalImpact: string;
  events: string[];
}

export default function CountryPanel({ conflict, onClose }: Props) {
  const { t, locale, translateTexts } = useLocale();
  const [translated, setTranslated] = useState<Translated | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!conflict || locale === 'en') {
      setTranslated(null);
      return;
    }

    let cancelled = false;
    setTranslating(true);

    const textsToTranslate = [
      conflict.status,
      conflict.summary,
      conflict.globalImpact ?? '',
      ...conflict.events.slice(0, 3).map((e) => e.description),
    ];

    translateTexts(textsToTranslate).then((results) => {
      if (cancelled) return;
      setTranslated({
        status: results[0],
        summary: results[1],
        globalImpact: results[2],
        events: results.slice(3),
      });
      setTranslating(false);
    });

    return () => { cancelled = true; };
  }, [conflict?.id, locale, translateTexts]);

  if (!conflict) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-4xl mb-3">🌍</div>
        <p className="text-gray-400 text-sm">{t('home.clickToView')}</p>
        <div className="mt-6 w-full">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">{t('home.severityLegend')}</p>
          <div className="space-y-1.5">
            {(['war', 'escalating', 'instability', 'stable'] as const).map((sev) => {
              const colorMap = { war: 'bg-red-500', escalating: 'bg-orange-500', instability: 'bg-yellow-500', stable: 'bg-green-500' };
              return (
                <div key={sev} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${colorMap[sev]}`} />
                  <span className="text-xs text-gray-400">{t(`severity.${sev}`)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const status      = translated?.status      ?? conflict.status;
  const summary     = translated?.summary     ?? conflict.summary;
  const globalImpact = translated?.globalImpact || conflict.globalImpact;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {conflict.pinned && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border-b border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t('panel.critical')}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2 p-4 border-b border-white/10 sticky top-0 z-10" style={{ background: 'var(--cr-card)' }}>
        <div>
          <h2 className="font-semibold text-white text-sm leading-tight">{conflict.name}</h2>
          <div className="mt-1.5">
            <SeverityBadge severity={conflict.severity} size="sm" />
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors shrink-0 p-1" aria-label={t('panel.close')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Translating indicator */}
      {translating && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border-b border-blue-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[10px] text-blue-400">Translating…</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-4">
        {globalImpact && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
            <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-wide mb-1">{t('panel.globalImpact')}</p>
            <p className="text-xs text-orange-300/80">{globalImpact}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('panel.status')}</p>
          <p className="text-gray-300 text-sm">{status}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('panel.summary')}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{summary}</p>
        </div>

        {conflict.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {conflict.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-gray-400">{tag}</span>
            ))}
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t('panel.marketImpact')}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Oil', value: conflict.marketImpact.oil, icon: '🛢️' },
              { label: 'Gold', value: conflict.marketImpact.gold, icon: '🥇' },
            ].map((m) => (
              <div key={m.label} className="bg-white/5 rounded p-2 text-center">
                <div className="text-base">{m.icon}</div>
                <div className="text-xs text-gray-400">{m.label}</div>
                <div className={`text-xs font-semibold capitalize ${
                  m.value === 'high' ? 'text-red-400' : m.value === 'medium' ? 'text-orange-400' : m.value === 'low' ? 'text-yellow-400' : 'text-gray-500'
                }`}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t('panel.recentEvents')}</p>
          <div className="space-y-2">
            {conflict.events.slice(0, 3).map((event, i) => (
              <div key={i} className="bg-white/5 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                  <div className="flex gap-1">
                    {event.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {translated?.events[i] ?? event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-600 text-center">
          {t('panel.lastUpdated')} {formatDate(conflict.lastUpdated)}
        </div>
      </div>
    </div>
  );
}
