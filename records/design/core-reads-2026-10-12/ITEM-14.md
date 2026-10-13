# ITEM-14: the values-publication staleness check missed changes to existing work

Defect, catalogue. Wave 2, worker W6 (Sonnet, worktree `wave2-launch`; about 208k context for ITEM-14 and ITEM-07
together). Commit: `95eb5e0` (cherry-picked from `dfca5ff` with the message's cost paragraph corrected; parent
`f309b23`). Orchestrator grant (wave 2, 13 Oct 2026): `src/modules/catalogue/domain.ts`,
`src/modules/catalogue/commands/baselines.ts`, `declarations.ts` only if it must follow the shared function, and
`test/integration/catalogue-commands.test.ts`. Grant condition: the fingerprint over open applications is one aggregate
query, never per-application loads.

## Defect and change

`scopeFingerprint` (`src/modules/catalogue/domain.ts`) kept only submitted applications and hashed id, price and
payment. A draft accepted after the preview, a changed act state or changed travel dates left the fingerprint unchanged,
so a publication from a stale preview recorded the wrong affected count (observed: 1 affected draft while 2 existed).
The fingerprint now hashes every open application of the offering (the same set the impact preview counts): id,
lifecycle, act states, filed evidence, price, payment and travel dates, with sorted ids and act pairs. One function
serves both publication paths. A preview made before the deploy answers `preview_stale` once (accepted).

## Decision D-12 (grant condition not met; Max: closed with current decisions, remainder parked)

The fingerprint hashes rows of the existing per-application read `openApplicationsForOffering`
(`src/modules/core/catalogue-writers.ts`: acts, group, payment and price loaded per application). It adds no query; the
cost is the preview's existing cost, bounded by the 20,000-application cap. The condition "one aggregate query" is not
met. The worker's commit message first said "one keyset read"; the architect corrected it on cherry-pick. An aggregate
query needs grants for `src/modules/catalogue/ports.ts` and `src/domain/module-ports.ts`. Max (13 Oct 2026): take it to
a logical closure with the current decisions and park the remainder. Parked, P2. Trigger to revisit: publication of an
offering with many open applications becomes slow. (The fingerprint is a checksum of applications for preview
staleness, not biometric data.)

## Tests

`test/integration/catalogue-commands.test.ts`: a second draft added after the preview, a changed travel start and a
changed act state each give `preview_stale` and publish nothing; unchanged work publishes and records every open
application as affected. Failed first: `evidence/ITEM-14-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (`reviews/ITEM-14-review.md`). Verdict: sound as written. The reviewer
confirmed that hashing adds no queries and that the draft-creation share lock conflicts with publication's update lock.

- R-01, P2, parked: the regressions exercise only baseline publication through the fake Core port; no declaration
  publication or real-Core race test. Test hardening.

## Checks

`npm run check` at `95eb5e0` (detached checkout, while other checks ran): typecheck and lint clean; 2595 of 2596 tests
pass. The one failure is the known timing test `test/intake/source-structural.test.ts:51`, which fails under load and
passes alone (2 of 2). The quiet check at the wave 2 head covers this commit again.
