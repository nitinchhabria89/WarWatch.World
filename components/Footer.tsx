'use client';

import Link from 'next/link';
import AdUnit from './AdUnit';
import { useLocale } from './LocaleProvider';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLocale();

  const NAV_LINKS = [
    { href: '/',           label: t('nav.map') },
    { href: '/wars',       label: t('nav.wars') },
    { href: '/ai-analyst', label: t('nav.aiAnalyst') },
    { href: '/reports',    label: t('nav.reports') },
    { href: '/markets',    label: t('nav.markets') },
  ];

  return (
    <footer className="bg-[#111827] border-t border-white/10 mt-12">
      {/* Footer leaderboard ad */}
      <div className="flex justify-center pt-6">
        <AdUnit
          slot="footer-leaderboard"
          style={{ width: 728, height: 90 }}
          className="hidden md:block"
        />
        <AdUnit
          slot="footer-leaderboard-mobile"
          style={{ width: 300, height: 250 }}
          className="md:hidden"
        />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <p className="font-semibold text-white mb-3">WarWatch.world</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-300 text-sm mb-3">Navigate</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-300 text-sm mb-3">Open Source</p>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/nitinchhabria89/WarWatch.World" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/nitinchhabria89/WarWatch.World/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Contributing
                </a>
              </li>
              <li>
                <a href="https://github.com/nitinchhabria89/WarWatch.World/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  MIT License
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-300 text-sm mb-3">Policies</p>
            <ul className="space-y-2">
              {[
                { href: '/editorial-policy',    label: 'Editorial Policy' },
                { href: '/privacy-policy',       label: 'Privacy Policy' },
                { href: '/terms',                label: 'Terms & Conditions' },
                { href: '/monetization-policy',  label: 'Monetization Policy' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-300 text-sm mb-3">Data Sources</p>
            <ul className="space-y-2">
              {[
                { href: 'https://newsapi.org',          label: 'NewsAPI.org' },
                { href: 'https://groq.com',             label: 'Groq LLaMA' },
                { href: 'https://leafletjs.com',        label: 'Leaflet.js' },
                { href: 'https://cartodb.com',          label: 'CartoDB Tiles' },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms &amp; Conditions</Link>
            <Link href="/editorial-policy" className="hover:text-gray-400 transition-colors">Editorial Policy</Link>
            <Link href="/monetization-policy" className="hover:text-gray-400 transition-colors">Monetization Policy</Link>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 text-xs text-gray-700">
            <p>{t('footer.copyright', { year })}</p>
            <p>{t('footer.disclaimer')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
