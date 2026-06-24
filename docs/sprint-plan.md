# CryptoTaxKE — Sprint Plan & User Stories

**Methodology:** Scrum (solo). Three one-week sprints.
**Roles (solo):** Product Owner, Scrum Master, and Developer combined.

| Sprint | Dates | Goal |
| --- | --- | --- |
| Sprint 1 | Jun 24 – Jun 29 | Foundation: ingest and display a wallet's classified transactions |
| Sprint 2 | Jun 30 – Jul 5 | Intelligence: explanations, pricing, cost-basis gains, dashboard |
| Sprint 3 | Jul 6 – Jul 11 | RAG chat, polish, documentation, demo |

---

## Product backlog (user stories)

Stories are prioritized and pulled into sprint backlogs below. Each has an ID,
a story, and acceptance criteria.

### Sprint 1 — Foundation

**US-1 — Analyze a wallet by address**
_As a user, I want to paste a wallet address so that I can see its activity._
- [x] Address is validated before submission
- [x] Invalid input shows a clear error
- [x] A sample wallet is available to try with one click

**US-2 — Import transaction history**
_As a user, I want my transactions imported automatically._
- [x] Native + ERC-20 transfers are fetched via Alchemy
- [x] Sent and received transfers are merged per transaction hash
- [x] App falls back to sample data when no API key is configured

**US-3 — See readable transactions**
_As a user, I want each transaction shown clearly instead of raw hashes._
- [x] Each transaction shows date, direction, amounts, and assets
- [x] Transaction list is responsive and styled

**US-4 — Classify transactions**
_As a user, I want each transaction labeled (trade, transfer, etc.)._
- [x] Deterministic heuristic classifier assigns a category
- [x] Taxable categories are visually flagged
- [x] Classifier is covered by unit tests

**US-5 — Project foundations (engineering)**
- [x] CI runs lint, typecheck, tests, and build on every push
- [ ] App deployed to Vercel (demo mode)

### Sprint 2 — Intelligence

**US-6 — Plain-English explanations**
_As a user, I want a sentence explaining each transaction._
- [ ] AI generates a one-line summary per transaction (structured output)
- [ ] Explanations state whether the event is taxable

**US-7 — AI-assisted classification for ambiguous cases**
- [ ] Low-confidence heuristic results are escalated to the AI classifier
- [ ] Users can override a label

**US-8 — Historical pricing in KES**
- [ ] Asset prices at transaction time are fetched and cached
- [ ] USD→KES conversion applied

**US-9 — Capital gains (FIFO)**
- [ ] FIFO cost-basis engine matches disposals to acquisitions
- [ ] Realized gains computed in KES
- [ ] Engine covered by unit tests

**US-10 — Dashboard & tax estimate**
- [ ] Portfolio value, capital gains, and staking income shown
- [ ] Tax estimate computed from a configurable, versioned ruleset
- [ ] Disclaimer shown

### Sprint 3 — RAG chat, polish & delivery

**US-11 — Ask questions about my data**
_As a user, I want to ask "how much profit did I make this year?"_
- [ ] Chat answers questions grounded in the user's transactions

**US-12 — Grounded tax answers (RAG)**
- [ ] Knowledge base of Kenyan tax guidance is embedded (pgvector)
- [ ] Tax answers cite their sources

**US-13 — Polish & hardening**
- [ ] Loading and error states throughout
- [ ] Input validation and rate limiting on API routes

**US-14 — Delivery**
- [ ] Design & testing document complete
- [ ] Demo recorded (15–20 min)
- [ ] Repository shared with `quantic-grader`

---

## Definition of Done

A story is done when: code is merged to `main`, CI is green, relevant tests
pass, and the feature is visible in the deployed app (or documented for
demo-mode where keys are required).
