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

export default function AdUnit({ slot, format = 'auto', style, className }: Props) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!isValidPubId(pubId) || pushed.current || !ref.current) return;
    // Don't push if the element is hidden (display:none gives offsetWidth=0)
    if (ref.current.offsetWidth === 0) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not yet loaded
    }
  }, [pubId]);

  if (!isValidPubId(pubId)) {
    const w = style?.width ?? 300;
    const h = style?.height ?? 90;
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
