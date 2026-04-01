import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://warwatch.world';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  title: {
    default: 'WarWatch.World — Live War & Conflict Tracker 2025',
    template: '%s | WarWatch.World',
  },
  description:
    'Track every active war and global conflict in real time. Interactive world map, AI-powered analysis, live news updates, daily intelligence briefings and market impact. Free & open-source.',
  keywords: [
    'war tracker',
    'live war map',
    'active wars 2025',
    'global conflict tracker',
    'world war map',
    'geopolitical crisis',
    'conflict news today',
    'warwatch',
    'war monitor',
    'world conflicts 2025',
    'live conflict updates',
    'military news',
    'geopolitics',
    'war news',
    'conflict map',
    'Russia Ukraine war',
    'Middle East conflict',
    'Gaza war',
    'AI geopolitics analyst',
    'intelligence briefing',
  ],
  authors: [{ name: 'WarWatch.World', url: SITE_URL }],
  creator: 'WarWatch.World',
  publisher: 'WarWatch.World',
  category: 'news',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'WarWatch.World',
    title: 'WarWatch.World — Live War & Conflict Tracker 2025',
    description:
      'Track every active war and global conflict in real time. Interactive world map, AI analysis, daily intelligence briefings and market impact.',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'WarWatch.World — Live War & Conflict Tracker' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@warwatchworld',
    title: 'WarWatch.World — Live War & Conflict Tracker 2025',
    description:
      'Track every active war and global conflict in real time. Interactive world map, AI analysis, live news updates.',
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en': `${SITE_URL}`,
      'ar': `${SITE_URL}`,
      'fr': `${SITE_URL}`,
      'es': `${SITE_URL}`,
      'de': `${SITE_URL}`,
      'hi': `${SITE_URL}`,
      'pt': `${SITE_URL}`,
      'tr': `${SITE_URL}`,
      'uk': `${SITE_URL}`,
      'ru': `${SITE_URL}`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'ap8f63s9HE_pwCs_C1YRCxxYaMMv8BWmRf3o0Frq20g',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager — beforeInteractive ensures it's first in <head> */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TZ2DPPBX');`,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8381089290758563"
          crossOrigin="anonymous"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'WarWatch.World',
              url: SITE_URL,
              description: 'Real-time global war and conflict tracking platform with AI-powered analysis',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/wars?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Google Tag Manager (noscript) — immediately after <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TZ2DPPBX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ThemeProvider>
          <LocaleProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
