# Brief W2 (wave 1): delivery reads ITEM-26, ITEM-27 and the defect ITEM-28

Role: Principal Software Engineer (implementation and tests). Three bounded items, one commit each, in this order:
ITEM-28, ITEM-27, ITEM-26 (smallest first; all three share `src/modules/delivery/pages.ts`,
`src/contracts/delivery.ts` and `src/core-api/bindings/delivery.ts`).

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w2-delivery`
  (branch `wave1-delivery`, at `5f5e26b`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out; the shell may reset its directory between calls). Use
  absolute paths under `$WT` for every Read, Edit and Write. Never touch the lane clone at
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
  or another worktree. First command: `cd $WT && git branch --show-current && git log --oneline -1` (expect
  `wave1-delivery` and `5f5e26b`; otherwise stop and report).
- Tests: `export TMPDIR=/tmp/claude-1000/w2; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks per item: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests, plus
  `test/delivery/*.test.ts` once at the end.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey below is verified.

## Rules

As in `research/briefs/WAVE1-W1-identity.md` § Rules (failing test first with the evidence file
`research/evidence/ITEM-nn-fails-first.txt`; edit only the named files; public-fit; commit message with
`Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; never bypass hooks).

Files you MAY edit (orchestrator grant, 13 Oct 2026): `src/modules/delivery/pages.ts`, `src/modules/delivery/store.ts`,
`src/contracts/delivery.ts`, `src/core-api/bindings/delivery.ts`, `test/delivery/*.test.ts`,
`docs/verification/read-model-register.md`, `test/unit/web/delivery-words.test.ts` (ONLY the two literal lines that ITEM-27 needs). Nothing else.

Kind 1 reads (ITEM-26, ITEM-27): one dated comment above each computation in the style of
`src/modules/core/staff-views.ts:185` (intent, source facts, consumers, date 13 October 2026) and one line each in
`docs/verification/read-model-register.md` (table format of the existing lines). Contract changes are additive: new
fields only, nothing removed or renamed. Each commit body ends, before the Co-Authored-By line, with:
`Ownership grant (orchestrator, 13 Oct 2026): <the granted files this commit changes>.`

## ITEM-28 (defect): the delivery page lists the newest email attempts first, with a stated cap

Survey: `readEmailsOf` (`src/modules/delivery/store.ts:154`) orders `queued_at, email_send_id LIMIT 100`, so the page shows
the earliest 100. Change: a NEW page-only store reader ordered `queued_at DESC, email_send_id DESC` with the cap as a named
constant (100); the index `dlv_email_sends_application_idx (application_id, queued_at)` serves it. Use it in the page
(`pages.ts`). State the order and the cap in the `zWireDeliveryPage.emails` comment (`.max(100)` exists). Do NOT change
`readEmailsOf`: `deliveryEvidence` (`evidence.ts:17`) and Core use it. The page's `unavailable` flag (about
`pages.ts:190`, computed from `emailRows.some(uncertain)`) MUST still see an uncertain send outside the window: compute it
with a separate `EXISTS` query. The resend offer (`resent.has(…)`) stays correct (a resend is newer than its original).
Test (`test/delivery/email-notices.test.ts`, about line 218, helper `kit.read`): insert 101 or more rows into
`dlv_email_sends` for one application; the page's first email is the newest and the length is 100; an uncertain send
older than the window still sets `unavailable`.

## ITEM-27 (Kind 1): `dlv.selection` items carry their stored subject and version identifiers

Survey: the wire item has `itemNo, applicationId, subjectKind, result, reason, label` only (`contracts/delivery.ts` about
`:172`, binding about `:257`). `selectionOne` (`pages.ts` about `:287`) already returns the rows with `subject_id` and
`document_version_id`. Change: add `subjectId` (reuse `zSubjectId`) and `documentVersionId` (`zWireId('dov').nullable()`,
null for a packet) to `zWireSelection` items and map them in the binding. No module change. Test: a binding-level test
(pattern: `test/operations/protection-mark-filing.test.ts:503-513`, `coreQueryBindings(...).find`; here
`deliveryQueryBindings(() => kit.delivery)` with a staff `CallContext`); fixture from `retrieveSelection`
(`test/delivery/selection.test.ts` about `:45`); assert both identifiers on the wire, null version for a packet.
Typecheck: `test/unit/web/delivery-words.test.ts:86` builds a `QueryView<'dlv.selection'>` literal; add the two fields
there ONLY IF the grant names that file; otherwise stop ITEM-27 and report.

## ITEM-26 (Kind 1): the SuperAdmin delivery page shows the owning travel agent's current account email

Survey: `deliveryPage` (`pages.ts` about `:131`) and `zWireDeliveryPage` (`contracts/delivery.ts` about `:104`, strict)
carry no owning-TA address. Change: when the surface is `admin` only, read the owner from
`d.core.getApplicationScope(tx, applicationId)` and the address from `d.identity.getRecipient(tx, taAccountId)` (already
on the delivery identity port, `deps.ts:32`); `getRecipient` throws `not_found_or_forbidden` when the owner is not a TA:
catch that and return null. Add `taAccountEmail: string | null` (null on the `ops` and `ta` surfaces; a support view is
surface `ta`, binding about `:184`). Address form: the normalized address that `getRecipient` returns (decision through the orchestrator, 13 Oct 2026); no identity change. Nothing is written; the address goes in no log and no fact.
Test (binding level as above, a SuperAdmin and an operator `CallContext`): the admin page shows the TA's current address,
also after the address changes; the operator page and the support view show null.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why;
open points. Context: under 100k per turn. If your context passes about 250k, commit what is green and return before
275k with what remains.
