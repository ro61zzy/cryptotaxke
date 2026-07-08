# Agile task board

CryptoTaxKE was delivered in **three one-week sprints** using Scrum (solo). User
stories, acceptance criteria, and completion status are tracked on the GitHub
Project board.

## Board

**[CryptoTaxKE — Capstone Sprint Board](https://github.com/users/ro61zzy/projects/3)**

Columns: **Todo · In Progress · Done**

All 14 user stories (US-1 … US-14) are filed as GitHub Issues in
[ro61zzy/cryptotaxke](https://github.com/ro61zzy/cryptotaxke/issues).

---

## Sprint summary

| Sprint | Dates | Goal | Outcome |
| --- | --- | --- | --- |
| Sprint 1 | Jun 24 – Jun 29 | Foundation: ingest and display classified transactions | Complete |
| Sprint 2 | Jun 30 – Jul 5 | Intelligence: explanations, pricing, FIFO, dashboard | Complete |
| Sprint 3 | Jul 6 – Jul 11 | RAG chat, polish, documentation, demo | In progress |

---

## Story completion (Jul 2026)

| ID | Story | Status |
| --- | --- | --- |
| US-1 | Analyze a wallet by address | Done |
| US-2 | Import transaction history | Done |
| US-3 | See readable transactions | Done |
| US-4 | Classify transactions | Done |
| US-5 | Project foundations (CI, Vercel deploy) | Done |
| US-6 | Plain-English explanations | Done |
| US-7 | AI-assisted classification | Partial (AI escalation done; manual label override deferred) |
| US-8 | Historical pricing in KES | Done |
| US-9 | Capital gains (FIFO) | Done |
| US-10 | Dashboard & tax estimate | Done |
| US-11 | Ask questions about my data | Done |
| US-12 | Grounded tax answers (RAG) | Done |
| US-13 | Polish & hardening | Partial (loading states, 41 tests; API rate limiting deferred) |
| US-14 | Delivery (doc, demo, grader access) | In progress |

**12 of 14** stories fully complete on the board. US-7 and US-13 have minor scope
deferred; US-14 covers final submission artifacts.

---

## Supporting documents

| Document | Contents |
| --- | --- |
| [`sprint-plan.md`](./sprint-plan.md) | Full user stories with acceptance criteria |
| [`design-and-testing.md`](./design-and-testing.md) | Architecture, design decisions, test strategy |

---

## CI / Definition of Done

A story is **Done** when code is merged to `main`, CI is green, relevant tests
pass, and the feature is visible on the [deployed app](https://cryptotaxke.vercel.app).

GitHub Actions runs on every push: lint → typecheck → **41 tests** → production build.
