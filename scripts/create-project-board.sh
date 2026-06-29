#!/usr/bin/env bash
# Creates the GitHub Project board and adds existing user-story issues (US-1 … US-14).
#
# Run once after issues exist:
#   gh auth refresh -h github.com -s project,read:project
#   ./scripts/create-project-board.sh

set -euo pipefail

REPO="ro61zzy/cryptotaxke"
OWNER="ro61zzy"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: brew install gh"
  exit 1
fi

echo "Creating project board…"
project_json=$(gh project create \
  --owner "$OWNER" \
  --title "CryptoTaxKE — Capstone Sprint Board" \
  --format json)

project_number=$(echo "$project_json" | python3 -c "import json,sys; print(json.load(sys.stdin)['number'])")
project_url=$(echo "$project_json" | python3 -c "import json,sys; print(json.load(sys.stdin)['url'])")

echo "Adding issues #1–#14 to the board…"
for i in $(seq 1 14); do
  gh project item-add "$project_number" \
    --owner "$OWNER" \
    --url "https://github.com/$REPO/issues/$i" >/dev/null
  echo "  added #$i"
done

echo ""
echo "Done. Project board:"
echo "$project_url"
echo ""
echo "In the GitHub UI, set columns: Backlog | Sprint 1 | Sprint 2 | Sprint 3 | Done"
echo "Move US-1–US-4 to Done, US-5 to Sprint 1, US-6–10 to Sprint 2, US-11–14 to Sprint 3."
