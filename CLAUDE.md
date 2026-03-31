# CrisisRadar.World — CLAUDE.md

## Project Summary

CrisisRadar.World is an open-source, real-time global crisis and conflict tracking platform. It aggregates news via NewsAPI, generates AI analysis with Claude, and presents data via an interactive world map, conflict feeds, AI chat, daily briefings, and market impact views.

**Live repo:** https://github.com/nitinchhabria89/CrisisRadar.World
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
| i18n | next-intl (10 languages) |
| Cache | JSON filesystem (`/data/cache/`) |
| Deploy | Vercel (recommended) |

---

## Project Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (HTML shell, dark theme)
│   ├── page.tsx                # World map homepage (/)
│   ├── [locale]/               # i18n locale wrapper
│   ├── wars/page.tsx           # Active conflicts feed
│   ├── ai-analyst/page.tsx     # AI chat interface
│   ├── reports/
│   │   ├── page.tsx            # Reports listing
│   │   └── [date]/page.tsx     # Individual daily report
│   ├── markets/page.tsx        # Markets impact
│   └── api/
│       ├── conflicts/route.ts  # GET conflicts data
│       ├── refresh/route.ts    # POST trigger news refresh
│       ├── generate-report/route.ts  # POST daily report generation
│       └── ai-analyst/route.ts # POST streaming chat
├── components/
│   ├── Header.tsx              # Persistent nav with UTC clock
│   ├── Footer.tsx              # Attribution + links
│   ├── WorldMap.tsx            # Leaflet map (client component)
│   ├── CountryPanel.tsx        # Right-side country detail panel
│   ├── ConflictCard.tsx        # Single conflict card
│   ├── ConflictAccordion.tsx   # Expandable conflict list
│   ├── AIChatInterface.tsx     # Streaming chat UI
│   ├── AdUnit.tsx              # Google AdSense wrapper
│   └── SeverityBadge.tsx       # Color-coded severity indicator
├── data/
│   ├── conflicts.json          # Seed + cached conflict data
│   └── cache/                  # Auto-generated report cache
├── messages/                   # i18n translation files
│   ├── en.json
│   └── [ar|fr|es|de|hi|pt|tr|uk|ru].json
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   ├── conflicts.ts            # Data access helpers
│   └── newsapi.ts              # NewsAPI client
├── i18n.ts                     # next-intl config
├── CLAUDE.md                   # This file
├── CONTRIBUTING.md
├── README.md
└── .env.local.example
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
Fetches latest news from NewsAPI, updates conflict summaries. Requires `NEWSAPI_KEY`. Should be called by a cron job every 60 minutes (Vercel Cron or similar).

### `POST /api/generate-report`
Calls Groq (llama-3.3-70b-versatile) to generate a daily intelligence briefing. Stores result in `/data/cache/report-[YYYY-MM-DD].json`. Requires `GROQ_API_KEY`.

### `POST /api/ai-analyst`
Streams Groq responses. Body: `{ message: string, history: Message[] }`. Returns `text/event-stream`. Requires `GROQ_API_KEY`.

---

## Environment Variables

```bash
GROQ_API_KEY=               # Required — free at console.groq.com
NEWSAPI_KEY=                # Required — newsapi.org
NEXT_PUBLIC_SITE_URL=       # Required — https://crisisradar.world
NEXT_PUBLIC_GITHUB_URL=     # https://github.com/nitinchhabria89/CrisisRadar.World
NEXT_PUBLIC_ADSENSE_PUB_ID= # Optional — Google AdSense pub-XXXXXXX
```

---

## Ad Placements (Google AdSense)

| Slot | Dimensions | Location |
|---|---|---|
| Billboard | 970×250 | Below header |
| Left Rail | 160×600 sticky | Left sidebar |
| Right Rail | 160×600 sticky | Right sidebar |
| Half Page | 300×600 | Right column |
| In-content | 300×250 | Between conflict cards |
| Mobile Anchor | 320×50 sticky | Bottom of viewport (mobile) |
| Footer | 728×90 → 300×250 | Footer leaderboard |

All ads are lazy-loaded. The `<AdUnit>` component checks for `NEXT_PUBLIC_ADSENSE_PUB_ID` and renders nothing if not set — this allows development without ads.

---

## i18n

Supported locales: `en ar fr es de hi pt tr uk ru`

