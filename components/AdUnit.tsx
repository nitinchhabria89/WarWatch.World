'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function isValidPubId(id: string | undefined): id is string {
  return !!id && id !== 'pub-XXXXXXXXXXXXXXXX';
}

// ─── Dummy ad brand definitions ──────────────────────────────────────────────

const BRANDS = [
  {
    name: 'Facebook',
    bg: '#1877F2',
    accent: '#ffffff',
    logo: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
    headlines: [
      'Reach 3 Billion People',
      'Grow Your Business',
      'Run Smarter Ads',
    ],
    ctas: ['Advertise Now', 'Get Started', 'Learn More'],
    sublines: {
      wide: 'Facebook & Instagram ads that reach the right audience at the right time.',
      square: 'Advanced targeting. Real results. Start with any budget.',
      banner: 'Facebook Ads · Target by location, interests & more',
    },
  },
  {
    name: 'LinkedIn',
    bg: '#0A66C2',
    accent: '#ffffff',
    logo: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    headlines: [
      'Reach 1B Professionals',
      'B2B Ads That Convert',
      'Target by Job Title',
    ],
    ctas: ['Start Campaign', 'Advertise Free', 'Try LinkedIn Ads'],
    sublines: {
      wide: 'LinkedIn Ads · Reach decision-makers in any industry worldwide.',
      square: 'Target by job title, company size, seniority & more.',
      banner: 'LinkedIn Ads · Precision B2B targeting for every budget',
    },
  },
  {
    name: 'Google',
    bg: '#ffffff',
    accent: '#1a1a1a',
    logo: (
      <svg viewBox="0 0 48 48" className="w-full h-full">
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
      </svg>
    ),
    headlines: [
      'Advertise on Google',
      'Show Up in Search',
      'Google Ads — Get Found',
    ],
    ctas: ['Start for Free', 'Create an Ad', 'Get $600 Credit'],
    sublines: {
      wide: 'Google Ads · Appear at the top of search results when people look for you.',
      square: 'Only pay when someone clicks. Start with any budget.',
      banner: 'Google Ads · Reach people actively searching for your business',
    },
  },
  {
    name: 'WhatsApp',
    bg: '#25D366',
    accent: '#ffffff',
    logo: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    headlines: [
      'WhatsApp Business Ads',
      'Chat with Customers',
      'Sell via WhatsApp',
    ],
    ctas: ['Try for Free', 'Send a Message', 'Get Started'],
    sublines: {
      wide: 'WhatsApp Business · Drive conversations and sales directly in chat.',
      square: 'Connect with 2B+ active users. Start direct conversations instantly.',
      banner: 'WhatsApp Business · Turn clicks into customer conversations',
    },
  },
];

function pickBrand(slot: string) {
  let hash = 0;
  for (let i = 0; i < slot.length; i++) hash = (hash * 31 + slot.charCodeAt(i)) & 0xffffffff;
  return BRANDS[Math.abs(hash) % BRANDS.length];
}

