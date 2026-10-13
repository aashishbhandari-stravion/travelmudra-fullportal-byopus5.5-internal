# Brief ITEM-03-A2: wire, reads and procedure text for the possibly-filed guard (Part 1)

Role: Principal Software Engineer (implementation). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). You are the only writer in the product tree. Do not commit. Do not push. Do not edit
`internal/`, `src/apps/**`, `src/web/**`, `catalogue/synthetic/catalogue.json`, `scripts/uat/**`.

Public-fit rule: this repository becomes public. No code, comment, test name or document may contain an internal
identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, "seam log"). Write "owner decision of 13 October 2026".

## Already built (uncommitted; read `git diff` and `git status`)

The Core part: migration `1170`, `PROTECTION_MARK_FILING_DETERMINATIONS`, reason `protection_mark_determination_missing`,
fact `core.protection_mark_disposition_recorded`, `filingKindOf`, `filingDetermination`, `legacyMarksWithoutDisposition`,
`core.resolve_protection_mark` with `filing?: 'not_filed'`, the new command `core.record_mark_disposition`, the stage 8
blocker, `test/unit/core-mark-filing.test.ts`. Design (read only these lines):
`../research/inputs/proposals/K2-P17-1-possibly-filed-guard.md` lines 216-229 (§0.7 reads; NOT `reconstructedActs`).

## Task

1. **Contracts** (`src/contracts/core.ts`, additive only):
   - `core.resolve_protection_mark` input gains `filing: z.literal('not_filed').optional()`.
   - New command `core.record_mark_disposition` with the same input shape as the resolution
     (`markId`, `applicationId`, `filing?`, `evidenceRef`, `reason`).
   - The staff case read's `mark` (about `:325`) gains `possibly_filed`, `possibly_paid`, `possibly_released`, `restore_id`,
     `recorded_at`, and `filing`: `z.enum(['not_applicable', 'filed_on_record', 'protected_by_act', 'determination_required', 'uncertainty_required']).nullable()`.
   - New `legacyMarks`: array (max 16) of `{ mark_id, restore_id, resolved_at, filing }` with the same enum.
2. **Bindings** (`src/core-api/bindings/core.ts`): the resolution passes `filing`; bind the new command the same way
   (`about :528`); the read map fills the new mark fields and `legacyMarks` (about `:288`).
3. **Allowlist** (`src/core-api/allowlists.ts` about `:77`): add `core.record_mark_disposition` beside
   `core.resolve_protection_mark` on the same surface. If a command-to-policy registry exists (grep how
   `core.resolve_protection_mark` maps to `protection_mark.resolve`), map the new command to the same policy action.
4. **Read** (`src/modules/core/staff-views.ts`): compute the preview with `filingKindOf` and `filingDetermination` over the
   application's acts. Active mark with `possibly_filed`: row 1 `not_applicable`, row 2 `filed_on_record`, row 3
   `uncertainty_required`, row 4 `protected_by_act`, row 5 `determination_required`. A mark without `possibly_filed`:
   `null`. `legacyMarks`: each legacy-ambiguous mark without a disposition, with the same preview. Put one code comment
   above the computation: intent (removes a client-side computation of a permission), source facts (marks, act records,
   dispositions), consumers (the SuperAdmin mark pages), date 13 October 2026.
5. **Read-model register**: create `docs/verification/read-model-register.md` if it is absent. Header: one sentence ("One
   line per read model that projects facts Core already records: name, source facts, consumers, date.") and a table
   `| Read model | Source facts | Consumers | Date |`. Add one line for the mark filing preview and `legacyMarks`.
6. **Procedure text** (`src/platform/restore-scope.ts`, items 4 and 7 only, about `:334-348`; text only, no behaviour
   change): item 4 adds that a mark recorded as possibly filed resolves only with a filing determination (a filed act on
   record, an act whose uncertainty is recorded, or "not filed" with an external reference or a document), and "Do not
   resolve possibly filed marks under a release without this guard." Item 7 adds that a resolution recorded before this
   guard existed needs a SuperAdmin disposition before any external act is authorized. Keep line width as in the file.
7. **Refusal playbook** (`docs/playbooks/refusal-codes.md`; test `test/static/refusal-playbook.test.ts`): add the entry for
   `protection_mark_determination_missing` in the file's format: who acts (the SuperAdmin), what to do (record a disposition
   with evidence for the earlier resolution).
8. Pinned tests: `test/unit/frozen-interfaces.test.ts`, `test/unit/contracts.test.ts` MAY need the additive changes; update
   only what the new fields require and name it.

## Checks

`npx tsc -p tsconfig.json --noEmit`; `npx eslint` on every changed file; with a short TMPDIR
(`export TMPDIR=/tmp/claude-1000/cr6; mkdir -p $TMPDIR`): `node --test --test-global-setup=test/support/global-setup.ts`
on `test/unit/frozen-interfaces.test.ts`, `test/unit/contracts.test.ts`, `test/static/refusal-playbook.test.ts`,
`test/ops-tooling/restore-reopen.test.ts`, `test/system/*.test.ts` files that read the staff case read (grep `mark` in
`test/system/`), and any test that fails because of the new wire fields.

If a needed change sits in a file outside this brief, stop and report it. If your context approaches 100k tokens, stop and
return a partial result naming what remains.

## Return (at most about 250 words)

Files changed (one line each). Check results (pass/fail counts). Every deviation and why. Open points.
