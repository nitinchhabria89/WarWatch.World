# 🌍 WarWatch.World

**Track every active war and global conflict in real time — powered by AI.**

[![Live](https://img.shields.io/badge/live-warwatch.world-red?style=flat-square)](https://warwatch.world)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nitinchhabria89/WarWatch.World)

---

## What is WarWatch.World?

WarWatch.World is a free, open-source platform that aggregates, analyzes, and visualizes every active war and geopolitical conflict worldwide in real time. It combines:

- 🗺️ **Interactive world map** — conflict zones color-coded by severity with animated war-front lines
- ⚔️ **Active conflicts feed** — filterable accordion with chronological event logs
- 🤖 **AI Analyst chat** — ask anything about active wars, powered by Groq LLaMA
- 📋 **Daily intelligence reports** — AI-generated briefings with regional breakdowns
- 📈 **Markets impact view** — how conflicts drive oil and gold commodity prices
- 📡 **Breaking news marquee** — live headlines updated every hour via NewsAPI
- 🌐 **10-language support** — EN, AR, FR, ES, DE, HI, PT, TR, UK, RU
- 🌙 **Dark / Light mode**

---

## Live Site

**[warwatch.world](https://warwatch.world)**

---

## Quick Start

### Prerequisites
- Node.js 18+
- [Groq API key](https://console.groq.com) (free)
- [NewsAPI key](https://newsapi.org) (free tier available)

### Installation

```bash
git clone https://github.com/nitinchhabria89/WarWatch.World.git
cd WarWatch.World
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
| `GROQ_API_KEY` | Yes | Groq API key (free at console.groq.com) |
| `NEWSAPI_KEY` | Yes | NewsAPI.org key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your site URL — `https://warwatch.world` |
| `NEXT_PUBLIC_GITHUB_URL` | No | GitHub repo URL |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | No | Google AdSense publisher ID |

---

## Deployment (Vercel)

1. Click the **Deploy** button above or fork and connect to Vercel.
2. Set all environment variables in the Vercel dashboard.
3. Add Vercel Cron jobs:
   - `POST /api/refresh` — every hour (`0 * * * *`) — fetches latest news
   - `POST /api/generate-report` — daily at midnight UTC (`0 0 * * *`) — generates AI briefing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS (dark-first) |
| Map | Leaflet.js + react-leaflet |
| AI | Groq API (llama-3.3-70b-versatile) |
| News | NewsAPI.org |
| Analytics | Google Tag Manager (GTM-TZ2DPPBX) |
| Ads | Google AdSense (ca-pub-8381089290758563) |
| Deployment | Vercel |

---

## Project Structure

```
app/              Next.js App Router (pages + API routes)
components/       Reusable UI components
data/             Conflict seed data + report cache
lib/              TypeScript types, data access, utilities
messages/         Language files (10 languages)
public/           Static assets (favicon, ads.txt)
```

See [CLAUDE.md](CLAUDE.md) for full architecture documentation.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/conflicts` | GET | Returns current conflict data |
| `/api/refresh` | POST | Fetches latest news, updates summaries |
| `/api/generate-report` | POST | Generates daily AI intelligence briefing |
| `/api/ai-analyst` | POST | Streams AI chat responses |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to:
- Add or update conflict data
- Add translations for new languages
- Submit bug fixes and feature PRs

All contributors welcome.

---

## License

MIT — free to use, modify, and distribute.

---

## Disclaimer

WarWatch.World is an informational platform aggregating publicly available news and data. It is not affiliated with any government, military, or intelligence agency. All conflict data should be verified through official sources before being relied upon for any decision-making. Content is presented neutrally in accordance with our [Editorial Policy](https://warwatch.world/editorial-policy).
