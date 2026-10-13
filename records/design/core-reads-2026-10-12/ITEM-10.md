# ITEM-10 P-19 (4): structural transitions and the launch hold in the pending answer

Defects, Core and catalogue. Wave 2, worker W7 (Opus, worktree `wave2-transitions`; about 232k context for the three
groups). One commit per group, one Codex review per group:

| Group | Commit | From (worker) | Parent |
|---|---|---|---|
| (d) launch hold in the pending answer | `05d7b46` | `621e0e1`, amended for D-14 | `5779060` |
| (b) no second approval after a decline | `da20fd7` | `74cc1d9` | `05d7b46` |
| (a)+(c) declined item returns to the queue; target is the reviewed head | `10916cc` | `155dc6d` | `da20fd7` |
| (d) review follow-up (D-15) | `3a81652` (amended from `e0b978d`) | architect (lane) | `60fd311` |

Grants (orchestrator, 13 Oct 2026): (d) `src/modules/core/derived.ts`, `src/modules/core/store.ts`,
`test/core/launch.test.ts`; (b) `src/modules/core/catalogue-writers.ts`, `test/core/catalogue-impact.test.ts`; (a)+(c)
`src/modules/catalogue/api.ts`, `src/modules/catalogue/impact.ts`, `src/modules/catalogue/commands/impact.ts`,
`src/modules/core/commands/admin.ts`, `test/core/catalogue-impact.test.ts`; follow-up `src/modules/core/derived.ts`,
`test/core/launch-withdrawal-pending.test.ts`. Files under `src/modules/core/` are prompt scope.

## Defects and changes

(d) The pending answer never consulted launch control, so work that a suspension or a withdrawal held still named the
operator's next step while the control evaluator refused it. The answer now asks launch control (control stage 4, same
request) for each step it governs. Under a suspension that holds the work: SuperAdmin, the hold's code,
`record_existing_work_treatment`. Under a withdrawal without continuation: SuperAdmin,
`withdrawal_continuation_not_permitted`, `record_outcome` (D-14: the SuperAdmin closes the work with the existing
operational withdrawal; nothing closes automatically). The wait begins at the latest suspension or withdrawal fact of
the offering (new store helper `latestOfferingFactSeq`).

(d) review follow-up (D-15, `3a81652`): a withdrawal refuses the submission of every draft whatever its treatment, so a
draft (edited by the travel agent, or in assistance) is pending on the SuperAdmin to close it (`offering_withdrawn`,
`record_outcome`). A withdrawal comes before a suspension, because its treatment is never widened. Where the operational
withdrawal's own assessment would refuse the close (for example, a preparation-only offering declares no withdrawal
cut-off), the answer is `unresolved_known_limitation` with the SuperAdmin as follow-up and next action `none`. The
assisted-draft rule (13) now applies only while no outcome is recorded, as the other draft rule does; without this, a
closed assisted draft would ask for the close again. A suspension leaves a draft's own rules unchanged.
The read-only `assessWithdrawal` moved from `commands/withdrawal.ts` into `derived.ts` (the case binding and the
withdrawal commands import it there). The first version, `e0b978d`, imported it from the commands file, which made an
import cycle (`withdrawal.ts` → `derived.ts` → `writers.ts`) that the static test `no value-import cycle exists among
source files` refuses; the architect ran tsc, eslint and `test/core` but not `test/static` before committing. Found by
worker W13 at e0b978d before any package or deploy; fixed by amending to `3a81652` (static 76/76, core and withdrawal
tests 236/236).

(b) Core returned an existing transition without its state, so a second approval after the travel agent's decline was
accepted and opened nothing. Opening a transition now refuses `control_blocked/impact_decision_not_allowed` when the
item's transition was declined. A retry while open or applied returns the same transition.

(a)+(c) After a decline the catalogue item stayed at treatment `transition`, counted nowhere and owned by no one. Core's
decline now calls one new catalogue port, `CatalogueApi.noteTransitionDeclined`, in the same transaction: the current
item returns to `pending` (SuperAdmin queue) with a `cat.impact_item_decided` fact, and the assessment's counts and state
are refreshed. The approval now targets the head the item's assessment reviewed and refuses
`control_blocked/impact_item_not_current` when the offering head differs. Frozen-interface record in the commit body
(additive port).

## Tests

- (d) `test/core/launch.test.ts`: suspension hold → SuperAdmin with the suspension's fact sequence; a continuing
  treatment returns the operator rules; a withdrawal without continuation → `record_outcome`, and the operational
  withdrawal ends it (PROVIDER offering; PREP refuses the close, see R-01). Failed first:
  `evidence/ITEM-10-d-fails-first.txt`, `evidence/ITEM-10-d-withdrawal-fails-first.txt`.
- Follow-up `test/core/launch-withdrawal-pending.test.ts` (new file, fresh database): a travel agent's draft and an
  assisted draft under a continuing withdrawal go to the SuperAdmin, submitted work continues, and the close leaves
  each draft at its closure step; suspension hold plus continuing withdrawal → the suspension's treatment, narrowed to
  hold → the withdrawal's close; PREP submitted work → the limitation, and the close is refused with
  `withdrawal_cutoff_undeclared`. Failed first, and the rule-13 guard checked by removing it alone:
  `evidence/ITEM-10-d-followup-fails-first.txt`.
- (b) and (a)+(c) `test/core/catalogue-impact.test.ts` with Core's real writers. Failed first:
  `evidence/ITEM-10-b-fails-first.txt`, `evidence/ITEM-10-ac-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass per group (`reviews/ITEM-10-d-review.md`, `ITEM-10-b-review.md`,
`ITEM-10-ac-review.md`). The follow-up has no re-review (lane rule).

- (d) Verdict: sound with the fixes. R-01, P1: preparation-only work under a withdrawal without continuation names
  `record_outcome`, but the close is refused. **Max (13 Oct 2026, D-15): state the limitation.** Fixed in `3a81652`.
- (d) R-02, P1: a draft in assistance under a withdrawal still names the operator's first step. **Max (D-15): fix now.**
  Fixed in `3a81652` for every draft.
- (d) R-03, P1: with a suspension and a withdrawal both holding, the suspension's treatment was named. **Max (D-15): fix
  now.** Fixed in `3a81652`.
- (d) R-04, P2, parked: `latestOfferingFactSeq` has no offering-keyed index; cost grows with fact history.
- (b) Verdict: sound as written. R-01, P2, parked: no same-key replay after a decline and no applied-transition retry
  test.
- (a)+(c) Verdict: sound with the fixes. R-01, P1: an item held in assessment A1 and carried into later assessments
  (head moved on, binding still supported) can never be approved, since A1's target is not the head. **Max (13 Oct 2026,
  D-15): parked as P2** (dead end for a carried held item; hold and continue-current stay possible). R-02, P2, parked:
  the test proves the refusal, not the recovery.
- Worker note, P2, parked: an approval when the item's target already equals the application's tuple opens a no-op
  transition.

## Checks

`npm run check` at `05d7b46` (detached checkout): typecheck and lint clean; 2603 of 2603 tests pass. At `da20fd7`
(b): 2604 of 2604. At `10916cc` (a)+(c): 2606 of 2606. At `3a81652` (follow-up, after the amend): typecheck and lint clean; 2613 of 2614 tests pass; the one failure is the known timing test `test/intake/source-structural.test.ts:51` under load (alone 2 of 2). `test/static` 76 of 76.
