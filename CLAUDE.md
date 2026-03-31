# WarWatch.World — CLAUDE.md

## Project Summary

WarWatch.World is an open-source, real-time global war and conflict tracking platform. It aggregates news via NewsAPI, generates AI analysis with Groq (LLaMA), and presents data via an interactive world map, conflict feeds, AI chat, daily intelligence briefings, and market impact views.

**Live site:** https://warwatch.world
**Live repo:** https://github.com/nitinchhabria89/WarWatch.World
**License:** MIT

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS, dark-first (`#0A0F1E` bg) |
| Map | Leaflet.js + react-leaflet (client-only) |
| AI | Groq API (`llama-3.3-70b-versatile`) |
| News | NewsAPI.org |
| i18n | Client-side locale switching via localStorage (10 languages) |
| Cache | JSON filesystem (`/data/cache/`) |
| Analytics | Google Tag Manager (`GTM-TZ2DPPBX`) |
| Ads | Google AdSense (`ca-pub-8381089290758563`) |
| Deploy | Vercel |

---

## Project Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — GTM, AdSense, SEO metadata
│   ├── page.tsx                # World map homepage (/)
│   ├── wars/page.tsx           # Active conflicts feed
│   ├── ai-analyst/page.tsx     # AI chat interface
│   ├── reports/
│   │   ├── page.tsx            # Reports listing
│   │   └── [date]/page.tsx     # Individual daily report
│   ├── markets/page.tsx        # Markets impact
│   ├── editorial-policy/       # Content neutrality policy
│   ├── privacy-policy/         # GDPR / AdSense required
│   ├── terms/                  # Terms of service
│   ├── monetization-policy/    # Ad placement transparency
│   └── api/
│       ├── conflicts/route.ts  # GET conflicts data
│       ├── refresh/route.ts    # POST trigger news refresh
│       ├── generate-report/route.ts  # POST daily report generation
│       └── ai-analyst/route.ts # POST streaming chat
├── components/
│   ├── Header.tsx              # Sticky nav — UTC clock, lang toggle, dark/light
│   ├── Footer.tsx              # Attribution + policy links
│   ├── WorldMap.tsx            # Leaflet map (client-only) — war front lines
│   ├── BreakingMarquee.tsx     # Live breaking news ticker
│   ├── CountryPanel.tsx        # Right-side conflict detail panel
│   ├── ConflictCard.tsx        # Single conflict card
│   ├── ConflictAccordion.tsx   # Expandable conflict list
│   ├── AIChatInterface.tsx     # Streaming chat UI
│   ├── AdUnit.tsx              # Google AdSense wrapper
│   ├── DisclaimerBanner.tsx    # Required on conflict pages
│   ├── SeverityBadge.tsx       # Color-coded severity indicator
│   └── ThemeProvider.tsx       # Dark/light theme context
├── data/
│   ├── conflicts.json          # Seed + cached conflict data
│   └── cache/                  # Auto-generated report cache (gitignored)
├── messages/                   # Language files (client-side only)
│   └── [en|ar|fr|es|de|hi|pt|tr|uk|ru].json
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   ├── conflicts.ts            # Data access helpers
│   ├── newsapi.ts              # NewsAPI client
│   └── utils.ts                # Shared utilities
├── public/
│   ├── favicon.png             # Globe favicon
│   └── ads.txt                 # Google AdSense ads.txt
├── vercel.json                 # Vercel build config
├── next.config.js              # Next.js config (no next-intl — client-side i18n only)
└── CLAUDE.md                   # This file
```

---

## Severity Color System

| Level | Color | Tailwind | Hex |
|---|---|---|---|
| Active War | Red | `text-red-500 / bg-red-500` | `#EF4444` |
| Escalating | Orange | `text-orange-500 / bg-orange-500` | `#F97316` |
| Instability | Yellow | `text-yellow-500 / bg-yellow-500` | `#EAB308` |
| Stable | Green | `text-green-500 / bg-green-500` | `#22C55E` |

Map polygons use opacity `0.6` on fill, `0.8` on hover.

---

## API Routes

### `GET /api/conflicts`
Returns the current `conflicts.json`. No auth required.

### `POST /api/refresh`
Fetches latest news from NewsAPI, updates conflict summaries. Requires `NEWSAPI_KEY`. Called by Vercel Cron every 60 minutes.

### `POST /api/generate-report`
Calls Groq (llama-3.3-70b-versatile) to generate a daily intelligence briefing. Stores result in `/data/cache/report-[YYYY-MM-DD].json`. Requires `GROQ_API_KEY`.

### `POST /api/ai-analyst`
Streams Groq responses. Body: `{ message: string, history: Message[] }`. Returns `text/event-stream`. Requires `GROQ_API_KEY`.

