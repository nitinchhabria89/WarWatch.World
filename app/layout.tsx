import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://warwatch.world';
// Treat the example placeholder as "not configured"
const RAW_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
const PUB_ID = RAW_PUB_ID && RAW_PUB_ID !== 'pub-XXXXXXXXXXXXXXXX' ? RAW_PUB_ID : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  title: {
    default: 'WarWatch.World — Real-Time Global Conflict Tracker',
    template: '%s | WarWatch.World',
  },
  description:
    'Track active wars, conflicts, and geopolitical crises worldwide with AI-powered analysis, interactive maps, and daily intelligence briefings. Free & open-source.',
  keywords: [
    'global conflicts',
    'war tracker',
    'geopolitical crisis',
    'world conflicts map',
    'conflict news',
    'intelligence reports',
    'AI geopolitics',
  ],
  authors: [{ name: 'WarWatch.World Contributors' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'WarWatch.World',
    title: 'WarWatch.World — Real-Time Global Conflict Tracker',
    description:
      'Track active wars, conflicts, and geopolitical crises worldwide with AI-powered analysis.',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WarWatch.World — Real-Time Global Conflict Tracker',
    description: 'Track active wars and geopolitical crises with AI-powered analysis.',
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en`,
      ar: `${SITE_URL}/ar`,
      fr: `${SITE_URL}/fr`,
      es: `${SITE_URL}/es`,
      de: `${SITE_URL}/de`,
      hi: `${SITE_URL}/hi`,
      pt: `${SITE_URL}/pt`,
      tr: `${SITE_URL}/tr`,
      uk: `${SITE_URL}/uk`,
      ru: `${SITE_URL}/ru`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: ThemeProvider updates class client-side from localStorage,
    // which causes a benign server/client mismatch we intentionally suppress.
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TZ2DPPBX');`,
          }}
        />
        {/* End Google Tag Manager */}
        {PUB_ID && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'WarWatch.World',
              url: SITE_URL,
              description: 'Real-time global war and conflict tracking platform',
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TZ2DPPBX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
