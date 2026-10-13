# Core task lane `core-reads-2026-10-12`: plan

Owner: the lane's Principal Technical Architect (Opus 5.5 chat). Written 13 October 2026. Authority: register
OD-X13 (batch confirmed with P-13 (8) and (9)), OD-X4 to OD-X15; `execution-2026-10-12/CORE-TASK-PROMPT.md`
§2 and §8 (§8 overrides §1 to §7 where they differ); `SEAM-CONTRACT.md` §1, §3, §5, §6.

## 1. Baseline

| Fact | Value |
|---|---|
| Branch | `core-reads-2026-10-12`, base main `30ee1c1` (bulk seam v2 through 3854c88, UI WP-01 and WP-20 through 42cb373) |
| Installation | `lane-max`: edge 4620, staff 4622, core 4621, processing 4623; units `tm-lane-max-*`; config `~/.local/share/travelmudra-uat/configs/lane-max.json`; running release 102e4c9 until the first lane deploy |
| Deploy | `python3 scripts/uat/uat.py deploy <config> --ref <commit>` from `repo/` only |
| Frozen inputs | Lane folder `research/inputs/` (proposals and reviews copied from the UI lane on 13 Oct 2026); `MANIFEST.sha256` there. The six Kind 2 proposal hashes match the seam log final hashes (63f539a5, 4c64c3c2, 93e7186f, 5621f76f, c7d688ae, 50a0fcf1). |
| Review runner | Lane folder `research/reviews/run-codex-review.sh` (copied from the UI lane; `gpt-6.1-sol`, high, read-only, ephemeral) |

## 2. Rules applied per item