---

## Environment Variables

```bash
GROQ_API_KEY=               # Required — free at console.groq.com
NEWSAPI_KEY=                # Required — newsapi.org
NEXT_PUBLIC_SITE_URL=       # Required — https://warwatch.world
NEXT_PUBLIC_GITHUB_URL=     # https://github.com/nitinchhabria89/WarWatch.World
NEXT_PUBLIC_ADSENSE_PUB_ID= # Optional — Google AdSense (ca-pub-8381089290758563)
```

---

## Analytics & Ads

| Service | ID | Location |
|---|---|---|
| Google Tag Manager | `GTM-TZ2DPPBX` | `<head>` via `next/script beforeInteractive` |
| Google AdSense | `ca-pub-8381089290758563` | `<head>` + `AdUnit` component |
| ads.txt | `public/ads.txt` | Served at `/ads.txt` |
| Search Console | `ap8f63s9HE_pwCs_...` | `metadata.verification.google` |

---

## i18n (Language Support)

**10 languages:** `en ar fr es de hi pt tr uk ru`

Language switching is **100% client-side** — stored in `localStorage`, no URL-based routing. The `Header.tsx` language dropdown handles selection. Translation JSON files in `/messages/` are reserved for future server-side i18n if needed.

> ⚠️ `next-intl` has been removed — it was causing 404s by intercepting routes. Do NOT re-add it without also adding `middleware.ts` and `app/[locale]/` routing.

---

## SEO

Every page exports `metadata` with:
- Targeted `title` and `description`
- `keywords` array
- `openGraph` with `url` and `alternates.canonical`
- Root layout has `verification.google` for Search Console
- `sitemap.ts` covers all static + dynamic report routes
- `robots.ts` allows all pages, disallows `/api/`

---

## Ad Placements (Google AdSense)

| Slot | Dimensions | Location |
|---|---|---|
| Billboard | 970×250 | Below header on homepage |
| Left Rail | 160×600 sticky | Left sidebar (events section) |
| Right Rail | 160×600 sticky | Right sidebar (events section) |
| In-content | 300×250 | Between conflict cards every 8 items |
| Mobile Anchor | 320×50 | Bottom of viewport (mobile) |
| Footer | 728×90 | Footer leaderboard |

---

## Content Neutrality Rules (AdSense Compliance)

1. **Factual status framing only** — no evaluative language
2. **Attribute disputed claims** — use `"according to [source]"`
3. **No politically loaded labels** — use group's own name or neutral description
4. **Consistent terminology** — same tone for all parties
5. **No evaluative language** — avoid "illegal," "justified," "atrocity" unless quoting official bodies
6. **Event tags are factual only** — `Airstrike`, `Military`, `Diplomatic`, `Sanctions`, `Ceasefire`, `Casualties`, `Humanitarian`, `News`
7. **`DisclaimerBanner` required** on all pages showing conflict data

---

## Key Implementation Rules

1. **Leaflet is client-only** — always use `dynamic(() => import('./WorldMap'), { ssr: false })`
2. **AI model** — Groq `llama-3.3-70b-versatile` for all AI features
3. **Streaming** — AI Analyst uses streaming SSE via `ReadableStream`
4. **Caching** — NewsAPI responses cached to `/data/cache/` (TTL 60 min)
5. **No client-side API keys** — all Groq and NewsAPI calls in API routes only
6. **Severity order** — `war > escalating > instability > stable`
7. **No next-intl** — removed; language is client-side localStorage only

---

## Adding a New Conflict

Edit `/data/conflicts.json`:

```json
{
  "id": "unique-slug",
  "name": "Conflict Name",
  "countries": ["CountryA", "CountryB"],
  "countryCodes": ["XX", "YY"],
  "severity": "war | escalating | instability | stable",
  "status": "One-line status summary",
  "summary": "2-3 sentence summary",
  "startDate": "YYYY-MM-DD",
  "lastUpdated": "YYYY-MM-DD",
  "tags": ["Airstrike", "Diplomatic"],
  "events": [{ "date": "YYYY-MM-DD", "description": "...", "tags": ["Airstrike"] }],
  "marketImpact": { "oil": "high | medium | low | none", "gold": "high | medium | low | none" }
}
```

---

## Deployment (Vercel)

1. Fork repo, connect to Vercel (ensure correct GitHub account is linked)
2. Set all environment variables in Vercel dashboard
3. Add Vercel Cron: `POST /api/refresh` every hour (`0 * * * *`)
4. Add Vercel Cron: `POST /api/generate-report` daily (`0 0 * * *`)
5. Domain: `warwatch.world` assigned in Vercel project settings

---

## Common Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```
