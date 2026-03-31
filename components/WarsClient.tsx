'use client';

import type { Conflict } from '@/lib/types';
import ConflictAccordion from './ConflictAccordion';
import AdUnit from './AdUnit';
import PageHeading from './PageHeading';
import { useLocale } from './LocaleProvider';

const ALL_TAGS = ['Airstrike', 'Diplomatic', 'Sanctions', 'Military', 'Casualties', 'Humanitarian'];
const ALL_SEVERITIES = ['war', 'escalating', 'instability', 'stable'] as const;

interface Props {
  conflicts: Conflict[];
  tag?: string;
  severity?: string;
}

export default function WarsClient({ conflicts, tag, severity }: Props) {
  const { t } = useLocale();

  return (
    <>
      <PageHeading
        titleKey="wars.title"
        subtitleKey="wars.subtitle"
        subtitleParams={{ count: conflicts.length }}
      />

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
          {t('wars.filters.all')}
        </a>

        <span className="text-gray-700 self-center text-xs">{t('wars.filters.severity')}</span>
        {ALL_SEVERITIES.map((s) => (
          <a
            key={s}
            href={`/wars?severity=${s}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              severity === s
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t(`severity.${s}`)}
          </a>
        ))}

        <span className="text-gray-700 self-center text-xs">{t('wars.filters.tag')}</span>
        {ALL_TAGS.map((tg) => (
          <a
            key={tg}
            href={`/wars?tag=${tg}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              tag === tg
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            [{tg}]
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
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {t('wars.quickStats')}
            </p>
            {ALL_SEVERITIES.map((s) => {
              const count = conflicts.filter((c) => c.severity === s).length;
              return (
                <div key={s} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-gray-400">{t(`severity.${s}`)}</span>
                  <span className="text-xs font-semibold text-white">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
