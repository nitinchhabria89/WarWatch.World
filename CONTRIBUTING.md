# Contributing to CrisisRadar.World

Thank you for your interest in contributing! CrisisRadar.World is a free, open-source public resource — every contribution helps.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- API keys: `ANTHROPIC_API_KEY` and `NEWSAPI_KEY` (see `.env.local.example`)

### Local Setup

```bash
git clone https://github.com/nitinchhabria89/CrisisRadar.World.git
cd CrisisRadar.World
npm install
cp .env.local.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Ways to Contribute

### 1. Update Conflict Data

The seed data lives in `/data/conflicts.json`. To add or update a conflict:

1. Follow the conflict object schema documented in `CLAUDE.md`.
2. Add recent events with dates and appropriate tags.
3. Set `lastUpdated` to today's date (`YYYY-MM-DD`).
4. Submit a PR with a brief description of the update and a source link.

**Event tag options:** `Airstrike`, `Diplomatic`, `Sanctions`, `Military`, `Casualties`, `Humanitarian`, `News`

### 2. Add or Improve Translations

Translation files are in `/messages/[locale].json`. Supported locales: `en ar fr es de hi pt tr uk ru`.

To add a new locale:
1. Copy `/messages/en.json` to `/messages/[locale].json`.
2. Translate all values (not the keys).
3. Add the locale code to the `locales` array in `i18n.ts`.
4. Submit a PR.

To improve an existing translation, edit the relevant `.json` file directly.

### 3. Bug Fixes & Features

1. Open an issue first for non-trivial changes to discuss the approach.
2. Fork the repo and create a feature branch from `main`.
3. Write clean, TypeScript-typed code following existing patterns.
4. Ensure `npm run build` and `npm run lint` pass before submitting.
5. Submit a PR with a clear description of what changed and why.

### 4. Map Improvements

The Leaflet map component is in `/components/WorldMap.tsx`. Country center coordinates are stored in the `COUNTRY_CENTERS` constant. To add missing countries, look up the ISO 3166-1 alpha-2 code and approximate [lat, lng] center.

---

## Code Style

- TypeScript strict mode — no `any` unless absolutely necessary.
- Tailwind CSS only — no inline styles except for dynamic values.
- No hardcoded display text — all strings through `useTranslations()` or i18n keys.
- Client components must have `'use client'` at the top.
- Leaflet always loaded via `dynamic(() => import(...), { ssr: false })`.

---

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Include a clear description of the change and the motivation.
- For data updates (conflicts), include a source URL in the PR description.
- For translations, note your native language in the PR if relevant.

---

## Reporting Issues

Use [GitHub Issues](https://github.com/nitinchhabria89/CrisisRadar.World/issues) to report bugs or request features. For conflict data accuracy issues, please include a source link.

---

## Disclaimer

CrisisRadar.World is a journalistic/informational tool, not an intelligence service. All contributors agree that conflict data submissions must be based on publicly available, verifiable sources. Do not submit unverified or speculative information as fact.
