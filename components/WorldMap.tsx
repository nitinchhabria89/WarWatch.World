'use client';

import { useEffect, useState, useRef } from 'react';
import type { Conflict } from '@/lib/types';
import { SEVERITY_COLORS } from '@/lib/types';

// Country code → approximate lat/lng center for marker positioning
const COUNTRY_CENTERS: Record<string, [number, number]> = {
  RU: [61.5, 105.3],
  UA: [48.4, 31.2],
  IL: [31.0, 35.0],
  PS: [31.9, 35.3],
  SD: [12.9, 30.2],
  MM: [21.9, 95.9],
  IR: [32.4, 53.7],
  US: [37.1, -95.7],
  IN: [20.6, 78.9],
  PK: [30.4, 69.3],
  HT: [18.9, -72.3],
  CN: [35.9, 104.2],
  PH: [12.9, 121.8],
  VN: [14.1, 108.3],
  TW: [23.7, 121.0],
  XK: [42.6, 20.9],
  RS: [44.0, 21.0],
  YE: [15.5, 48.5],
  SA: [23.9, 45.1],
};

interface Props {
  conflicts: Conflict[];
  onSelectConflict: (conflict: Conflict | null) => void;
  selectedId: string | null;
  isDark?: boolean;
}

export default function WorldMap({ conflicts, onSelectConflict, selectedId, isDark = true }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const linesRef = useRef<any[]>([]);
  const pulseMarkersRef = useRef<any[]>([]);
  const tileLayerRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    let L: any;
    let map: any;

    const init = async () => {
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (mapRef.current && !leafletRef.current) {
        map = L.map(mapRef.current, {
          center: [20, 10],
          zoom: 2,
          minZoom: 2,
          maxZoom: 8,
          zoomControl: true,
          attributionControl: true,
        });

        const tileUrl = isDark
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map);

        leafletRef.current = { L, map };
      }

      renderConflicts(leafletRef.current.L, leafletRef.current.map, selectedId);
    };

    init();

    return () => {
      if (leafletRef.current) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  function renderConflicts(L: any, map: any, selId: string | null) {
    // Clear old layers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    linesRef.current.forEach((l) => l.remove());
    linesRef.current = [];
    pulseMarkersRef.current.forEach((p) => p.remove());
    pulseMarkersRef.current = [];

    conflicts.forEach((conflict) => {
      const color = SEVERITY_COLORS[conflict.severity];
      const isSelected = selId === conflict.id;
      const isWar = conflict.severity === 'war';
      const isEscalating = conflict.severity === 'escalating';

      const centers = conflict.countryCodes
        .map((code) => COUNTRY_CENTERS[code])
        .filter(Boolean) as [number, number][];

      if (centers.length === 0) return;

      // ── War/escalating front lines between involved countries ──
      if (centers.length >= 2 && (isWar || isEscalating)) {
        for (let i = 0; i < centers.length - 1; i++) {
          // Main colored line
          const line = L.polyline([centers[i], centers[i + 1]], {
            color,
            weight: isSelected ? 3 : 2,
            opacity: isSelected ? 0.9 : 0.55,
            dashArray: isWar ? '6 5' : '4 6',
            dashOffset: '0',
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(map);

          line.on('click', () => onSelectConflict(conflict));
          linesRef.current.push(line);

          // Outer glow line (wider, very transparent)
          const glowLine = L.polyline([centers[i], centers[i + 1]], {
            color,
            weight: isSelected ? 8 : 6,
            opacity: isSelected ? 0.12 : 0.07,
            dashArray: null,
            lineCap: 'round',
          }).addTo(map);
          glowLine.on('click', () => onSelectConflict(conflict));
          linesRef.current.push(glowLine);
        }
      }

      // ── Markers at each country center ──
      centers.forEach((center) => {
        const size = isSelected ? 18 : isWar ? 14 : 12;
        const glowSize = isSelected ? 36 : isWar ? 28 : 22;

        // Outer pulsing ring (war/escalating only)
        if (isWar || isEscalating) {
          const pulseIcon = L.divIcon({
            className: '',
            html: `<div style="
              width: ${glowSize}px;
              height: ${glowSize}px;
              border-radius: 50%;
              background: ${color};
              opacity: ${isWar ? 0.18 : 0.1};
              animation: crPulse 2s ease-out infinite;
              position: absolute;
              top: 50%; left: 50%;
              transform: translate(-50%, -50%);
            "></div>`,
            iconSize: [glowSize, glowSize],
            iconAnchor: [glowSize / 2, glowSize / 2],
          });
          const pulseMarker = L.marker(center, { icon: pulseIcon, interactive: false }).addTo(map);
          pulseMarkersRef.current.push(pulseMarker);
        }

        // Core dot marker
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            border: ${isSelected ? '2.5px' : '1.5px'} solid rgba(255,255,255,${isSelected ? 0.9 : 0.5});
            box-shadow: 0 0 ${isSelected ? 14 : 8}px ${color}, 0 0 ${isSelected ? 28 : 14}px ${color}55;
            transition: all 0.2s;
            cursor: pointer;
          "></div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker(center, { icon })
          .addTo(map)
          .on('click', () => onSelectConflict(conflict));

        marker.bindTooltip(
          `<strong>${conflict.name}</strong><br/><span style="font-size:11px;opacity:0.8">${conflict.status}</span>`,
          { className: 'leaflet-tooltip-dark', direction: 'top', offset: [0, -8] }
        );

        markersRef.current.push(marker);
      });
    });
  }

  // Re-render conflicts when selectedId changes (no map re-create)
  useEffect(() => {
    if (!leafletRef.current) return;
    renderConflicts(leafletRef.current.L, leafletRef.current.map, selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, conflicts]);

  // Swap tile layer when theme changes
  useEffect(() => {
    if (!leafletRef.current || !tileLayerRef.current) return;
    const { L, map } = leafletRef.current;
    tileLayerRef.current.remove();
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);
  }, [isDark]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading map…</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes crPulse {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.3; }
          70%  { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }
        .leaflet-tooltip-dark {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.15);
          color: #f3f4f6;
          font-size: 12px;
          border-radius: 6px;
          padding: 6px 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          pointer-events: none;
        }
        .leaflet-tooltip-dark::before {
          border-top-color: rgba(255,255,255,0.15);
        }
        .leaflet-control-attribution {
          background: rgba(10,15,30,0.8) !important;
          color: #6b7280 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #9ca3af !important; }
        .leaflet-control-zoom a {
          background: #111827 !important;
          color: #d1d5db !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a2035 !important;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}