function DummyAd({ slot, width, height }: { slot: string; width: number | string; height: number | string }) {
  const w = typeof width === 'string' ? parseInt(width) : width;
  const h = typeof height === 'string' ? parseInt(height) : height;
  const brand = pickBrand(slot);
  const brandIdx = BRANDS.indexOf(brand);
  const headline = brand.headlines[Math.abs(slot.length) % brand.headlines.length];
  const cta = brand.ctas[Math.abs(slot.length) % brand.ctas.length];
  const isGoogle = brand.name === 'Google';
  const textColor = isGoogle ? '#1a1a1a' : 'white';
  const mutedColor = isGoogle ? '#5f6368' : 'rgba(255,255,255,0.8)';
  const ctaBg = isGoogle ? '#1a73e8' : 'rgba(255,255,255,0.2)';
  const ctaText = isGoogle ? 'white' : 'white';
  const ctaBorder = isGoogle ? 'none' : '1.5px solid rgba(255,255,255,0.5)';

  // ── Wide banner: 728×90, 970×250, 320×50 ────────────────────────
  if (h <= 100) {
    return (
      <div
        style={{ width: w, height: h, background: brand.bg, position: 'relative', overflow: 'hidden', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, boxSizing: 'border-box' }}
      >
        <div style={{ width: h * 0.55, height: h * 0.55, flexShrink: 0 }}>{brand.logo}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: Math.min(h * 0.28, 15), color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'system-ui, sans-serif' }}>{headline}</div>
          {h > 55 && <div style={{ fontSize: Math.min(h * 0.18, 11), color: mutedColor, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'system-ui, sans-serif' }}>{brand.sublines.banner}</div>}
        </div>
        <div style={{ flexShrink: 0, background: ctaBg, border: ctaBorder, color: ctaText, fontWeight: 600, fontSize: Math.min(h * 0.22, 12), padding: `${h * 0.12}px ${h * 0.22}px`, borderRadius: 4, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>{cta}</div>
        <AdLabel />
      </div>
    );
  }

  // ── Square / Medium rectangle: 300×250 ──────────────────────────
  if (w <= 320 && h <= 300) {
    return (
      <div style={{ width: w, height: h, background: brand.bg, borderRadius: 8, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: 52, height: 52 }}>{brand.logo}</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: textColor, textAlign: 'center', lineHeight: 1.2 }}>{headline}</div>
        <div style={{ fontSize: 12, color: mutedColor, textAlign: 'center', lineHeight: 1.5 }}>{brand.sublines.square}</div>
        <div style={{ background: ctaBg, border: ctaBorder, color: ctaText, fontWeight: 700, fontSize: 13, padding: '9px 22px', borderRadius: 6, cursor: 'pointer', marginTop: 4 }}>{cta}</div>
        <AdLabel />
      </div>
    );
  }

  // ── Tall sidebar: 300×600, 160×600 ──────────────────────────────
  const colors4 = ['#1877F2','#0A66C2','#4285F4','#25D366'];
  return (
    <div style={{ width: w, height: h, background: brand.bg, borderRadius: 8, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: '28px 16px', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }}>
      {/* decorative circles */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      <div style={{ width: 64, height: 64 }}>{brand.logo}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: w < 200 ? 15 : 22, color: textColor, textAlign: 'center', lineHeight: 1.2, marginBottom: 10 }}>{headline}</div>
        <div style={{ fontSize: w < 200 ? 11 : 13, color: mutedColor, textAlign: 'center', lineHeight: 1.6 }}>{brand.sublines.square}</div>
      </div>

      {/* Mini feature pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        {['Precise targeting', 'Real-time analytics', 'Any budget'].map((f, i) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 10px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isGoogle ? colors4[brandIdx] : 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
            <span style={{ fontSize: w < 200 ? 10 : 12, color: isGoogle ? '#444' : 'rgba(255,255,255,0.9)' }}>{f}</span>
          </div>
        ))}
      </div>

      <div style={{ background: isGoogle ? '#1a73e8' : 'rgba(255,255,255,0.95)', color: isGoogle ? 'white' : brand.bg, fontWeight: 700, fontSize: w < 200 ? 12 : 14, padding: '11px 24px', borderRadius: 8, cursor: 'pointer', width: '100%', textAlign: 'center' }}>{cta}</div>
      <AdLabel />
    </div>
  );
}

function AdLabel() {
  return (
    <span style={{ position: 'absolute', top: 4, right: 6, fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui, sans-serif', letterSpacing: 1, textTransform: 'uppercase', pointerEvents: 'none' }}>
      Ad
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdUnit({ slot, format = 'auto', style, className }: Props) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  // TODO: set dummyMode = false once Google AdSense is approved
  const dummyMode = true;
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (dummyMode || !isValidPubId(pubId) || pushed.current || !ref.current) return;
    if (ref.current.offsetWidth === 0) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not yet loaded
    }
  }, [pubId, dummyMode]);

  const w = style?.width ?? 300;
  const h = style?.height ?? 90;

  if (dummyMode) {
    return (
      <div className={className}>
        <DummyAd slot={slot} width={w} height={h} />
      </div>
    );
  }

  if (!isValidPubId(pubId)) {
    return (
      <div className={className}>
        <div
          style={{ width: w, height: h }}
          className="ad-placeholder flex items-center justify-center border border-dashed border-white/20 rounded bg-white/[0.03] text-center"
        >
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Ad</p>
            <p className="text-[10px] text-gray-700">{w}×{h}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
