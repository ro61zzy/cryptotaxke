# CryptoTaxKE

**An AI-powered crypto tax assistant built for Kenyan users.**

Existing crypto tax tools (Koinly, CoinTracker) are built for US/EU users, are
expensive, and never explain anything in plain language. CryptoTaxKE imports a
wallet's on-chain history, explains each transaction in plain English,
calculates gains in **KES**, and estimates tax under **current KRA rules** — with
a chat assistant grounded in Kenyan tax regulations.

> ⚠️ Estimates are for educational purposes only and are not tax advice.

---

## Repository

https://github.com/ro61zzy/cryptotaxke

## Live links

| Deliverable | Link |
| --- | --- |
| Deployed app | _added when deployed_ |
| Agile task board | [CryptoTaxKE — Capstone Sprint Board](https://github.com/users/ro61zzy/projects/3) |
| Design & testing document | [`docs/design-and-testing.md`](docs/design-and-testing.md) |
| Sprint plan & user stories | [`docs/sprint-plan.md`](docs/sprint-plan.md) |
| Agile board setup guide | [`docs/agile-board.md`](docs/agile-board.md) |
| Demo recording | _added at the end of Sprint 3_ |

## Features

- **Automatic import** — paste an address (wallet connect optional) to pull in swaps, transfers, and staking rewards via Alchemy.
- **Plain-English explanations** — `0xAF12 → 0xE9D4` becomes _"You swapped 0.2 ETH for 340 USDC."_
- **Hybrid classification** — deterministic rules first, AI for ambiguous cases, user-overridable.
- **Gains & tax estimates** — FIFO cost-basis accounting in KES under a configurable, versioned ruleset.
- **Grounded AI chat** — ask questions about your data; tax answers cite Kenyan regulations (RAG).

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| On-chain data | Alchemy SDK + viem |
| AI | OpenAI (behind a provider adapter) |
| Database | PostgreSQL + Prisma + pgvector |
| Testing | Vitest (unit), Playwright (e2e) |
| CI/CD | GitHub Actions + Vercel |

## Getting started

```bash
npm install
cp .env.example .env   # fill in keys (optional — app runs in demo mode without them)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `ALCHEMY_API_KEY` in `.env` for on-chain import. Without it, the dashboard explains what's missing — no fake data is shown.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run unit tests |
