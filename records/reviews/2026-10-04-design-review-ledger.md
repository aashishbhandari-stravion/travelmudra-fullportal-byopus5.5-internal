# Design review ledger — 2026-10-04

Owner: orchestrator (design consolidation). Date: 2026-10-04. Scope: the five independent review lenses over design records 01 and 11–15. Authority: `internal/records/BUILD_SPEC.md` (B01–B47). Ranking rule: P0 blocks the main path or risks irreversible harm and is worked now; P1 goes to the product owner (parked or worked on decision) unless it is a demonstrable spec violation, which is treated as P0; P2 is a parked note.

Lenses: **coverage** (spec clause coverage, COV), **money/state** (money, state and atomicity correctness, MON), **security** (access, disclosure, privacy, SEC), **recovery** (task protocol, backup/restore, capacity, operability, REC), **boundary/environment** (deliberate boundaries, integration seams, host probes, BND).

## Summary

- Findings: 92 (original priority: P0 18, P1 46, P2 28; final: P0 32, P1 32, P2 28).
- Dispositions: fixed 46; partly fixed with the rest recorded for the owner 3; recorded for the owner 22; parked notes 21; rejected outright 0 (one finding part rejected: BND-04 (d)).
- P1 upgraded to P0 as demonstrable spec violations (14): COV-06, COV-07, COV-11, COV-12, MON-05, MON-06, MON-09, SEC-02, SEC-05, REC-13, REC-17, REC-20, BND-04, BND-05.
- Every original P0 was verified against the spec text and found valid; the spec basis is quoted in its row.
- All 87 module change requests are decided in contract 01 §15.2: 83 accepted (15 with edits; 11 CCR-17 and 12 CCR-02 without one code each; 15 CCR-15-13 without `consumeGateException`), 4 not accepted (11 CCR-12, 11 CCR-14 and 14 CCR-08 rejected; 11 CCR-16 not accepted in this build).
- Owner decisions and recorded P1 items: `internal/records/design/02-owner-decision-register.md`.

## Findings

