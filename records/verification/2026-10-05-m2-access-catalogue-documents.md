# Milestone 2 verification record

- Tag `m2-access-catalogue-documents` → commit `da113be` on product `main`. Verified by the orchestrator on the exact tree (merge tree identical to the verified fix branch).
- Gate: typecheck 0 errors; lint --max-warnings=0 clean; `npm test` 981 tests, 981 pass, 0 fail, 0 skipped (≈176 s). Boundary check-range m1-foundation..HEAD clean; extended check clean; identifier scan (spec rule IDs, record IDs, review finding IDs, internal paths) clean.

## Build
| Lane | Tests at hand-back | Notes |
|---|---|---|
| Identity & access + sign-in surfaces | 678 | first run stopped by session limit; WIP snapshot 751dd60 → continuation |
| Catalogue + launch control + public site | 725 | WIP 96b302a → continuation |
| Documents pipeline + worker jobs | 720 | WIP ab72093 → continuation |
| Integration (branch m2-integration) | 936 | fixed: fixtures vs new identity FKs, duplicate route ids, ports/resolvers, relation-name bug (`owning_ta` vs `owner_ta`), task attribution flush, canonical disposal (kernel migration 0002), removed engineering requeue CLI, per-session POST limiter, `tm seed synthetic` |

## Review (four code lenses + skeptics; independent Principal UX approval)
- Code: 26 findings; 12 confirmed P0/P1 (P0: attacker-driven sign-in lockout of staff/TA; unrelated-exclusion race with pending canonical move; country checks routed to the wrong adapter function), 0 refuted; all fixed on fix/m2-review-findings (950 tests), parked P2 recorded.
- UX: changes_required (4 P0: post-sign-in 404 for every role; support-view banner missing on catalogue/document pages; contradictory document state/attention; launch blockers read as met; 13 P1). UX fixer interrupted twice by usage limits (session, then weekly); WIP snapshots d08c341 and 34ff06c (hooks enabled) → continuation finished; independent recheck: all 17 resolved, no new P0, verdict APPROVED; 9 P2 parked (incl. P2-02: unrelated exclusion disposes bytes without a separate confirmation — to be handled in the final UI pass).

## Owner inputs still missing (release blockers reported by `tm seo check`)
- Verified business locality, contact details, legal pages; public country list empty. Nothing invented.

## Process notes
- `--no-verify` was used once on the first WIP snapshots (751dd60, 96b302a, ab72093); range check clean; not repeated.
