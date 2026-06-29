# Agile task board (CryptoTaxKE)

The capstone handbook requires an **accessible agile task board** documenting user
stories, tasks, and completion status across **at least three sprints**.

## Where the sprints live

| Artifact | Purpose | Link |
| --- | --- | --- |
| **GitHub Project board** | Primary deliverable for graders (Issues + columns) | See README → *Agile task board* |
| [`sprint-plan.md`](./sprint-plan.md) | Sprint dates, user stories, acceptance criteria |

## Sprint schedule

| Sprint | Dates | Goal |
| --- | --- | --- |
| Sprint 1 | Jun 24 – Jun 29 | Foundation: ingest and display classified transactions |
| Sprint 2 | Jun 30 – Jul 5 | Intelligence: explanations, pricing, FIFO gains, dashboard |
| Sprint 3 | Jul 6 – Jul 11 | RAG chat, polish, documentation, demo |

## One-time setup (GitHub Project)

### 1. Push the code

From the project folder (you must be logged into GitHub):

```bash
git push -u origin main
```

### 2. Create the board and issues

```bash
brew install gh          # if needed
gh auth login
chmod +x scripts/setup-github-project.sh
./scripts/setup-github-project.sh
```

The script creates **14 user-story issues** (US-1 … US-14) with sprint labels and
a **GitHub Project** board.

### 3. Arrange columns in the UI

Open the project URL printed by the script, then:

1. **Add all issues** from `ro61zzy/cryptotaxke` to the board
2. Create columns: **Backlog · Sprint 1 · Sprint 2 · Sprint 3 · Done**
3. Move cards:
   - **Done:** US-1, US-2, US-3, US-4 (Sprint 1 complete)
   - **Sprint 1:** US-5 (Vercel deploy remaining)
   - **Sprint 2:** US-6 … US-10
   - **Sprint 3:** US-11 … US-14

### 4. Link it in the README

Copy the project URL into `README.md` → *Agile task board* so graders can open it
directly from the repo.

## Manual alternative (no CLI)

1. Repo → **Projects** → **New project** → **Board**
2. Repo → **Issues** → **New issue** for each US-1 … US-14 (copy text from
   [`sprint-plan.md`](./sprint-plan.md))
3. Add issues to the board and arrange by sprint column as above