| ID | Lens | Priority (original → final) | Issue | Disposition | Where fixed / reason |
|---|---|---|---|---|---|
| COV-01 | coverage | P0 → P0 | Two incompatible `decl/1` schemas (record 12 vs readers in 13/14/15) | fixed | Valid (B05 "unresolved required declaration … blocks dependent use"; a reader of a key the parser never produces blocks every main path). One normative schema: 01 §9.2 (keys, classes, mode rules, gates, dependent actions, item status); shared parser `src/kernel/vocabulary/decl.ts`; 12 §2.1–2.2 replaced by pointer; 12 §2.6 passport validity moved to Documents; 12 §6.1 synthetic return-policy and fee-timing offerings; 13 CCR-16 accepted with edits; tests T-F36, T-C60 |
| COV-02 | coverage | P0 → P0 | Three definitions of the exposure logical effect key | fixed | Valid (B28 "reserve … once per logical effect"). 01 §1.1 key `govfee:<app>:<attempt ordinal>`, §1.3 constructor, §3.5 `attempt_ordinal`/`carries_fee`, §8.5 Gate 2 basis, §8.6 step 0; 13 §2.1, CMD-X1; 15 §2.1, Algorithm R step 1; tests T-F18, T-CO72 |
| COV-03 | coverage | P0 → P0 | Packet build and release owned by both Core and Delivery | fixed | Valid (B34 "Core owns … control acceptance … action authorization"; B18 readiness before packet release). Core `core.release_packet` + `core_packet_releases` is the only release acceptance; Delivery keeps build task, bytes, state (`markPacketReleased`) and handovers; `dlv.build_packet`/`dlv.release_packet` removed. 01 §3.5, §3.10, §6.4, §6.9, §6.11, §11, §12.1; 13 §3.10; 15 C-D4/C-D5; 11 O25/O26 |
| COV-04 | coverage | P1 → P1 | Gate 1 evaluated only at assignment | recorded for owner | Business/money semantics of B26 "current `payment_received` … before assignment/operator work": owner decision OD-R2-02 (register 02 §A); interim = assignment basis + financial exception |
| COV-05 | coverage | P1 → P1 | `payment_received` accepted with attestation-only evidence | recorded for owner | What counts as payment evidence (B26) and what closes a follow-up (B29) is owner decision OD-R2-03 (extends OD-15-01); interim = record 15 C-P1 as written |
| COV-06 | coverage | P1 → P0 | Draft creation refused unknown population values | fixed | Upgraded: demonstrable B14 violation ("A row may yield several drafts with missing requirements if applicant/group/service are unambiguous"). Record 14 CCR-07 accepted: 01 §8.2–8.3; 13 §2.1; test T-CO74 |
| COV-07 | coverage | P1 → P0 | Preparation-only withdrawal contradiction (I-C2) | fixed | Same defect as BND-03 (upgraded). Fixed with BND-03 |
| COV-08 | coverage | P1 → P1 | Cross-group/country dependency scope contradictory | recorded for owner | Interim applied as part of the COV-01 schema: same-group upstream only (01 §3.5, §9.2; 13 CMD-D5, I-C10). Whether a cross-group relationship may condition an outcome (B03 vs B22) is owner decision OD-R2-06 |
| COV-09 | coverage | P1 → P1 | Core writers needed by Catalogue recheck missing | fixed | Fixed by CCR reconciliation (record 12 CCR-07 accepted with edit): `recordContinuation`, `openStructuralTransition`, `proposePriceIncrease`, `openApplicationsForOffering` with the quoted-price invariant (B17). 01 §6.4; 13 §3.20; test T-CO75 |
| COV-10 | coverage | P1 → P1 | No effort capture for B32 | fixed | Fixed by CCR reconciliation (record 15 CCR-15-15 accepted): `ops_effort_samples`, `ops.record_effort_sample`, fact `ops.effort_sample_recorded`. 01 §1.2, §3.8, §5.2; 13 CMD-EF1; 15 T-15-53 |
| COV-11 | coverage | P1 → P0 | Engineering release could settle other-mode fee policy | fixed | Upgraded: demonstrable B43 violation ("Do not settle … other-mode fees … by engineering default"). Owner-gated (G) items: 01 §9.2, `cat_owner_approvals` scope; 12 §2.1, C5, §6; tests T-F47, T-C61 |
| COV-12 | coverage | P1 → P0 | New actor/authority shape not gated by an owner decision | fixed | Upgraded: demonstrable B05 violation ("a new actor/authority shape needs the product owner's separate decision"). Closed `DECL_ACTORS`/`AUTHORITY_KINDS` + shape rule: 01 §9.2; 12 §2.1, E1; test T-C62 |
| COV-13 | coverage | P1 → P1 | ~100 CCRs unintegrated; nine conflicting pairs | fixed | Step 2 of this consolidation: every CCR accepted or rejected (01 §15.2); the nine pairs decided (01 §15.3); module CCR sections carry dispositions |
| COV-14 | coverage | P1 → P1 | Route inventory and action names disagree across records | partly fixed; rest recorded for owner | Fixed: individual entry only through `intake.start_individual` (B14), actions of O25/O26/O34/O40 aligned (01 §12.1 route registry rule; 11 §4.4; 13 §4.1). Remaining path-name differences recorded (register 02 §C) |
| COV-15 | coverage | P1 → P1 | Re-entered facts after interval loss not marked retrospective | recorded for owner | Engineering gap recorded for the owner (register 02 §C); B33/B40 |
| COV-16 | coverage | P2 → P2 | `ta_action_needed` derived before `draft` | parked note | Parked note |
| COV-17 | coverage | P2 → P2 | `openAdmission` does not require a capacity record | parked note | Parked note |
| COV-18 | coverage | P2 → P2 | Direct external delivery record lacks recipient/version | parked note | Parked note |
| COV-19 | coverage | P2 → P2 | Hand-written TOTP replaces pinned `otpauth` without an override | fixed | Resolved by decision: record 11 CCR-14 rejected; `otpauth` stays runtime (EO-02 owner direction); no override needed. 01 C-10; 11 X-02, T-U16 |
| MON-01 | money/state | P0 → P0 | Fee-carrying act undefined (`with_submission`); fee act without declared fee | fixed | Valid (B27 TM pays and recovers the exact amount; B28 reserve before commitment). `core.feeCarryingAct`, `carries_fee`, `fee_act_not_declared`, fee writers for the fee-carrying act of any kind: 01 §3.5, §6.4, §6.11, §7.4, §8.3, §11; 13 CMD-X1/X2; 15 §3.1.8; 12 §6.1 synthetic offering; tests T-F43, T-CO71, T-15-81 |
| MON-02 | money/state | P0 → P0 | Logical effect key conflict (double reservation or blocked path) | fixed | Same class as COV-02; fixed there |
| MON-03 | money/state | P0 → P0 | Gate 2 skipped (`same_attempt`) after a not-filed first act | fixed | Valid (B27 "Before TM pays a government fee or operator submits to government, whichever first, recheck … current payment"). Predicate "a commitment may have happened": 01 §2.11, §8.3, §8.5, I-17; 13 CMD-X1, CMD-GX1, T-CO21; test T-F44 |
| MON-04 | money/state | P0 → P0 | Re-keying into a closed scope bypasses later-attempt and no-refiling rules | fixed | Valid (B03 later attempt needs completed prior work + fresh intake; B23 "never grants safe refiling"). Single writer `setApplicantKey`: 01 §3.5, §6.4, §11; 13 §3.2.2, CMD-D3, CMD-A3; tests T-F45, T-CO04 |
| MON-05 | money/state | P1 → P0 | Concurrent same-key duplicate answers `conflict_duplicate` | fixed | Upgraded: demonstrable B35 violation ("Same key/content resolves the accepted result"). Runner extra attempt on guard violation: 01 §4.2 step 5, §4.4, §11; T-F12 |
| MON-06 | money/state | P1 → P0 | Outcome correction leaves dependency states stale | fixed | Upgraded: demonstrable B22 gap (incompatible final upstream outcome must fail a confirmed-unfiled dependent). 01 §7.1; 13 §3.11.3, CMD-SA1; T-CO39 |
| MON-07 | money/state | P1 → P1 | Exposure ceiling per person account, not per TravelAgent | recorded for owner | Owner decision OD-R2-01 (B28 "TA-wide" vs B08 "one person"); interim I-09 |
| MON-08 | money/state | P1 → P1 | Gate 1 timing (assignment vs each work start) | recorded for owner | Owner decision OD-R2-02 (same as COV-04, BND-07) |
| MON-09 | money/state | P1 → P0 | Completion before group end for unpaid unworked application | fixed | Upgraded: demonstrable B25 violation ("stays open … until its group's travel return date passes"). E7: 01 §7.1; 13 §2.3.4, CMD-C1; T-CO46 |
| MON-10 | money/state | P1 → P1 | Same person with mistyped/renewed passport number gets a second open application | recorded for owner | Recorded P1 (register 02 §C): detection rule is an identity-matching policy (B15) |
| MON-11 | money/state | P1 → P1 | Final price depends on commit order of reduction vs increase decision | recorded for owner | Recorded P1 (register 02 §C) |
| MON-12 | money/state | P2 → P2 | Recheck re-proposes a declined mistaken-price increase | parked note | Parked note |
| MON-13 | money/state | P2 → P2 | Price reduction while filing unknown: applied or held? | parked note | Parked note |
| SEC-01 | security | P0 → P0 | Artifact release could never pass (wrong association owner) | fixed | Valid (B12 "positive application/type association" before each send; B13 artifact association is Operations'). Release check per subject kind: 01 §2.15, §3.7, §5.1 relations, §6.9; 15 §3.2.0; tests T-F46, T-15-80 |
| SEC-02 | security | P1 → P0 | No authorized byte path for the B13 secondary review | fixed | Upgraded: B13 "scoped secondary review" cannot be performed. `staff_review` channel + `document.retrieve_for_review`: 01 §2.18, §5.2–5.3, §6.9, §12.5; 13 §3.15; 15 C-D1b; T-F46 |
| SEC-03 | security | P1 → P1 | Unrestricted SuperAdmin download of applicant documents | recorded for owner | Privacy owner decision OD-R2-04; interim = current rule table, every release recorded |
| SEC-04 | security | P1 → P1 | Staff OTP contact limiter can be exhausted by an attacker | recorded for owner | Recorded P1 (register 02 §C) |
| SEC-05 | security | P1 → P0 | Plaintext checkpoint dumps and backup intermediates at rest | fixed | Upgraded: B40 "Encrypt and restrict backup/key custody". Stream encryption + checkpoint disposal: 01 §3.2; 15 §3.4.2 steps 3 and 8, §3.4.3, §3.5.1; T-F50 |
| SEC-06 | security | P2 → P2 | Release step admitted `safety_passed` | fixed | Resolved by accepting record 14 CCR-02 (needed for COV-13 pair 4): 01 §6.9 step 5; 15 §3.2.0 |
| SEC-07 | security | P2 → P2 | Email-change uniqueness disclosure to mailbox controller | parked note | Parked note |
| SEC-08 | security | P2 → P2 | IPv6 deny list gaps | parked note | Parked note |
| SEC-09 | security | P2 → P2 | `ops_originals.item_key` HMAC key unnamed | fixed | Fixed with REC-20 (plain applicant key in the owner table; never in diagnostics) |
| SEC-10 | security | P2 → P2 | One SuperAdmin can create and use an operator account | parked note | Parked note; owner awareness item OD-R2-08 (register 02 §A) |
| SEC-11 | security | P2 → P2 | Deletion-request notice to non-owning TA carries application id | parked note | Parked note |
| SEC-12 | security | P2 → P2 | Synthetic seams lack enforcement/labels | parked note | Parked note (manifest refusal of `provider.synthetic` outside test/local_test arrived with 12 CCR-10; label rule noted in 01 §10.6) |
| SEC-13 | security | P2 → P2 | Operator metadata predicate too wide; route action mismatches | parked note | Route actions aligned with COV-14 (O34, O40); operator metadata predicate parked |
| SEC-14 | security | P2 → P2 | No seccomp filter for workers | parked note | Parked note |
| REC-01 | recovery | P0 → P0 | Referenced staging blobs missing from backups | fixed | Valid (B40 "every referenced canonical and still-referenced quarantine blob byte"; incomplete capture must not replace last good). Inventory by owner reference in any area: 15 §3.5.1 step 5, §3.5.2 step 5; T-F40, T-15-76 |
| REC-02 | recovery | P0 → P0 | Backup without drain/snapshot; unfenced record steps | fixed | Valid (B40 "closes writers and captures a consistent authoritative database export"). `assertWriter` on all kernel write paths, drain, exported snapshot shared by `pg_dump --snapshot` and inventory: 01 §3.2, §4.6, §4.7; 15 §3.5.1; T-F40, T-15-77 |
| REC-03 | recovery | P0 → P0 | `xid8` watermark breaks after `pg_restore` into a new cluster | fixed | Valid (B40 restore must leave a working installation; B33 projections). xid epoch advance with `pg_resetwal -e` + projector rebuild: 15 §3.5.2 step 4, §3.4.3; T-F41, T-15-78 |
| REC-04 | recovery | P0 → P0 | Lease recovery retries poison tasks forever | fixed | Valid (B35 "bounded retry, failure visibility"). Attempt bound at Lease and Recover, backoff, `lease_expired_exhausted`: 01 §4.6; T-F38 |
| REC-05 | recovery | P0 → P0 | Interval-loss scope built by inclusion only | fixed | Valid (B40 "Unknown affected identity/scope keeps the whole installation closed"). Conservative candidate rule `scope/1` + completeness basis: 01 §3.2, §4.7, §11; 15 §3.5.3, §3.5.4; T-F42, T-15-79 |
| REC-06 | recovery | P0 → P0 | Restored non-repeatable tasks could resend after reopening | fixed | Valid (B40 "no … automatic resend or blind repeat"). Restore boundary cancellation: 01 §11; 15 §3.5.2 step 6; T-F42, T-15-79 |
| REC-07 | recovery | P0 → P0 | Country-defect attribution rolled back / written in read transactions | fixed | Valid (B36 "Attribute a country-origin defect to that country"). Kernel attribution sink + `ops.attribute_country_defect`: 01 §2.21, §4.2 step 8, §4.13; 14 §3.4.6; T-F39, T-D22 |
| REC-08 | recovery | P1 → P1 | Closure aborts in-flight effects (avoidable uncertainty) | recorded for owner | Recorded P1 (register 02 §C); noted in 01 §4.7 |
| REC-09 | recovery | P1 → P1 | `closeAdmission` can starve under sustained share locks | recorded for owner | Recorded P1 (register 02 §C); to be confirmed by a PostgreSQL probe |
| REC-10 | recovery | P1 → P1 | Clock guard cannot detect a wrong host clock | recorded for owner | Recorded P1 (register 02 §C) |
| REC-11 | recovery | P1 → P1 | Kernel liveness traffic shares the 12-client pool | recorded for owner | Recorded P1 (register 02 §C) |
| REC-12 | recovery | P1 → P1 | Large SERIALIZABLE batches promote predicate locks | recorded for owner | Recorded P1 (register 02 §C); SQLSTATE 53200 mapping arrived with CCR-15-10 (01 §4.2) |
| REC-13 | recovery | P1 → P0 | Group-end sweep has no cursor (unbounded chain, misses rows) | fixed | Upgraded: demonstrable B25/B35 failure (eligible applications 201+ never end; unbounded chain). Cursor and bounded continuations: 01 §7.1; 13 §5.1; T-CO49 |
| REC-14 | recovery | P1 → P1 | Facility outage consumes per-item attempts | recorded for owner | Recorded P1 (register 02 §C) |
| REC-15 | recovery | P1 → P1 | No process supervision for tm-server and clamd | recorded for owner | Recorded P1; host/owner item (register 02 §C) |
| REC-16 | recovery | P1 → P1 | Poison fact halts a projector permanently | recorded for owner | Recorded P1 (register 02 §C) |
| REC-17 | recovery | P1 → P0 | Terminal blob-move failure leaves a version without owner | fixed | Upgraded: demonstrable B12 violation ("Missing/unreadable bytes remain unavailable with an owner"). `onMoveFailedTerminal` hook, bounded defer: 01 §2.21, §4.6, §4.12; 14 §3.6, §5.1; T-W17 |
| REC-18 | recovery | P1 → P1 | Plaintext backup residue; disk-full risk from backups/checkpoints | partly fixed; rest recorded for owner | Encryption part fixed with SEC-05; free-space reserve, retention count and separate filesystem recorded P1 (register 02 §C) |
| REC-19 | recovery | P1 → P1 | Restore key custody (age identity, TOTP wrap key) undefined | recorded for owner | Owner/production custody choice (register 02 §C; B37, B40) |
| REC-20 | recovery | P1 → P0 | Once-only original guard depends on a rotating secret | fixed | Upgraded: demonstrable B30 ("record each original once") failure after a B40 restore with new secrets. Plain applicant key; durable-key rule: 01 §1.1, §3.8; 13 §2.2; T-F49, T-CO76 |
| REC-21 | recovery | P2 → P2 | Work directory keyed by task, not attempt | parked note | Parked note |
| REC-22 | recovery | P2 → P2 | Scan leased before promote is cancelled as obsolete | fixed | Resolved by accepting record 14 CCR-04 (defer) |
| REC-23 | recovery | P2 → P2 | `.part` files not covered by cleanup | parked note | Parked note |
| REC-24 | recovery | P2 → P2 | No stream idle/throughput timeout | parked note | Parked note |
| REC-25 | recovery | P2 → P2 | Snapshot rollback drops post-checkpoint kernel facts | parked note | Parked note (digest in `sys.rollback_performed` noted in 15 §3.4.3) |
| REC-26 | recovery | P2 → P2 | Projector health trusts a stored flag | parked note | Parked note |
| REC-27 | recovery | P2 → P2 | Two server instances of one release can run | parked note | Parked note |
| BND-01 | boundary/environment | P0 → P0 | Worker launch line cannot run on this host | fixed | Valid, verified by the reviewer and re-checked here (toolchain under `root/usr/{bin,sbin}`, bubblewrap 0.9.0, lingering enabled). cgroup scope limits, no `--as`/`--nproc` on Node, explicit sandbox env, `resolveTool` paths: 01 C-08, §10.3, §10.11; 14 N-06, §5.2; T-F29, T-W09; material choice in register 02 §B |
| BND-02 | boundary/environment | P0 → P0 | `decl/1` defined twice | fixed | Same defect as COV-01; fixed there |
| BND-03 | boundary/environment | P0 → P0 | Invented preparation-only withdrawal cut-off (I-C2) | fixed | Valid (B24 "each other offering must declare its own evidenced cut-off"; B44 parks "preparation-only post-handover/cut-off"). I-C2 withdrawn; submitted prep-only withdrawal refused `withdrawal_cutoff_undeclared`: 01 §7.1, I-16; 13 §3.10, §3.12, §6, I-C2, T-CO38 |
| BND-04 | boundary/environment | P1 → P0 | Engineering release could settle parked/unselected policy | fixed | Upgraded (B05, B21, B43, B44). Owner-gated items (a) cancellation, (b) other-mode fee, (c) non-default withdrawal cut-off, (e) return policy: 01 §9.2; 12 §2.1, C5, E1; 13 CMD-OC2, CMD-OR4. Part (d) rejected: B24 "For a TravelMudra-held electronic result … a TA download does not" concerns results, not a preparation packet, and B44 parks only post-handover policy (01 I-15) |
| BND-05 | boundary/environment | P1 → P0 | Invented `external_evidence` dependency kind | fixed | Upgraded: demonstrable B44 violation ("Do not invent … dependent-government-result evidence"). Kind removed: 01 §3.5, §9.2; 13 §2.1, CMD-D5, §3.11.3 |
| BND-06 | boundary/environment | P1 → P1 | Attestation-only payment closes follow-ups | recorded for owner | Owner decision OD-R2-03 (with COV-05) |
| BND-07 | boundary/environment | P1 → P1 | Gate 1 only at assignment | recorded for owner | Owner decision OD-R2-02 (with COV-04, MON-08) |
| BND-08 | boundary/environment | P1 → P1 | Cross-module writers missing or misnamed | fixed | Fixed by CCR reconciliation: 01 §6 signatures (acceptIntakeProposals, Catalogue writers, reevaluateForApplication, noteGoverningBehindHead, operatorDuties, incidentsOwnedBy, consumeBotCheck, accountable SuperAdmin = grantor); compose test T-F37 |
| BND-09 | boundary/environment | P1 → P1 | Fee key conflict and missing `recordFeeNotPaid` call | fixed | Part 1 with COV-02; part 2 by accepting record 15 CCR-15-02 and the Core call (01 §6.8, §7.4; 13 CMD-X2) |
| BND-10 | boundary/environment | P1 → P1 | Two owners of packet build/release | fixed | Same defect as COV-03; fixed there |
| BND-11 | boundary/environment | P1 → P1 | Route inventory differs; direct `core.create_draft` route bypasses intake | partly fixed; rest recorded for owner | B14 part fixed (no direct draft route; 13 §4.1; 01 §6.4); remaining path names recorded with COV-14 |
| BND-12 | boundary/environment | P1 → P1 | Physical originals taken into custody with no return path | recorded for owner | Owner decision OD-R2-05 (escalates OD-12-02 consequence) |
| BND-13 | boundary/environment | P1 → P1 | Artifact association never triggered or never matches | fixed | Fixed by CCR reconciliation (13 CCR-13 accepted with edit): Documents settled listener for official results, `assoc/1` aligned to name + passport number extraction, fail closed with an owned incident (B13). 01 §6.6–6.7; 13 §3.15; 14 §3.6, §5.6; T-CO73, T-W18 |
| BND-14 | boundary/environment | P2 → P2 | Three harness actor models | fixed | Resolved by accepting record 13 CCR-07 (actor kind `harness`) |
| BND-15 | boundary/environment | P2 → P2 | Opposite rules for email change between queue and send | fixed | Resolved by rejecting record 11 CCR-12 (refresh to current email) |
| BND-16 | boundary/environment | P2 → P2 | Offering withdrawal is permanent | parked note | Parked note; owner candidate OD-R2-07 (register 02 §A) |
| BND-17 | boundary/environment | P2 → P2 | Invented group policies (past start date, TA closes group) | parked note | Parked note |
| BND-18 | boundary/environment | P2 → P2 | Restore scope not checked against evidence candidates | fixed | Fixed with REC-05 (candidate set includes every evidence-named id) |
| BND-19 | boundary/environment | P2 → P2 | ALTCHA default bundle vs strict CSP | parked note | Parked note (CSP-compatible build noted in 01 §12.4) |

## Verification limits

- This consolidation changed design text only; no product code exists. No test was run.
- Host facts re-checked read-only for BND-01: toolchain binaries under `$TM_TOOLCHAIN_DIR/root/usr/{bin,sbin}` and `root/usr/lib/postgresql/16/bin`, tessdata under `root/usr/share/tesseract-ocr/5/tessdata`, bubblewrap 0.9.0, user lingering enabled. The prlimit and systemd-run probes are the reviewer's; they were not repeated.
- PostgreSQL behaviour claims behind REC-03 (xid8 after `pg_restore`), REC-09 and REC-12 rest on documented PostgreSQL semantics; REC-03 is fixed by design, REC-09/REC-12 are recorded and SHOULD be confirmed by a short probe on the installed PostgreSQL 16.15 before milestone 1 closes.
- The foundation re-review required by B41 has not happened yet; it is the next step.
