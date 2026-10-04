#!/usr/bin/env bash
# Orchestrator integration gate for the public-bound product repository.
# Usage: integration-gate.sh <base-rev> [<tip-rev>]   (tip defaults to HEAD)
# Checks every commit in base..tip with the extended boundary rules, then scans
# the tip tree for internal rule identifiers and private markers, then runs the
# product check. Exits non-zero on any finding.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BASE="${1:?base revision required}"
TIP="${2:-HEAD}"
cd "$ROOT"
status=0

echo "== boundary check-range ${BASE}..${TIP}"
python3 /home/max-stravion/agent-guidance/repo_boundary.py check-range "$ROOT" "${BASE}..${TIP}" \
  --config "$ROOT/internal/agent/repo-boundary.json" || status=1

echo "== internal identifier scan (tree at ${TIP})"
# Spec rule identifiers, spec file name, internal paths and private markers.
pattern='\bB(0[1-9]|[1-3][0-9]|4[0-7])\b|BUILD_SPEC|internal/records|PRI-20|ARC-20|REP-20|STY-20|AUT-20|PAR-20|WEB-20|STO-20'
if git grep -nIE "$pattern" "$TIP" -- . ':!package-lock.json' ; then
  echo "!! internal identifiers found in tracked content"; status=1
fi
if git log --format='%H %s%n%b' "${BASE}..${TIP}" | grep -nE "$pattern"; then
  echo "!! internal identifiers found in commit messages"; status=1
fi
echo "== branch and tag names"
git for-each-ref --format='%(refname:short)' refs/heads refs/tags | grep -niE 'naruto|goku|hypervisa|internal|B[0-4][0-9]' && { echo "!! private ref name"; status=1; } || true

if [[ "${SKIP_PRODUCT_CHECK:-0}" != "1" ]]; then
  echo "== npm run check"
  npm run check || status=1
fi
exit $status
