# Brief: wave 1 survey (read-only), one group of items per agent

Role: Senior engineer, survey only. You do not edit, stage, commit, stash or run tests. You read source with targeted
commands (`grep -n`, `sed -n 'a,bp'`, `git show HEAD:<path> | sed -n`) and never read a large file in full. Repository:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). Another process may be running tests in this tree: do not touch it.

Context limit: stay under 100k tokens. If you approach it, return what you have and name what is missing.

## Inputs

- Your group's items and their source documents are named in your launch message.
- Each item's plan row: `repo/internal/records/design/core-reads-2026-10-12/PLAN.md` §3 (columns "Scope built in this
  run" and "Waits for Max (do not build)"). Read only your rows (`grep -n "ITEM-nn" PLAN.md`).
- Lane ownership (prompt §4, verbatim): "`src/modules/core/` except the K2-S1 group files; `src/modules/delivery/` read
  models for the P-13 (1) item only; `src/modules/identity/` session and surface-read wiring for the WP-15 support-view
  item only; `src/modules/catalogue/` for the WP-02 F-01 staleness defect only; `src/modules/payments/service-status.ts`
  and its tests; `src/core-api/bindings/{core,identity}.ts`, `src/core-api/allowlists.ts` and `src/core-api/server.ts`
  for the replay path; `src/contracts/core.ts` additive fields only; `src/modules/operations/` launch guards for P-06 (1);
  `test/core/`, `test/payments/`, `test/identity/`, `test/system/` for those paths. No migration is expected." Kernel
  files (`src/kernel/**`) always need an orchestrator grant. A source document's own ownership section, if it has one,
  also counts.

## What to return (at most about 500 words, this structure, per item)

1. Defect or read: one sentence. Current behaviour verified at `file:line` (quote the decisive line or condition).
2. Change sites: `file:line` and function for each edit; the smallest change in one or two sentences.
3. Tests: the existing test file to extend (`file:line` of a similar case and the helper it uses); the test command
   (`node --test --test-global-setup=test/support/global-setup.ts <files>`); what the failing-first assertion is.
4. New vocabulary: any reason code, fact type, contract field, binding, allowlist entry or migration the change needs.
   Name existing values that can be reused instead.
5. Ownership: each file to change, marked "owned (§4 …)", "owned (source document's ownership section)", or
   "NEEDS GRANT" (with the reason).
6. Risks: hostile but valid states (retry, concurrency, stale data, an empty or absent value) that the change must keep.
7. Anything in the source document or the plan row that conflicts with the code as it is now.

End with: which items share files (so one worker should do them together), and your context size estimate.