1. Failing test first. The item note records the failing-before output.
2. One commit per item. An item with independent sub-defects MAY have one commit per sub-defect; the note names each.
3. One read-only Codex review per unique item, no re-review (Max's rule). Dispositions in `ITEM-nn.md`.
4. Kind 1 projections meet all six points of DECISIONS-2026-10-10 §3.1, carry a dated code comment and a line in
   `docs/verification/read-model-register.md`.
5. Every Kind 2 item ships `ITEM-nn-WALKTHROUGH.md` for Max (steps on `lane-max`, synthetic accounts, expected
   refusals and resolutions, facts to look for; a simulation script where the scenario needs one, never on real data).
6. Checks per commit: the module's tests, `npm run typecheck`, `npx eslint <changed files>`. `npm run check` when a
   commit touches `src/kernel/`, `src/contracts/`, `src/platform/` or a migration, and at each package boundary.
7. Ownership: prompt §4 plus the §8 Kind 2 grants (the reviewed proposal's ownership section names the files for its
   item only). A file outside that set is a grant request to the orchestrator.
8. No HTML. No push. Public-fit commit messages. Hooks never bypassed.

## 3. Items in order of work (§8)

Status values: `todo`, `wip`, `review`, `done` (committed, reviewed, dispositions recorded), `wait` (part waits for Max).

| Item | Source | Kind, rank | Scope built in this run | Waits for Max (do not build) | Status |
|---|---|---|---|---|---|
| ITEM-01 | P-21 (1) | Defect, P0 | `core.edit_travel_dates` refuses a past start date with the create field error. Grant: orchestrator 13 Oct 2026 (`editTravelDates` in `src/modules/core/commands/groups.ts` only, one commit) | none | done b7d0b0f (was 4b4dc3e) |
| ITEM-02 | P-15 (1), K2-P15-1 | Kind 2, P0 | Blocker `dependency_not_linked` at control stage 10; rule 19a; one reason code; Q2 wire `ref` widening (`src/contracts/errors.ts:56`); tests I1 to I14, V1 to V4, S1 | Q1 `release_packet` part; Q3 confirmation | done 82ea904, 1bec743, 4347d83 |
| ITEM-03 | P-17 (1) Part 1, K2-P17-1 | Kind 2, P0 | Part 1a filing determination at resolution; Part 1b legacy resolutions blocked until an evidenced SuperAdmin disposition; Q-A4, Q-A5, Q-A6 as decided; walk-through with a simulated restore (Max asked for it first) | Part 2 (after the run, OD-X14) | done 6ad592e, e4ffed9 |
| ITEM-33 | OD-X18 and grant P-K1f (orchestrator, 13 Oct 2026; worked after ITEM-03, before ITEM-04) | Owner decision, model change | A draft is created with the surname OR the given names (at least one) plus the date of birth; a one-name applicant carries a non-blocking nudge as a read-model fact on the operator surface (UI-lane file → proposal, fact stays); `applicant_identity_missing` (kernel reason, appended) from `src/domain/module-ports.ts:182` when both name fields or the date of birth are empty; format codes (`:196`) unchanged; tests fail first | UI text of the reason (UI lane, unless the catalogue entry is in a lane-owned file) | done b26d2a5 |
| ITEM-04 | P-18 (1) guard slice, K2-P18-1 | Kind 2, P0 pre-production | `passport_identity_mismatch` on `ops.link_original`; blast radius inside the physical-originals type, tests show other types unchanged | Q1 to Q8, Q10 and everything beyond the guard slice | done 5f5e26b |
| ITEM-05 | P-20 (1), K2-P20-1 | Kind 2, P1 pre-launch | Parts that do not depend on Q-1 to Q-3; Q-4 census, Q-5 release rule | Q-1 (SuperAdmin may record), Q-2 (authority rule), Q-3 (point G) | todo |
| ITEM-06 | P-04 | Defect | Replay path of the sign-in code request normalizes the address as the first call does | none | done b3519e9 (wave 1) |
| ITEM-07 | P-06 (1), (2) | Defects | (1) initial launch and scope expansion check the reviewed head identity; (2) launch-plan form replay yields the identical command input after a head change | none | todo |
| ITEM-08 | P-10 (g) | Defect, payments | A payment correction that changes only `eventAt` is accepted | none | todo |
| ITEM-09 | P-14 (2) | Suspected defect | Failing test first: `pay.application_payments.gate2` with a SuperAdmin actor; close as not a defect if it passes | none | todo |
| ITEM-10 | P-19 (4) | Defects | (a) a declined transition is counted and owned; (b) approving again after a decline is refused; (c) the transition target is the reviewed head, not the head at command time; (d) the pending answer respects suspension and withdrawal holds | none | todo |
| ITEM-11 | P-20 (2) | Defect | Incident rows carry the current duty holder | none | done c9268b0 (wave 1) |
| ITEM-12 | P-20 (3) | Defect, contract | Incident read serves the bounds the command accepts for required items and notices | none | done 06193af (wave 1) |
| ITEM-13 | WP-15 note | Defect, identity | A support-view session of an accounting-grant holder includes the accounting surface, read-only, downloads excluded | none | done 8387ecc (wave 1) |
| ITEM-14 | WP-02 F-01 | Defect, catalogue | The values-publication staleness check sees changes to existing work | none | todo |
| ITEM-15 | P-18 (3) | Defect | The 51st original or link is refused with a reason (a cap over a guarantee) | none | todo |
| ITEM-16 | P-10 (a) | Kind 1 | Batch assignment result per item with application id and operator id | none | todo |
| ITEM-17 | P-10 (b) | Kind 1 | `core.operation` answer with `commandName` and `acceptedAt` | none | todo |
| ITEM-18 | P-10 (d) | Kind 1 | Reassignment preview: every duty Core transfers | none | todo |
| ITEM-19 | P-10 (e) | Kind 1 | Action-specific Gate 1 context (first work, reassignment) | none | todo |
| ITEM-20 | P-12 option C | Kind 1 as narrowed | SuperAdmin queue `first_work_gate1`, display only, shares the helper of ITEM-19 | none | todo |
| ITEM-21 | P-14 (1) as amended | Kind 1 | Recorded basis per gate and act (payment entry, exception, prior commitment, recorded first-work basis) with the read time; never a computed `passed` | none | todo |
| ITEM-22 | P-17 (2) | Kind 1 | `possibly_filed` mark flags; exhausted act's future owner, decider, reason, time (join removals) | none | todo |
| ITEM-23 | P-17 (3) | Wiring | `core.apply_held_correction` on the staff allowlist (the BFF route is the UI lane's) | none | todo |
| ITEM-24 | P-18 (4) | Kind 1 | Originals register read for operators (UX §5.2) | none | todo |
| ITEM-25 | P-19 (3) | Kind 1 | Current impact items of an offering across assessments; launch-control effect per existing action on the TA's case read | none | todo |
| ITEM-26 | P-13 (1) | Kind 1, exception OD-X12 | Owning TA's current account email on `dlv.delivery_page`, SuperAdmin variant only | none | done 7ad52b2 (wave 1) |
| ITEM-27 | P-13 (8) | Kind 1 | Stored subject and version identifiers in `dlv.selection` | none | done 144f18a (wave 1) |
| ITEM-28 | P-13 (9) | Defect | Email attempts newest first with a stated cap | none | done 5af3128 (wave 1) |
| ITEM-29 | P-21 (3a) | Wiring | `correctionId` on `core.propose_price_increase` contract and binding | Built only after K2-P21-2 Q2 (scope authority) is recorded | wait |
| ITEM-30 | P-17 (4) N, K2-P17-4 | Kind 2, P1 | The notice N with the 1 + P bound and dedupe on the committed operation id | H history line (Q-N3); Q-N2, Q-N4 | todo |
| ITEM-31 | P-21 (2), K2-P21-2 option A | Kind 2, P1 | Refusal of `core.propose_price_increase` on a paid application (current `payment_received`, Q4); end of an open increase in the payment entry's transaction; `accept` refused; `decline` allowed; test that new applications quote the current price; reason code (authorized kernel vocabulary) | §3.6 release disposition (Q1); SC-1 scope authority (Q2); B16 (Q3); ownership spread beyond Core and Payments until the grant line after Q1 | todo |
| ITEM-32 | P-11, OD-X10 | Kind 2, P1 | Required list of one to five evidence references on every gate exception grant; attestation alone accepted; the four review fixes of `P-11-12-review.md` as conditions; built from the proposal and its one review, no re-review | none | todo |

Not in this run: P-17 (1) Part 2; the refund and group-cancellation lever of OD-X9 (c); notice types and
aggregation (NOTE-01); the P2 notes of prompt §2 (K2-P15-1 N1 to N5 and the UI lane notes), unless Max assigns them.

## 4. Ownership risks found at planning

| Item | Risk | Action |
|---|---|---|
| ITEM-01 | `groups.ts` is a K2-S1 file (bulk lane grant) | Grant received 13 Oct 2026, `editTravelDates` only, one commit |
| ITEM-08 | The payment correction command is in `src/modules/payments/`; prompt §4 lists only `service-status.ts` | Check the file at the item; grant request if it is outside §4 |
| ITEM-09 | `pay.application_payments` is in `src/modules/payments/queries.ts` | Same |
| ITEM-26 to ITEM-28 | Delivery module: §4 grants read models for P-13 (1); (8) and (9) were added by OD-X13 | Treat the OD-X13 addition as the grant for the `dlv.selection` and email-attempt reads only; confirm with the orchestrator at the item if a command file is needed |

## 5. Team

- Architect (this chat): design per item, integration, verification, records, deploys, messages.
- Engineers: subagents of this chat, one writer in the tree at a time; they work one item from a written brief.
- Read-only helpers MAY run while an engineer writes: exploration of the next item, Codex review of a committed item.
- Independent reviewer: Codex `gpt-6.1-sol` high, read-only, one review per unique item.
- Advisor: a fresh Fable 5.1 subagent at high effort per question inside a decided direction
  (`research/questions/`). Both positions logged in §6 below.

## 6. Decision log for Max's end review

| ID | Date | Question | Positions | Taken |
|---|---|---|---|---|
| D-01 | 13 Oct 2026 | ITEM-01: the orchestrator's grant named the method "replace with `checkDates`"; the review (R-01) showed it refuses a return-only edit during a trip, which lets open applications end at the old return date | Literal method vs. create rules for the dates the TA sets, an unchanged passed start allowed, return today or later | Architect: the second, in the same function and commit; reported to the orchestrator at the package boundary. **Max ratified the second, 13 Oct 2026.** |
| D-02 | 13 Oct 2026 | ITEM-02: Q1 (`release_packet`) is open; does a relation that conditions only the release block readiness? | Proposal's enforced set (includes the release) vs. the set without the release | Architect: without the release, as an action and as applicability (`NOT_LINKED_ENFORCED`); Q1 later is a one-line change; orchestrator informed 13 Oct. **Max approved Q1, 13 Oct 2026: the release is enforced** (second ITEM-02 commit with test I13) |
| D-03 | 13 Oct 2026 | ITEM-02 Q3: a dependent whose upstream result exists only outside TravelMudra cannot proceed (no evidence-only upstream is declarable) | Confirm the parked B44 boundary vs. build an evidence-only upstream now | **Max: confirmed parked for UAT; decide before a real dependent offering launches** |
| D-04 | 13 Oct 2026 | ITEM-03 walk-through simulation: a restore mark exists only inside a restore closure | (A) test transcript; (B) `uat.py` checkpoint and restore-drill on `lane-max` now; (C) A now, B later | **Max: C.** The transcript ships with ITEM-03; the drill is a later item after the Core package is integrated and the UI lane renders the `filing` field of the resolution form |
| D-05 | 13 Oct 2026 | ITEM-03 review P1 findings: R-01 (the pending answer names the operator while a legacy mark holds the authorizations) and R-02 (case S6 not built) | R-01: fix now vs. park. R-02: an automated S6 test now, the restore drill later, or both | **Max: work both (13 Oct 2026). R-01 fixed in `e4ffed9`. R-02: the restore drill (Max's choice among the three), as a step of the D-04 drill item** |
| D-06 | 13 Oct 2026 | ITEM-04: the grant's condition "the refusal playbook row in the same commit" | Add a custody-command row to the playbook vs. no row | Architect: no row. The condition came from the architect's own grant request by mistake; the playbook covers `tm` procedure and instance-start refusals only, and no product command refusal has a row. Reported to the orchestrator in the package message |
| D-07 | 13 Oct 2026 | ITEM-33 review P1 findings R-01 to R-03, all in files outside the lane (UI-lane forms and handlers; the documents module's manual passport-zone resolution) | Have the owning lanes fix them vs. park | **WITH MAX**, in the package message. Recommended: R-01 and R-02 to the UI lane; R-03 parked as P2 unless one-name passports with an empty primary identifier are known in the market (ICAO 9303 puts a single name in the primary identifier) |
| D-08 | 13 Oct 2026 | Method after the P0 package: sequential items in one tree, or parallel workers | Sequential (prompt §8 order) vs. waves of grouped items in parallel worktrees | **Max (13 Oct 2026): (1) one git worktree per worker, at most three at once; (2) items grouped by code area, still one commit and one Codex review per item; (3) Opus for Kind 2 items, Sonnet for defects and reads; (4) the waves replace the §8 order (the orchestrator is told in the package message); (5) worker cap 100k per turn, partial return before 275k.** Each brief carries a file:line survey from a read-only survey agent; test output is filtered; a fresh worker with an addendum replaces a continued one |
| D-09 | 13 Oct 2026 | ITEM-26: P-13 (1) asks for the TA's address in display form; the delivery identity port returns only the normalized (lower-case) form | Normalized now vs. an additive identity field for the display form | **Orchestrator (wave 1 grant, 13 Oct 2026): normalized now, no identity change; a deviation from P-13 (1); Max may ask for the display form later.** Reported in the package message |
| D-10 | 13 Oct 2026 | ITEM-26: a required `taAccountEmail` on the wire breaks two page literals outside the grant (`test/unit/web/delivery-words.test.ts:39`, `test/unit/web/packet-handover.test.ts:126`) | Required field with a grant for the two lines vs. `nullable().optional()` now | Architect: optional now; Core always sends the field. To make it required: grant the two lines and drop `.optional()`. Reported in the wave 1 package message |
| D-11 | 13 Oct 2026 | Wave 1 review P1 findings: ITEM-12 R-01 (the SuperAdmin incident queue can exceed the 4 MiB answer cap at 500 maximum rows), ITEM-12 R-02 (incident evidence has no total limit; the read shows 100, existed before), ITEM-28 R-01 (the wrong-recipient form's email choices come from the 100-send page window) | Work each now vs. park | **Max (13 Oct 2026): all three parked as P2.** Proposed fixes recorded in ITEM-12.md and ITEM-28.md for a later revisit |

## 7. Commits in order

| Item | Commit | Checks | Review | Deployed on `lane-max` |
|---|---|---|---|---|
| ITEM-01 | b7d0b0f (was 4b4dc3e) | groups-drafts, travel-date-rules, documents-association 43/43; views case-projections 17/17; typecheck; eslint | Codex: sound with fixes; R-01 fixed | yes, 5f5e26b (13 Oct 2026, release rel_3V7Y97Q9W6KSH45CRGTGPTWN98) |
| ITEM-02 | 82ea904 (was 100227f), 1bec743 (was 88a1174), test 4347d83 (was e41d64f) | npm run check 2488/2488 at 100227f; affected 110/110 at 88a1174; work-acts 12/12 | Codex: sound with fixes; R-01 worked (test commit); R-02 P2 parked | yes, 5f5e26b (13 Oct 2026, release rel_3V7Y97Q9W6KSH45CRGTGPTWN98) |
| ITEM-03 | 6ad592e (was d2067af); review fix e4ffed9 | npm run check 2541/2541; e4ffed9: affected 36/36, package check below | Codex: sound with fixes; R-01 fixed (e4ffed9, Max); R-02 restore drill (Max); R-03 P2 parked | yes, 5f5e26b (13 Oct 2026, release rel_3V7Y97Q9W6KSH45CRGTGPTWN98) |
| ITEM-33 | b26d2a5 | npm run check 2562/2562 | Codex: sound with fixes; R-01 to R-03 P1 with Max (outside the lane, D-07); R-04, R-05 P2 parked | yes, 5f5e26b (13 Oct 2026, release rel_3V7Y97Q9W6KSH45CRGTGPTWN98) |
| ITEM-04 | 5f5e26b | npm run check 2567/2567 (package check of ITEM-01 to ITEM-04 and ITEM-33) | Codex: sound as written; R-01 P2 parked | yes, 5f5e26b (13 Oct 2026, release rel_3V7Y97Q9W6KSH45CRGTGPTWN98) |
| ITEM-06 | b3519e9 (from 510718a) | npm run check 2568/2568 | Codex: sound as written; R-01 P2 parked | yes, 7ad52b2 (13 Oct 2026, release rel_18DYBZTC43TKH1929G6R9837FC) |
| ITEM-13 | 8387ecc (from 64a9ce0, amended) | npm run check 2568/2569 (intake timing test under load); rerun alone 2/2 | Codex: sound as written; R-01 P2 parked | yes, 7ad52b2 (13 Oct 2026, release rel_18DYBZTC43TKH1929G6R9837FC) |
| ITEM-11 | c9268b0 (from 35df76c) | npm run check 2571/2573 (two timing tests under load); rerun alone 6/6 | Codex: sound as written; R-01 (UI lane), R-02 P2 parked | yes, 7ad52b2 (13 Oct 2026, release rel_18DYBZTC43TKH1929G6R9837FC) |
| ITEM-12 | 06193af (from 4013706) | npm run check 2575/2577 (two timing tests under load); rerun alone 10/10 | Codex: sound with fixes; R-01, R-02 P1 parked as P2 by Max (D-11); R-03, R-04 P2 parked | yes, 7ad52b2 (13 Oct 2026, release rel_18DYBZTC43TKH1929G6R9837FC) |
| ITEM-28 | 5af3128 (from 7dff0b2) | npm run check 2577/2578 (one timing test under load); rerun alone 4/4 | Codex: sound with fixes; R-01 P1 parked as P2 by Max (D-11); R-02 P2 parked | yes, 7ad52b2 (13 Oct 2026, release rel_18DYBZTC43TKH1929G6R9837FC) |
| ITEM-27 | 144f18a (from fdc485b) | npm run check 2576/2579 (timing test; port collision between parallel runs); rerun alone 7/7 | Codex: sound as written; no findings | yes, 7ad52b2 (13 Oct 2026, release rel_18DYBZTC43TKH1929G6R9837FC) |
| ITEM-26 | 7ad52b2 (from aef35ad) | npm run check 2579/2581 (two timing tests under load); rerun alone 6/6; quiet npm run check at 7ad52b2 2581/2581 | Codex: sound as written; R-01 P2 parked; D-09, D-10 | yes, 7ad52b2 (13 Oct 2026, release rel_18DYBZTC43TKH1929G6R9837FC) |

Commit ids changed on 13 Oct 2026: the body of the ITEM-01 commit named an internal identifier ("seam log row"), so it was
reworded by a non-interactive rebase from `30ee1c1` before any report. The trees are identical (checked: the head tree
before and after is the same). Old to new: 4b4dc3e → b7d0b0f, 100227f → 82ea904, 88a1174 → 1bec743, e41d64f → 4347d83,
d2067af → 6ad592e. Reviews, evidence and item records written before the rebase cite the old ids; the old ids stay
readable in the lane clone's reflog until it is pruned.
