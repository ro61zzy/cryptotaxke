# CryptoTaxKE

AI-powered crypto tax assistant for Kenyan users. Import a wallet, understand
each transaction in plain English, calculate gains in **KES**, and estimate tax
under **current KRA rules**, with a chat assistant grounded in Kenyan guidance.

**Live app:** [https://cryptotaxke.vercel.app](https://cryptotaxke.vercel.app)

> Estimates are for educational purposes only and are not tax advice.

---

## Capstone deliverables

| Deliverable | Link |
| --- | --- |
| **Deployed application** | [cryptotaxke.vercel.app](https://cryptotaxke.vercel.app) |
| **Source repository** | [github.com/ro61zzy/cryptotaxke](https://github.com/ro61zzy/cryptotaxke) |
| **Agile task board** | [GitHub Project #3](https://github.com/users/ro61zzy/projects/3) |
| **Design & testing document** | [`docs/design-and-testing.md`](docs/design-and-testing.md) |
| **Sprint plan & user stories** | [`docs/sprint-plan.md`](docs/sprint-plan.md) |
| **CI pipeline** | [GitHub Actions](https://github.com/ro61zzy/cryptotaxke/actions) |


---

## What the app does

- **Wallet import** — connect a browser wallet (MetaMask, Brave Wallet, etc.) or paste a `0x` address; pulls real on-chain data via Alchemy (Ethereum, Base, Polygon, BNB Chain).
- **Plain-English explanations** — each transaction summarized for non-technical users.
- **Smart classification** — heuristic rules first, AI for ambiguous cases (trade, transfer, staking, etc.).
- **FIFO cost basis in KES** — realized gains, staking income, portfolio value, and a simplified tax estimate.
- **Grounded AI chat** — ask questions about your wallet; answers cite Kenyan tax knowledge and your data.
- **CSV export** — download classified transactions for records.
- **Light / dark mode** — default light theme with KRA-inspired red accents.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| On-chain data | Alchemy (HTTP adapter) + viem |
| Pricing | CoinGecko + Frankfurter (USD→KES) |
| AI | Groq / DeepSeek / OpenAI (provider adapter) |
| Testing | Vitest + Testing Library (41 tests) |
| CI/CD | GitHub Actions + Vercel |

---

## Development

```bash
npm install
cp .env.example .env   # ALCHEMY_API_KEY required; GROQ_API_KEY for free AI chat
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ALCHEMY_API_KEY` | Yes (for import) | On-chain transaction fetch |
| `GROQ_API_KEY` | For AI chat | Free tier at [console.groq.com](https://console.groq.com) |
| `OPENAI_API_KEY` | Optional | Alternative AI provider |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run 41 unit/component tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

CI runs lint, typecheck, tests, and build on every push to `main`.

---

## Project structure

```
src/
├── app/              # Pages and API routes (chat)
├── components/       # UI (landing, dashboard, layout)
└── lib/
    ├── chain/        # Alchemy ingestion
    ├── classify/     # Heuristics + AI classification
    ├── tax/          # FIFO engine + rules
    ├── rag/          # Kenyan tax knowledge base
    ├── ai/           # LLM provider adapter
    └── wallet/       # Browser wallet connect
```

---

_Quantic MSSE Capstone · Solo project · Jun–Jul 2026_
