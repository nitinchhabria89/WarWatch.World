# 🌍 CrisisRadar.World

**Real-time global crisis and conflict tracking, powered by AI.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nitinchhabria89/CrisisRadar.World)

---

## What is CrisisRadar.World?

CrisisRadar.World is a free, open-source platform that aggregates, analyzes, and visualizes active global conflicts in real time. It combines:

- **Interactive world map** — countries and conflict zones color-coded by severity
- **Active conflicts feed** — accordion list with chronological event logs
- **AI Analyst chat** — ask Claude anything about active crises
- **Daily intelligence reports** — AI-generated briefings with regional breakdowns
- **Markets impact view** — how conflicts correlate with oil and gold prices
- **10-language support** — EN, AR, FR, ES, DE, HI, PT, TR, UK, RU

---

## Quick Start

### Prerequisites
- Node.js 18+
- [Anthropic API key](https://console.anthropic.com)
- [NewsAPI key](https://newsapi.org)

### Installation

```bash
git clone https://github.com/nitinchhabria89/CrisisRadar.World.git
cd CrisisRadar.World
npm install
cp .env.local.example .env.local
# Edit .env.local with your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `NEWSAPI_KEY` | Yes | NewsAPI.org key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your site URL (e.g. `https://crisisradar.world`) |
| `NEXT_PUBLIC_GITHUB_URL` | No | GitHub repo URL |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | No | Google AdSense publisher ID |

---

## Deployment (Vercel)

1. Click the **Deploy** button above.
2. Set environment variables in the Vercel dashboard.
3. Add Vercel Cron jobs:
   - `POST /api/refresh` — every hour (`0 * * * *`)
   - `POST /api/generate-report` — daily at midnight UTC (`0 0 * * *`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Map | Leaflet.js + react-leaflet |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| News | NewsAPI.org |
| i18n | next-intl |
| Deployment | Vercel |

---

## Project Structure

```
app/              Next.js App Router (pages + API routes)
components/       Reusable UI components
data/             conflict seed data + report cache
lib/              TypeScript types, data access, utilities
messages/         i18n translation files (10 languages)
```

See [CLAUDE.md](CLAUDE.md) for full architecture documentation.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to:
- Update conflict data
- Add translations
- Submit bug fixes and features

---

## License

MIT — free to use, modify, and distribute.

---

## Disclaimer

CrisisRadar.World is an informational platform aggregating publicly available news. It is not affiliated with any government, military, or intelligence agency. Data should be verified through official sources before being relied upon for any decision-making.
