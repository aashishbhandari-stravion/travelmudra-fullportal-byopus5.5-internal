# Prompt: Core task lane (`core-reads-2026-10-12`): Core defect fixes and Kind 1 read models

Written by the Principal Technical Architect (parent chat) on 12 October 2026. Launch condition: Max's
confirmation to the orchestrator of the decision reported from the UI lane chat ("P-04, P-06 and the P-10
batch: approved for working on all 3, picked up together"). Max opens a new Claude chat (Opus 5.5) in the lane
with this prompt.

## 1. Role and team

You are the Principal Technical Architect of this lane. Same team shape as the other lanes: Principal
Software Engineer(s) for implementation with failing tests first, a Principal UX Engineer who checks that every
new read-model fact is one the pages can show truthfully (UI-PLAN D7, §1.3), a Principal Product Manager for
acceptance against the UX specification and the proposals, and an independent reviewer of another model
family who ranks findings P0/P1/P2 with a concrete scenario. Reviewer never implementer. One writer per tree.

## 2. Mission

Design and build, as one coherent change set, the Core-side items that the UI revamp lane found and Max
approved together so that "holistically the design and code is done":

| Item | Kind | Source (UI lane `output/proposals/`, read only) |
|---|---|---|
| P-04 sign-in code request: normalize the address on the replay path as on the first call (BS B35) | Defect, Core binding | `P-04-signin-replay-normalization.md` |
| P-06 (1) initial launch and scope expansion check the reviewed offering revision or head identity; (2) a replayed launch-plan form yields the identical command input after a head change (BS B07, B35) | Defects, guards and a binding | `P-06-launch-guards-and-plan-replay.md` |
| P-10 (a) batch assignment result per item with application id and operator id | Kind 1 | `P-10-wp06-core-requests.md` |
| P-10 (b) `core.operation` answer with `commandName` and `acceptedAt` (was P-02) | Kind 1 | `P-10-wp06-core-requests.md`, `P-02-operation-command-and-time.md` |
| P-10 (d) reassignment preview read: every duty Core transfers | Kind 1 | `P-10-wp06-core-requests.md` |
| P-10 (e) action-specific Gate 1 context (first work, reassignment) | Kind 1 | `P-10-wp06-core-requests.md` |
| P-12 option C: a SuperAdmin queue `first_work_gate1` derived from recorded facts (display only; shares the helper of (e)) | Kind 1 as narrowed | `P-12-assistance-first-work-exception-route.md` §11, review `research/reviews/P-11-12-review.md` |
| P-10 (g) a payment correction that changes only `eventAt` is refused `correction_no_change` | Defect, payments | `P-10-wp06-core-requests.md` |
| P-14 (1) as amended after the WP-07 review: the projection MUST return the recorded basis per gate and act, not a computed verdict: (a) payment recorded as received, with the entry; (b) an exception (which, scope, until when, used or not); (c) a prior commitment of the same attempt; (d) the recorded first-work basis after work started; with the read time. Reason: `controls.ts:670-687` answers `passed` both for previously authorized work and for a prior commitment of the same attempt, neither establishes payment receipt, and `offers.startWork` is null after work starts, so a label built on `passed` would be untrue. Kind 1 only if it exposes recorded facts with their source scope; extension of P-10 (e) | Kind 1 | `P-14-wp07-gate-basis-and-gate2-read.md` (amended) |
| P-14 (2) suspected defect: `pay.application_payments.gate2` evaluates the operator's authorize action with the SuperAdmin as actor; failing test first, close as not a defect if it passes | Defect (suspected) | `P-14-wp07-gate-basis-and-gate2-read.md` |
| P-17 (2) the `possibly_filed` mark's flags (STOP-W11-01); the exhausted act's future owner, decider, reason and time (STOP-W11-02): join removals | Kind 1 | `P-17-wp11-reconciliation-marks-corrections.md` |
| P-17 (3) `core.apply_held_correction` on the staff allowlist (Core's pending answer names staff; the binding exists); the BFF route is the UI lane's | Wiring | `P-17-wp11-reconciliation-marks-corrections.md` |
| P-18 (3) Core accepts more than 50 originals or links while the case-work wire encodes at most 50; recommendation: refuse the 51st with a reason (a cap over a guarantee); failing test first | Defect | `P-18-wp12-originals.md` |
| P-18 (4) an originals register read for operators (UX §5.2) | Kind 1 | `P-18-wp12-originals.md` |
| P-20 (2) incident rows carry the stored owner, not the current duty holder (`incidentDutyHolders` not applied to the read); after an assignment ends the incident leaves every attention view and count; failing test first | Defect | `P-20-wp14-incidents.md` |
| P-20 (3) required-item and notice lists on the incident read capped at 20 while the command accepts more; serve the accepted bounds (or paginate) | Defect, contract | `P-20-wp14-incidents.md` |
| P-19 (3) the current impact items of an offering across assessments (applicant, TA, transition state, decision facts); the launch-control effect for each existing action on the TA's case read | Kind 1 | `P-19-wp13-offering-change.md` |
| P-19 (4) a declined transition appears in no count or state and the application stays blocked with no owner; approving again after a decline reports success and opens nothing (fix by refusing); the transition target is the head at command time with no reviewed head (P-06 class; test first); Core's pending answer ignores suspension and withdrawal holds (held work shown as actionable and counted); failing tests first | Defects | `P-19-wp13-offering-change.md` |
| WP-15 note: a support-view session of an accounting-grant holder omits the accounting surface (`sessions.ts`; `accounts.surface_read` has no support-view flag), so the support view does not match the person's read scope (V22); failing test first; read-only, downloads excluded | Defect, identity | UI lane record `WP-15.md` (internal 145203b) |
| P-21 (1) P0: a travel-date edit accepts past dates while create refuses them (`commands/groups.ts`); refuse on edit as on create with a field error; failing test first; classified a defect (inconsistent validation), not Kind 2 | Defect, P0 | `P-21-wp17-timing-withdrawal.md` |
| P-21 (3a) `core.propose_price_increase` lacks `correctionId` in its contract and binding, so a scope-change increase is always refused; surface repair | Wiring | `P-21-wp17-timing-withdrawal.md` |
| WP-02 F-01: a values publication from a preview made before a new TA draft was accepted records 1 affected draft while 2 existed; the staleness check ignores changes to existing work; failing test first | Defect, catalogue | UI lane record `WP-02.md` §6.1 (internal f8468c8) |
| P-15 (1) Kind 2, Max's direction A (register OD-X4): a Core blocker `dependency_not_linked` on readiness and authorization while a declared relation has no live link. Build ONLY from the UI lane's Kind 2 proposal with the six answers and its independent review; the direction is not a design approval | Kind 2, P0 | `P-15-wp10-dependency-provider-packet.md`; the Kind 2 proposal when written |
| P-17 (1) Kind 2, direction A (OD-X5): the `possibly_filed` mark resolves only after the lost facts are recorded again with evidence. Same condition: proposal plus review first | Kind 2, P0 | `P-17-wp11-reconciliation-marks-corrections.md`; the Kind 2 proposal when written |
| P-17 (4) Kind 2 (OD-X6): a notice to the TA on an outcome correction, with the history line as a separate point; the notice count for a correction of N applications MUST be bounded (Max: no bombardment). Proposal plus review first | Kind 2, P1 | same; the Kind 2 proposal when written |
| P-18 (1) Kind 2 (OD-X7), P0 before production: passport-identity guard on sharing an original; SuperAdmin correction decision with evidence (unlink, void a wrong receipt, remove a part that never arrives, re-receipt). Placement: in this task if the proposal's effort estimate is not large, else the first item after this run (the orchestrator decides on the estimate). Blast radius MUST stay inside the physical-originals service type; the tests MUST show other service types unchanged. Max tests it by simulation | Kind 2, P0 (pre-production) | `P-18-wp12-originals.md`; the Kind 2 proposal when written |
| P-21 (2) Kind 2 (OD-X9): Core refuses `core.propose_price_increase` (any cause) on an application with a recorded payment, with a reason the pages can name; a test confirms that applications created after a catalogue price change are quoted at the current price. Proposal plus review first. The refund and group-cancellation lever of OD-X9 (c) is NOT in this task | Kind 2, P1 | `P-21-wp17-timing-withdrawal.md` item 2; the Kind 2 proposal when written |
| P-11 (OD-X10, confirmed 13 Oct 2026): a required list of one to five evidence references on every gate exception grant; an attestation alone is accepted; the four review fixes of `P-11-12-review.md` are conditions. The proposal and its one review exist; build from them, no re-review | Kind 2, P1 | `P-11-…` and `research/reviews/P-11-12-review.md` (UI lane) |
| P-13 (1) (OD-X12): the owning TA's current account email on `dlv.delivery_page` for the SuperAdmin ONLY; the operator variant carries no address. Kind 1 with Max's exception; delivery module read | Kind 1, exception | `P-13-wp08-delivery-reads.md` item 1 |
| P-20 (1) Kind 2 (OD-X8, decided 13 Oct 2026, fix before launch): a disclosure incident's correction is met only by an eligible replacement of the incident's file or by a recorded "no replacement owed" decision with business evidence; general evidence no longer counts; closed incidents unchanged; open ones resting on a reference return to "not recorded"; a SuperAdmin may record the decision. Operations case-work module, one additive nullable column. Proposal plus review first; brief SHA-256 c840fac7124f15ab… | Kind 2, P1 pre-launch | `P-20-wp14-incidents.md` item 1, `P-20-1-information-brief.md`; the Kind 2 proposal when written |
| P-13 (8) stored subject and version identifiers in `dlv.selection`; P-13 (9) email attempts newest first with a stated cap: ONLY if Max adds them to the batch (orchestrator tells the lane) | Kind 1; defect | `P-13-wp08-delivery-reads.md` (amended) |

Parked by Max, not worked in this task: notice types and aggregation (NOTE-01).

P2 notes from the UI lane, not worked unless Max assigns them (PRI-20260930-01): an Issued → Refused outcome correction can end an unfiled dependent as `dependency_failed` and the correction back is then refused (check with a failing test first, rank then); `correct_from_evidence` does not validate `fields` against the declaration; `passportType` is missing from its wire contract; the unresolved decision runs no control stage; an "information" notice consumes the account's notice slot so a later deletion request is refused as a duplicate; `artifact_association` incidents can be opened without an artifact and never resolved (failing test first, rank then); open and evidence have no business duplicate guard; `doc.queue` stops at 200 rows; `filed_historical` items have treatment `pending` and inflate open-item counts; the catalogue binding `evidenceOf` carries one evidence row per form; suspend and lift accept a withdrawn offering; the treatment and lift bindings ignore the path offering; `decide_transition` treats `reconciliation_exhausted` as not possibly filed (failing test first, rank then; filing-safety class); a `timing_risk` notice has `ackRequired: false` (the pages follow it; confirm it is intended); `dlv.record_direct_external` and the physical handover lack a business duplicate guard and a lifecycle guard (BS B35; STOP-W10-08); a future direct-external date is accepted (R-14); a reused authenticator code within the same 30 s step gets the combined "did not work" text and counts toward the lock (WP-01 F-02).

Not in this lane: the refund and SuperAdmin group-cancellation lever of OD-X9 (c) (production-readiness phase); P-05 (catalogue
display, UI lane grant); anything the bulk lane owns, including the K2-S1 group files
(`src/modules/core/commands/groups.ts`, `src/modules/core/intake-writers.ts`, the group paths of `facade.ts`
and `api.ts`, `src/contracts/core.ts` group fields). The kernel is off limits.

## 3. Read first

`CLAUDE.md` and `docs/agent-guide.md` in the lane repository; `START-HERE.md` in the lane folder;
`internal/records/design/ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` §3 (the Kind 1 six-point
criterion and the read-model register duty); `SURFACE-INVENTORY-2026-10-10.md` §2 and §4 (the Kind 1 requests
already identified: do not duplicate, extend); `internal/records/design/execution-2026-10-12/SEAM-CONTRACT.md`
(§1 ownership, §3 change rule, §5 request log rows for P-02, P-04, P-06, P-10, P-11, P-12); the proposals and
reviews above; the current module code the module map names (Core, payments, identity binding, instance wiring).
The UX specification is `~/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/TARGET_PRODUCT_UX_SPEC.md`
(read only; §6.3 and §5.3 for the SuperAdmin pages). The focused-fix rule of the agent guide does not apply to
this task as a whole (Max approved the batch); it applies to each item: fix the cause, failing test first, one
class of failure per fix.

## 4. Ownership

`src/modules/core/` except the K2-S1 group files; `src/modules/delivery/` read models for the P-13 (1) item only; `src/modules/identity/` session and surface-read wiring for the WP-15 support-view item only; `src/modules/catalogue/` for the WP-02 F-01 staleness defect only; `src/modules/payments/service-status.ts` and its tests;
`src/core-api/bindings/{core,identity}.ts`, `src/core-api/allowlists.ts` and `src/core-api/server.ts` for the
replay path; `src/contracts/core.ts` additive fields only; `src/modules/operations/` launch guards for P-06 (1);
`test/core/`, `test/payments/`, `test/identity/`, `test/system/` for those paths. No migration is expected; if one
is needed, it is a proposal first. No HTML; the UI lane renders.

## 5. Rules

Kind 1 criterion, all six points, for every projection, with the dated code comment and the read-model register
line (create `docs/verification/read-model-register.md` if absent, one line per projection). Additive changes
within a seam version (SEAM-CONTRACT §3): new fields and new queue kinds only; nothing removed or renamed.
Three instances, API calls only; prove on the lane installation named in `START-HERE.md`; deployments only
through `scripts/uat/uat.py`. Synthetic data only. Commits in the lane branch, public-fit messages, hooks
never bypassed, never push; internal records in the lane's `internal/` clone; attribution line of your runtime.
Standing delegation: a traceability row whose cited test title you change may be updated in the same commit
(row keeps its identifier; statement follows an accepted decision cited in the commit message; static test
green). Writing style ASD-STE100 at about 75% in records.

## 6. Records and handover

`internal/records/design/core-reads-2026-10-12/`: `PLAN.md`, one note per item (`ITEM-nn.md`: failing test,
cause, fix, hostile states, review and dispositions), the register, and `HANDOVER.md` with the seam version
content (fields, queue kinds, commands touched), commits in order, the installation and ref, and open findings
ranked. Report to the orchestrator at each item boundary; the orchestrator records the seam version and tells
the UI lane.

## 7. Stop conditions

A kernel need; a Kind 2 change (a new command or a new behaviour, including anything from P-11); a file of
another owner; a migration; a specification conflict; a `uat.py` failure. Usage-limit pauses: resume after the
pause without asking.
