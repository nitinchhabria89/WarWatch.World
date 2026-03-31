'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

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

// ── Translation cache key ──
function cacheKey(locale: string, text: string) {
  return `ww_tr:${locale}:${text.slice(0, 80)}`;
}

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (code: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
  /** Translate arbitrary text via Google Translate (free). Cached in localStorage. */
  translateTexts: (texts: string[]) => Promise<string[]>;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  dir: 'ltr',
  translateTexts: async (texts) => texts,
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

  // In-flight dedup: prevent duplicate parallel requests for same text
  const inflight = useRef<Map<string, Promise<string>>>(new Map());

  const translateTexts = useCallback(async (texts: string[]): Promise<string[]> => {
    if (locale === 'en') return texts;

    const results: string[] = new Array(texts.length);
    const toFetch: { idx: number; text: string }[] = [];

    // Check localStorage cache first
    texts.forEach((text, idx) => {
      if (!text) { results[idx] = text; return; }
      const cached = localStorage.getItem(cacheKey(locale, text));
      if (cached) { results[idx] = cached; }
      else { toFetch.push({ idx, text }); }
    });

    if (!toFetch.length) return results;

    // Deduplicate & fetch
    const uniqueTexts = [...new Set(toFetch.map((x) => x.text))];

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: uniqueTexts, target: locale }),
      });
      if (!res.ok) throw new Error('translate failed');
      const { translations } = await res.json() as { translations: string[] };

      // Cache and map back
      const map = new Map<string, string>();
      uniqueTexts.forEach((orig, i) => {
        const translated = translations[i] ?? orig;
        map.set(orig, translated);
        try { localStorage.setItem(cacheKey(locale, orig), translated); } catch {}
      });

      toFetch.forEach(({ idx, text }) => {
        results[idx] = map.get(text) ?? text;
      });
    } catch {
      // On error fall back to original text
      toFetch.forEach(({ idx, text }) => { results[idx] = text; });
    }

    return results;
  }, [locale]);

  const dir: 'ltr' | 'rtl' = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir, translateTexts }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
