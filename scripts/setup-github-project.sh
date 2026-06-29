#!/usr/bin/env bash
# Creates the CryptoTaxKE GitHub Project board and sprint user-story issues.
#
# Prerequisites (run once):
#   brew install gh
#   gh auth login
#   git push -u origin main   # if you have not pushed yet
#
# Usage:
#   ./scripts/setup-github-project.sh

set -euo pipefail

REPO="ro61zzy/cryptotaxke"
OWNER="ro61zzy"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required. Install with: brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

echo "Creating sprint labels…"
for label in sprint-1 sprint-2 sprint-3 user-story; do
  gh label create "$label" --repo "$REPO" --force >/dev/null 2>&1 || true
done

create_issue() {
  local id="$1"
  local sprint_label="$2"
  local title="$3"
  local body="$4"
  local close="${5:-false}"

  echo "  → $id"
  url=$(gh issue create \
    --repo "$REPO" \
    --title "$id — $title" \
    --label "$sprint_label,user-story" \
    --body "$body")

  if [[ "$close" == "true" ]]; then
    num="${url##*/}"
    gh issue close "$num" --repo "$REPO" >/dev/null
  fi

  echo "$url"
}

echo "Creating user-story issues…"

create_issue "US-1" "sprint-1" "Analyze a wallet by address" \
"As a user, I want to paste a wallet address so that I can see its activity.

**Acceptance criteria**
- [x] Address is validated before submission
- [x] Invalid input shows a clear error
- [x] A sample wallet is available to try with one click" true

create_issue "US-2" "sprint-1" "Import transaction history" \
"As a user, I want my transactions imported automatically.

**Acceptance criteria**
- [x] Native + ERC-20 transfers are fetched via Alchemy
- [x] Sent and received transfers are merged per transaction hash
- [x] App falls back to sample data when no API key is configured" true

create_issue "US-3" "sprint-1" "See readable transactions" \
"As a user, I want each transaction shown clearly instead of raw hashes.

**Acceptance criteria**
- [x] Each transaction shows date, direction, amounts, and assets
- [x] Transaction list is responsive and styled" true

create_issue "US-4" "sprint-1" "Classify transactions" \
"As a user, I want each transaction labeled (trade, transfer, etc.).

**Acceptance criteria**
- [x] Deterministic heuristic classifier assigns a category
- [x] Taxable categories are visually flagged
- [x] Classifier is covered by unit tests" true

create_issue "US-5" "sprint-1" "Project foundations (engineering)" \
"Engineering foundations for the capstone deliverable.

**Acceptance criteria**
- [x] CI runs lint, typecheck, tests, and build on every push
- [ ] App deployed to Vercel (demo mode)"

create_issue "US-6" "sprint-2" "Plain-English explanations" \
"As a user, I want a sentence explaining each transaction.

**Acceptance criteria**
- [ ] AI generates a one-line summary per transaction (structured output)
- [ ] Explanations state whether the event is taxable"

create_issue "US-7" "sprint-2" "AI-assisted classification for ambiguous cases" \
"Hybrid classification: heuristics first, AI for low-confidence cases.

**Acceptance criteria**
- [ ] Low-confidence heuristic results are escalated to the AI classifier
- [ ] Users can override a label"

create_issue "US-8" "sprint-2" "Historical pricing in KES" \
"Fetch and cache asset prices at transaction time.

**Acceptance criteria**
- [ ] Asset prices at transaction time are fetched and cached
- [ ] USD→KES conversion applied"

create_issue "US-9" "sprint-2" "Capital gains (FIFO)" \
"FIFO cost-basis engine for realized gains.

**Acceptance criteria**
- [ ] FIFO cost-basis engine matches disposals to acquisitions
- [ ] Realized gains computed in KES
- [ ] Engine covered by unit tests"

create_issue "US-10" "sprint-2" "Dashboard & tax estimate" \
"Summary dashboard with tax estimate under KRA rules.

**Acceptance criteria**
- [ ] Portfolio value, capital gains, and staking income shown
- [ ] Tax estimate computed from a configurable, versioned ruleset
- [ ] Disclaimer shown"

create_issue "US-11" "sprint-3" "Ask questions about my data" \
"As a user, I want to ask \"how much profit did I make this year?\"

**Acceptance criteria**
- [ ] Chat answers questions grounded in the user's transactions"

create_issue "US-12" "sprint-3" "Grounded tax answers (RAG)" \
"RAG knowledge base for Kenyan tax guidance.

**Acceptance criteria**
- [ ] Knowledge base of Kenyan tax guidance is embedded (pgvector)
- [ ] Tax answers cite their sources"

create_issue "US-13" "sprint-3" "Polish & hardening" \
"Production polish before final submission.

**Acceptance criteria**
- [ ] Loading and error states throughout
- [ ] Input validation and rate limiting on API routes"

create_issue "US-14" "sprint-3" "Delivery" \
"Final capstone deliverables.

**Acceptance criteria**
- [ ] Design & testing document complete
- [ ] Demo recorded (15–20 min)
- [ ] Repository shared with quantic-grader"

echo "Creating GitHub Project board…"
project_json=$(gh project create \
  --owner "$OWNER" \
  --title "CryptoTaxKE — Capstone Sprint Board" \
  --format json)

project_url=$(echo "$project_json" | gh api graphql -f query='' 2>/dev/null || true)

# Parse project URL from JSON (gh returns id, number, url fields)
project_url=$(python3 -c "import json,sys; d=json.loads('''$project_json'''); print(d.get('url',''))" 2>/dev/null || echo "")

if [[ -z "$project_url" ]]; then
  project_number=$(python3 -c "import json,sys; d=json.loads('''$project_json'''); print(d.get('number',''))" 2>/dev/null || echo "")
  project_url="https://github.com/users/$OWNER/projects/$project_number"
fi

echo "Adding issues to the project board…"
project_number=$(python3 -c "import json,sys; d=json.loads('''$project_json'''); print(d.get('number',''))" 2>/dev/null || echo "1")

for i in $(seq 1 14); do
  gh project item-add "$project_number" \
    --owner "$OWNER" \
    --url "https://github.com/$REPO/issues/$i" >/dev/null 2>&1 || true
done

echo ""
echo "Done."
echo ""
echo "Project board: $project_url"
echo ""
echo "Next steps (in the GitHub UI):"
echo "  1. Open the project board link above"
echo "  2. Add all open issues from $REPO to the board"
echo "  3. Use columns: Backlog | Sprint 1 | Sprint 2 | Sprint 3 | Done"
echo "  4. Move US-1–US-4 to Done; keep US-5 in Sprint 1"
echo ""
echo "Then paste the project URL into README.md under Agile task board."
