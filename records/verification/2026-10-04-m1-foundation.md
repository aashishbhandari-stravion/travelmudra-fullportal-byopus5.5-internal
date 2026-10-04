# Milestone 1 (foundation) verification record

- Tag `m1-foundation` → commit `d878072` on product `main`. Verified by the orchestrator on the integrated tree, not from agent reports.
- Gate: `npm run typecheck` 0 errors; `npm run lint --max-warnings=0` clean; `npm test` 599 tests, 599 pass, 0 fail, 0 skipped (≈147 s; real PostgreSQL 16.15 cluster per run, real clamd with signatures, real bwrap/cgroup workers, Playwright Chromium for UI/CSP/axe checks).
- Boundary: `repo_boundary.py check-range` over all history clean; extended check clean; internal-identifier scan (spec rule IDs, record IDs, internal paths) clean; ref names clean.

## Lanes and their evidence
| Lane | Merge | Tests at hand-back | Sensitivity proofs |
|---|---|---|---|
| Kernel core (tooling, vocabulary, db, migration 0001, tm db/migrate) | df65e51 | 114 | — (foundation for later proofs) |
| Kernel runtime (runner, facts, tasks, admission gate, blobs, faults) | 24f93fa | 177 | 16 mutations, all detected |
| Platform seams (workers, scanner, mail, ALTCHA, role hardening, diag rotation) | 620054f | 176 | 14 mutations, all detected |
| Countries + static analysis | 2d03767 | 198 | 22 mutations, all detected |
| Integration fixes | b81fca0 | 323 | — |
| Design system (UX-approved after 1 P0 + 4 P1 fixes, re-checked) | f5fd6e5 | 492 | browser a11y/CSP/overflow checks |
| Web shell + server composition | merged before b48df28 | 541 | 14 mutations, all detected |
| Foundation review fixes (17 confirmed findings) | b48df28 | 542 | 15 automated + 6 manual reverts |
| Integration seams (audit health, route markers, one CSP) | d878072 | 599 | marker-rule sensitivity tests |

## Measurements (PostgreSQL 16.15, this host)
- Admission gate: row-lock close was starved by overlapping FOR SHARE holders (granted only after the stream stopped; 40/47 later requests overtook it); advisory exclusive gate granted after ≈1 hold period (≈100 ms) with no overtaking.
- Predicate locks: keep `max_pred_locks_per_transaction = 128` (relation-level promotion only at 64); catalogue recheck batch 50 (≤ 100); 53200 never observed.
- Workers: Node inside cgroup scope; allocation beyond MemoryMax killed; fork bomb capped by TasksMax; parse worker ENETUNREACH; timeout kills group and scope (~2.4 s for 2 s wall); outputs verified by size+SHA-256 without following links.
- clamd: start 11–12 s; ≈1.0 GB RSS; EICAR detected; encrypted content rejected; unavailable ⇒ fail closed.

## Foundation review (B41 internal foundation check)
- Four lenses (conformance, adversarial failure, security, maintainability), 41 findings; adversarial verification confirmed 18 P0/P1 (3 P0: closure-kind overwrite after restore, drain broken under hardened roles, §18 closed sets not applied). All fixed with tests. Refuted/downgraded: 3; parked P2: MAINT-02/04/05/07 and others (contract §19).
- Result: foundation check PASSED → module lanes may build on it (B41).

## Residual risks (recorded)
- Schema owner (`tm_owner`) can disable its own triggers (ownership right); only the operator CLI holds that credential.
- In-process country adapter runaway may interrupt the server (accepted owner decision); post-call budget detection only.
- Backup health category reports `unknown` until the backup tooling (milestone 5).
