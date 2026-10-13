# Brief W3 (wave 1): incident defects ITEM-11 and ITEM-12

Role: Principal Software Engineer (implementation and tests). Two bounded items, one commit each: ITEM-11, then ITEM-12.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w3-incidents`
  (branch `wave1-incidents`, at `5f5e26b`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave1-incidents` and `5f5e26b`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w3; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks per item: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; targeted tests; at the end also
  `test/system/case-work.test.ts`, `test/unit/bff-access-change.test.ts`, `test/unit/frozen-interfaces.test.ts`.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey below is verified.

## Rules

As in `research/briefs/WAVE1-W1-identity.md` § Rules (failing test first with the evidence file
`research/evidence/ITEM-nn-fails-first.txt`; public-fit; commit message with
`Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; never bypass hooks).

Files you MAY edit (orchestrator grant, 13 Oct 2026): `src/modules/operations/case-work/incidents.ts`,
`src/modules/operations/case-work/facade.ts`, `src/modules/operations/case-work/types.ts` (doc comment only),
`src/core-api/bindings/operations-work.ts`, `src/contracts/operations-work.ts`,
`test/operations/incident-duty-end.test.ts`, `test/operations/artifacts-incidents.test.ts`. Nothing else; stop and
report if another file must change. The contract and binding change only the bounds (no shape change). Each commit body
ends, before the Co-Authored-By line, with: `Ownership grant (orchestrator, 13 Oct 2026): <the granted files this commit
changes>.`

## ITEM-11 (defect): incident rows carry the current duty holder

Survey: `incidentView` (`src/modules/operations/case-work/incidents.ts:97-107`) serves the STORED
`owner_account_id` and `reviewer_account_id`. `incidentDutyHolders` (`incidents.ts:123-145`) computes the current holders
but serves only policy relations (`facade.ts:156,170`) and `incidentsOwnedBy` (`incidents.ts:299`). After an assignment
ends, the row still names the earlier operator.

Change: `incidentView` takes the deps it needs and overlays the `incidentDutyHolders` result on owner and reviewer for a
NON-CLOSED incident. A closed incident keeps its stored owner and reviewer (history). A non-closed incident whose duty owner
is null is served `ownerKind: 'superadmin'` with a null owner account (the staff labels already read a null owner as the
SuperAdmin queue, `src/apps/staff/operations/labels.ts:46-65`). A named-owner incident (`official_fact_follow_up`) keeps
its owner while that owner is active; a deactivated owner becomes null. Update every caller: `facade.ts:106` (`caseWork`),
`facade.ts:136` (`incident`), `src/core-api/bindings/operations-work.ts:188` (`incidentDetail`) and `:220`
(`incidentRows`). `ops.admin_incidents` lists up to 500 rows: memoize the holder computation per application within one
read. An incident without an application keeps the stand-in rule of `incidentDutyHolders`. Keep `viewerIsReviewer` and
`monitorCounts` as they are (reported separately, not this item).

Test (`test/operations/incident-duty-end.test.ts`; the case at `:102-117` ends the assignment; helpers `startOpsKit`,
`kit.assign`, `cw.openIncident`, `kit.read`): after the assignment ends, `kit.caseWork.api.incident(tx, id)` and
`caseWork(tx, app).incidents[0]` give `ownerAccountId === null` and `ownerKind === 'superadmin'` (today the earlier
operator); a closed incident keeps its stored owner; through the wire binding (`operationsWorkQueryBindings(() =>
kit.caseWork)` with a staff `CallContext`, pattern `test/operations/protection-mark-legacy.test.ts:354-360`) the
`ops.incident` row says the same.

## ITEM-12 (defect, contract): the incident read serves the bounds the command accepts

Survey: `report_wrong_recipient` (`commands/incidents.ts` about `:103-160`) accepts up to 50 `releaseIds` and 50
`emailSendIds` (at most 100 records, one release per email per version) and stores `requiredEvidence` of at most 102 codes
(the correction plus one notice per recipient and the owning agent; at most 100 recipients, 101 notices). The read is
smaller: `requiredEvidence` and `missingEvidence` are sliced to 20 (`bindings/operations-work.ts:77-78`) and capped
`max(20)` (`src/contracts/operations-work.ts:144-147`); `affected.releaseIds`, `emailSendIds`, `recipientAccountIds` are
`max(50)` in `zWireIncidentDetail` (about `:212-214`) and NOT sliced, so `encodeWire` (`src/contracts/encoding.ts:63`)
throws and the incident page fails; `noticeIds` is capped 100 (`:191` and the contract) against up to 101.

Change: one named constant per bound in the contract, each equal to the command's bound, with a contract comment that
says so (a grant condition); `requiredEvidence` and `missingEvidence` max 102; the three
affected lists max 100; `noticeIds` max 101; replace the matching `.slice(…)` calls (`:77-78`, `:191`) with the same
constants. Leave the command's `releaseRefs` `.slice(0, 50)` (`commands/incidents.ts:178`) unchanged and report it.

Test (`test/operations/artifacts-incidents.test.ts`, helper `incident()` about `:45`, report case about `:183`): an
incident row written with SQL holding 102 required codes and 100 recipients, releases and email sends; the `ops.incident`
binding returns every value untruncated and `encodeWire(OPERATIONS_WORK_QUERIES['ops.incident'].view, …)` does not throw
(today it throws or truncates).

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why;
open points. Context: under 100k per turn. If your context passes about 250k, commit what is green and return before
275k with what remains.