Route pattern: `/[locale]/...` — the root `/` auto-redirects based on `Accept-Language` header.

Translation keys live in `/messages/[locale].json`. All UI strings must use `useTranslations()` from `next-intl`. Never hardcode display text in components.

---

## Policy & Compliance Pages

| Route | Purpose | AdSense Required? |
|---|---|---|
| `/editorial-policy` | Neutrality standards, data sourcing, tag definitions | Yes — sensitive content |
| `/privacy-policy` | Cookie/data disclosure, Google AdSense cookies | **Yes — mandatory** |
| `/terms` | Disclaimer, acceptable use, liability | Yes |
| `/monetization-policy` | Ad placement explanation, editorial independence | Yes — transparency |

All policy pages are linked in the Footer on every page.

---

## Content Neutrality Rules (AdSense Compliance)

These rules are **non-negotiable** to maintain Google AdSense eligibility. Any AI-generated or human-contributed conflict content must follow them:

1. **Factual status framing only** — write `"Military operations began on [date]"`, never `"brutal invasion"` or `"heroic defense"`
2. **Attribute disputed claims** — use `"according to [source]"` for any claim that one party disputes
3. **No politically loaded labels** — do not call any group "terrorists" without quoting an authoritative body that formally designated them; use the group's own name or neutral description
4. **Consistent terminology** — use the same tone and style for all parties in a conflict regardless of political alignment
5. **No evaluative language** — avoid words like "illegal," "justified," "disproportionate," "atrocity" unless directly quoting a court, UN body, or official resolution
6. **Event tags are factual categories only** — allowed: `Airstrike`, `Military`, `Diplomatic`, `Sanctions`, `Ceasefire`, `Casualties`, `Humanitarian`, `News`. Do not create tags that imply moral judgment.
7. **`DisclaimerBanner` component required** on all pages showing conflict data (wars, markets, homepage)

---

## Key Implementation Rules

1. **Leaflet is client-only** — always use `dynamic(() => import('./WorldMap'), { ssr: false })` to avoid SSR errors.
2. **Claude model** — use `claude-sonnet-4-6` unless the task is simple (then `claude-haiku-4-5-20251001` for cost).
3. **Streaming** — the AI Analyst chat uses `anthropic.messages.stream()` and forwards SSE to the client via `ReadableStream`.
4. **Caching** — NewsAPI responses are cached to `/data/cache/` to avoid hitting rate limits. TTL = 60 minutes.
5. **No client-side API keys** — all Anthropic and NewsAPI calls happen in API routes only, never in client components.
6. **SEO** — every page exports `generateMetadata()` with dynamic titles, descriptions, and OG tags.
7. **Severity order** — when sorting conflicts, use: war > escalating > instability > stable.

---

## Adding a New Conflict

Edit `/data/conflicts.json` and add an entry following this shape:

```json
{
  "id": "unique-slug",
  "name": "Conflict Name",
  "countries": ["CountryA", "CountryB"],
  "countryCodes": ["XX", "YY"],
  "severity": "war | escalating | instability | stable",
  "status": "One-line status summary",
  "summary": "2-3 sentence AI or manual summary",
  "startDate": "YYYY-MM-DD",
  "lastUpdated": "YYYY-MM-DD",
  "tags": ["Airstrike", "Diplomatic", "Sanctions"],
  "events": [
    {
      "date": "YYYY-MM-DD",
      "description": "Event description",
      "tags": ["Airstrike"]
    }
  ],
  "marketImpact": {
    "oil": "high | medium | low | none",
    "gold": "high | medium | low | none"
  }
}
```

---

## Adding a New Language

1. Create `/messages/[locale].json` (copy from `en.json`, translate values).
2. Add the locale code to the `locales` array in `i18n.ts`.
3. Add an `hreflang` entry in the root layout's `<head>`.
4. Submit a PR — translations are community-maintained.

---

## Deployment (Vercel)

1. Fork the repo, connect to Vercel.
2. Set environment variables in Vercel dashboard.
3. Add a Vercel Cron job: `POST /api/refresh` every hour (`0 * * * *`).
4. Optionally add `POST /api/generate-report` daily at midnight UTC (`0 0 * * *`).

---

## Common Development Tasks

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```

To test AI features locally, ensure `GROQ_API_KEY` and `NEWSAPI_KEY` are set in `.env.local`.
