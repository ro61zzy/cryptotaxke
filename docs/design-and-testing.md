# CryptoTaxKE — Design & Testing Document

_This document is maintained throughout the project and finalized in Sprint 3.
It records architecture and design decisions (and the reasoning behind them),
deployment recommendations, and the testing strategy._

## 1. Problem & scope

Kenyan crypto users lack an affordable, understandable way to track
transactions, calculate gains in KES, and estimate tax under KRA rules.
CryptoTaxKE addresses this with automatic on-chain import, plain-English
explanations, a cost-basis engine, and a tax-aware AI assistant.

**MVP scope:** EVM chains (Ethereum, Base, Polygon, BNB Chain), read-only import by
address, hybrid classification, FIFO gains in KES, configurable tax estimate, CSV
export, and a RAG-grounded chat. Out of scope for MVP: Arbitrum/Optimism/Avalanche,
Solana/BTC, live exchange APIs.

## 2. Architecture overview

A single Next.js application (frontend + API routes) with external services
(Alchemy for on-chain data, OpenAI for AI, CoinGecko/Frankfurter for pricing).
This keeps deployment and operations simple for a solo project while preserving
clean internal boundaries.

```
Browser ──> Next.js (App Router)
              ├─ Server Components (pages)
              ├─ API routes (analyze, explain, chat)
              └─ lib/
                  ├─ chain/    (Alchemy adapter, normalization)
                  ├─ classify/ (heuristics + AI)
                  ├─ tax/      (FIFO cost-basis engine)
                  ├─ ai/       (provider adapter, RAG)
                  └─ db/       (Prisma repository)
External: Alchemy (on-chain) · OpenAI (LLM/embeddings) · Postgres+pgvector
```

## 3. Key design decisions

| Decision | Choice | Reasoning |
| --- | --- | --- |
| App framework | Next.js (single app) | One deploy, colocated API + UI; fast for a solo timeline |
| On-chain access | Alchemy HTTP adapter | Reliable indexed transfer history; adapter isolates the vendor |
| Storage model | In-memory analysis per request | No DB required for MVP; honest empty states when keys missing |
| Classification | Heuristics first, AI fallback | Cheap, fast, auditable for obvious cases; AI only where needed |
| AI provider | Behind an adapter | Swappable provider; testable without network |
| Tax rules | Configurable, versioned ruleset | Kenyan rules change often (see §6); estimates stay maintainable |
| Chat context | Lightweight re-analysis | Chat skips per-tx AI to stay within serverless timeouts |

### Design patterns used
- **Adapter** — `lib/chain` and `lib/ai` wrap third-party SDKs behind stable interfaces.
- **Strategy** — classification chooses between heuristic and AI strategies by confidence.
- **Repository** — `lib/db` mediates all persistence.
- **Layered architecture** — UI → services (`lib/*`) → adapters → external systems.

## 4. Domain model

Raw transfers are normalized into `NormalizedTransaction` (see
`src/types/index.ts`), classified into a `TxCategory`, then fed to the
cost-basis engine to produce `Disposal`s and a `TaxSummary`.

## 5. Testing strategy

Testing is part of the SDLC for every sprint: write code, add or extend tests,
run locally with `npm test`, then let GitHub Actions enforce the same checks on
push.

| Layer | Tooling | What is tested |
| --- | --- | --- |
| Unit | Vitest | Classification, FIFO, tax rules, chains, RAG keywords, wallet helpers, formatting, AI error handling |
| Component | Testing Library + jsdom | Wallet form validation, no-wallet guidance, navigation on analyze |
| CI | GitHub Actions | Lint, typecheck, **41 unit/component tests**, and production build on every push |

### Test inventory (`src/**/*.test.ts`)

| Module | File | Covers |
| --- | --- | --- |
| Classification heuristics | `lib/classify/heuristics.test.ts` | Trades, transfers, internal moves, confidence thresholds |
| AI classification gate | `lib/classify/ai.test.ts` | When low-confidence txs escalate vs skip AI |
| Plain-English templates | `lib/explain/templates.test.ts` | Swap summaries and taxability flags |
| FIFO cost basis | `lib/tax/fifo.test.ts` | Lot matching, staking income, multi-lot FIFO, transfer_out exclusion |
| Tax rules | `lib/tax/rules.test.ts` | Effective rate and negative-gain handling |
| Chain scope | `lib/chains.test.ts` | URL parsing, labels, supported networks |
| RAG retrieval | `lib/rag/search.test.ts` | Keyword search over Kenyan tax knowledge |
| Browser wallet | `lib/wallet/metamask.test.ts` | Provider detection, connect flow, error cases |
| Formatting utils | `lib/utils.test.ts` | KES formatting, address shortening |
| OpenAI client | `lib/ai/client.test.ts` | User-facing quota and API-key errors |
| Dashboard form | `components/dashboard/WalletForm.test.tsx` | Validation, routing, missing-wallet messaging |

### How to run

```bash
npm test          # single run (CI uses this)
npm run test:watch  # during development
```

Deterministic business logic (classification, FIFO, tax math) has the strongest
coverage because correctness there is essential and does not require external
APIs. AI and Alchemy integrations are mocked or exercised through adapter
fallbacks so tests stay fast and reliable in CI.

## 6. Tax rules context (Kenya)

The Kenyan crypto tax landscape is a moving target, which is why the ruleset is
configurable and versioned rather than hard-coded:

- The 3% **Digital Asset Tax** (2023) was **repealed in July 2025**.
- It was replaced by a **10% excise duty on VASP (exchange) fees**.
- **Income tax** (progressive 10–35%) applies to staking/mining/airdrop income.
- The **Finance Bill 2026** adds VASP reporting/CARF obligations (not new taxes).

> The app surfaces an estimate with an explicit disclaimer and cites sources via
> the RAG knowledge base.

## 7. Deployment recommendation & cost

**Recommended:** cloud, serverless. Frontend + API on **Vercel** (free Hobby
tier), Postgres on **Neon** (free tier), with Alchemy and OpenAI as managed
APIs.

| Component | Service | Cost (low volume) |
| --- | --- | --- |
| App hosting | Vercel Hobby | $0 |
| Database | Neon free tier | $0 |
| On-chain data | Alchemy free tier | $0 |
| AI | OpenAI usage-based | a few $ / month |

**Why cloud over on-prem:** zero ops, automatic scaling, free tiers suit a
solo/early-stage product. On-prem would add server management cost and effort
with no benefit at this scale. At higher volume, the main variable cost is AI
usage, mitigated by caching explanations and using heuristics first.
