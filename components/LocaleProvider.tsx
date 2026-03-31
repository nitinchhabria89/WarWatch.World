'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ── Import all translation files statically so Next.js bundles them ──
import en from '@/messages/en.json';
import ar from '@/messages/ar.json';
import fr from '@/messages/fr.json';
import es from '@/messages/es.json';
import de from '@/messages/de.json';
import hi from '@/messages/hi.json';
import pt from '@/messages/pt.json';
import tr from '@/messages/tr.json';
import uk from '@/messages/uk.json';
import ru from '@/messages/ru.json';

const MESSAGES: Record<string, Record<string, unknown>> = { en, ar, fr, es, de, hi, pt, tr, uk, ru };

export const SUPPORTED_LOCALES = ['en', 'ar', 'fr', 'es', 'de', 'hi', 'pt', 'tr', 'uk', 'ru'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// ── Dot-notation lookup with {param} interpolation ──
function lookup(messages: Record<string, unknown>, key: string, params?: Record<string, string | number>): string {
  const parts = key.split('.');
  let value: unknown = messages;
  for (const part of parts) {
    if (value === null || typeof value !== 'object') return key;
    value = (value as Record<string, unknown>)[part];
  }
  if (typeof value !== 'string') return key;
  if (!params) return value;
  return Object.entries(params).reduce(
    (str, [k, v]) => str.replace(`{${k}}`, String(v)),
    value
  );
}

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (code: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  dir: 'ltr',
});

const RTL_LOCALES: SupportedLocale[] = ['ar'];

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');

  // Read from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('locale') as SupportedLocale | null;
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  // Apply dir attribute to <html> for RTL languages
  useEffect(() => {
    document.documentElement.setAttribute('dir', RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const setLocale = useCallback((code: SupportedLocale) => {
    setLocaleState(code);
    localStorage.setItem('locale', code);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      lookup(MESSAGES[locale] ?? MESSAGES.en, key, params),
    [locale]
  );

  const dir: 'ltr' | 'rtl' = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
