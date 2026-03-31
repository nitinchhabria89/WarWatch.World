'use client';

import { useLocale } from './LocaleProvider';

interface Props {
  titleKey: string;
  subtitleKey?: string;
  subtitleParams?: Record<string, string | number>;
}

export default function PageHeading({ titleKey, subtitleKey, subtitleParams }: Props) {
  const { t } = useLocale();
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-white mb-1">{t(titleKey)}</h1>
      {subtitleKey && (
        <p className="text-gray-400 text-sm">{t(subtitleKey, subtitleParams)}</p>
      )}
    </div>
  );
}
