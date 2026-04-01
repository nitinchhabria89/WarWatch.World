'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTheme } from './ThemeProvider';
import { useLocale, SUPPORTED_LOCALES } from './LocaleProvider';

const LOCALE_META: Record<string, { label: string; flag: string }> = {
  en: { label: 'English',    flag: '🇬🇧' },
  ar: { label: 'العربية',    flag: '🇸🇦' },
  fr: { label: 'Français',   flag: '🇫🇷' },
  es: { label: 'Español',    flag: '🇪🇸' },
  de: { label: 'Deutsch',    flag: '🇩🇪' },
  hi: { label: 'हिन्दी',     flag: '🇮🇳' },
  pt: { label: 'Português',  flag: '🇵🇹' },
  tr: { label: 'Türkçe',     flag: '🇹🇷' },
  uk: { label: 'Українська', flag: '🇺🇦' },
  ru: { label: 'Русский',    flag: '🇷🇺' },
};

export default function Header() {
  const [utcTime, setUtcTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle: toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const langDropRef = useRef<HTMLDivElement>(null);

  const NAV_LINKS = [
    { href: '/',              label: t('nav.map') },
    { href: '/wars',          label: t('nav.wars') },
    { href: '/country-risk',  label: t('nav.countryRisk') },
    { href: '/ai-analyst',    label: t('nav.aiAnalyst') },
    { href: '/markets',       label: t('nav.markets') },
  ];

  // UTC clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}) GMT/, '$1') + ' UTC');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langDropRef.current && !langDropRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  // Close everything on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLangOpen(false); setMenuOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const currentMeta = LOCALE_META[locale] ?? LOCALE_META.en;

  function selectLocale(code: string) {
    setLocale(code as typeof SUPPORTED_LOCALES[number]);
    setLangOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/10" style={{ background: 'var(--cr-header-bg)' }}>
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-red-500 text-xl">🌍</span>
            <span className="font-bold text-white text-base tracking-tight">
              WarWatch
              <span className="text-red-500">.world</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 ml-1 px-1.5 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-[10px] text-red-400 font-bold animate-pulse">
              LIVE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-3 py-1.5 rounded text-sm transition-colors',
                  pathname === link.href
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-xs text-gray-600 font-mono shrink-0">{utcTime}</span>

            {/* Language toggle — hidden until translation is fixed */}

            {/* Dark / Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* GitHub — desktop only */}
            <a
              href={process.env.NEXT_PUBLIC_GITHUB_URL ?? 'https://github.com/nitinchhabria89/WarWatch.World'}
              target="_blank" rel="noopener noreferrer"
              className="hidden md:block text-gray-500 hover:text-white transition-colors text-xs px-2 py-1 border border-white/10 rounded hover:bg-white/5"
            >
              {t('nav.github')}
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-gray-400 hover:text-white p-1"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav menu */}
        {menuOpen && (
          <nav className="md:hidden px-4 pb-3 flex flex-col gap-1 border-t border-white/10" style={{ background: 'var(--cr-header-bg)' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'px-3 py-2 rounded text-sm transition-colors',
                  pathname === link.href ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <span className="text-xs text-gray-600 font-mono px-3 pt-1">{utcTime}</span>
          </nav>
        )}
      </header>

      {/* Language Dropdown — hidden until translation is fixed */}
      {false && langOpen && (
        <div
          ref={langDropRef}
          className="fixed top-14 right-4 z-[9999] shadow-2xl rounded-xl overflow-hidden border border-white/10 w-52"
          style={{ background: 'var(--cr-card)' }}
        >
          <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Language</span>
            <button
              onClick={() => setLangOpen(false)}
              className="text-gray-500 hover:text-white transition-colors p-0.5"
              aria-label="Close language selector"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 120px)' }}>
            {SUPPORTED_LOCALES.map((code) => {
              const meta = LOCALE_META[code];
              return (
                <button
                  key={code}
                  onClick={() => selectLocale(code)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                    locale === code
                      ? 'bg-blue-500/15 text-blue-400 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span className="text-xl leading-none w-7 shrink-0">{meta.flag}</span>
                  <span className="flex-1">{meta.label}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-600">{code}</span>
                  {locale === code && (
                    <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
