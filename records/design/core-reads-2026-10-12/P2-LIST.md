# Core lane core-reads-2026-10-12: parked findings (P2) and P1 findings parked as P2 (14 Oct 2026)

One line each. The full text, scenario and smallest fix are in the item record named in the first column (section
"Review and dispositions" or "Parked notes"). Nothing here is worked unless Max or the orchestrator assigns it. Revisit a
line when its trigger occurs.

## P1 findings parked as P2 by a decision

| Item | Finding | Decision | Revisit trigger |
|---|---|---|---|
| ITEM-12 R-01 | 500 open incidents at the maximum checklist encode to about 4.29 MB, over the staff client's 4 MiB answer cap | D-11 (Max) | a queue near 500 open incidents |
| ITEM-12 R-02 | incident evidence has no total limit; the read shows the first 100 (existed before) | D-11 (Max) | an incident with more than 100 evidence items |
| ITEM-28 R-01 | the wrong-recipient form's email choices come from the 100-send window | D-11 (Max) | a report about an older file |
| ITEM-24 R-01 | free-text receipt fields can carry a passport number into the originals register (same exposure as `ops.case_work`) | D-13 (Max) | a privacy review of free-text fields |
| ITEM-10 (a)+(c) R-01 | an item held in an earlier assessment and carried forward can never be approved once the head moved on | D-15 (Max) | a held item that must be approved later |
| ITEM-22 R-01 | an unassigned group-read grantee also receives `exhausted_reason` through `core.ops_case` | D-17 (orchestrator) | Max restricts the reason to the assigned operator |
| ITEM-14 condition | the staleness fingerprint is the per-application read, not one aggregate query | D-12 (Max) | publication of an offering with many open applications becomes slow |
| ITEM-16 overflow | the batch command summary passes 4096 bytes at 61 assigned items | D-16 D-d | `assignmentBatchMax` configured above 50 |

## P2 findings and notes

| Item | Note |
|---|---|
| ITEM-01 to 04, 33 | see each record's "Parked notes (P2)": preview `not_applicable` vs command `internal` (03); `FILING_ACT_KINDS` defined twice (03); restore text cannot print the `--not-filed` count (03); a snapshot holding `''` cannot be read by the previous release (33); `intake/rows.ts:36` reads passport zone names only when both row names are empty (33, bulk lane); more regression cases for the passport guard (04 R-01); return-unlink-hand-back after readiness by SQL fixture (02 R-02) |
| ITEM-06, 13, 26 | one coverage note each |
| ITEM-11 | R-01 "With a reviewer" badge (UI); R-02 no assertion on `ops.incidents` or the memo's query count |
| ITEM-12 | R-03 association 51 candidates against a cut of 20 (existed before); R-04 `commands/incidents.ts:178` `releaseRefs.slice(0, 50)` |
| ITEM-28 | R-02 resend order under a clock rollback (the command still refuses a second resend) |
| Wave 1 notes | delivery `readEmailsOf` still reads the earliest 100 sends for the evidence summary (completion evidence blind past 100); operations `viewerIsReviewer` and `monitorCounts` read stored holders (stale-holder class of ITEM-11) |
| ITEM-08, 15 | coverage notes |
| ITEM-09 | `gateView` open to any `application.read` holder (page SuperAdmin-only today); `PaymentsCorePort.evaluateControls` unused, doc stale; a Gate 2 throw also loses Gate 1 |
| ITEM-14 | `catalogue/preview.ts` header still says "submitted work" |
| ITEM-24 | the register omits holder reference, custody time per movement and the uncertainty flag; R-03 the cap test never checks exactly 500 |
| ITEM-07 | (1) R-02, (2) R-01 coverage notes |
| ITEM-10 (d) | R-04 `latestOfferingFactSeq` has no offering-keyed index; an approval whose target equals the application's tuple opens a no-op transition |
| ITEM-10 (a)+(c), (b) | R-02 and coverage notes |
| ITEM-25 | A: every open-case read adds five to seven sequential launch decisions (about 16 to 43 queries, unmeasured); no withdrawal or terminal comparisons; B: `accountNames` reads accounts one at a time; the test checks the cap at a helper limit of two |
| ITEM-16 | R-01 tests use one operator and do not read after an assignment ends or moves |
| ITEM-18 | R-01 equal revisions do not prove duties unchanged (UI: informational); R-02 loads the whole authorization history before cutting to 200; R-03 incident comparison sorts ids, acts only `authorized`; `reviewer_ends` unreachable today |
| ITEM-19 | R-01 no exception-backed basis while unpaid or after reassignment; R-02 no support-view audience, payment-revision staleness or inactive-grantor case |
| ITEM-20 | R-01 no started-without-basis case, no truncation when candidates are filtered; paid but unstarted work can fill the 200-candidate scan |
| ITEM-21 | R-03 prior-commitment rule tested for attempt 1 only; R-04 the helper rereads the authorization history |
| ITEM-22 | R-02 only `exhausted_at` masked by state; R-03 tests do not separate the two times or oldest and newest mark |
| ITEM-05 (held) | R-03 the census has no statement timeout or result-size bound |
| ITEM-30 | R-02 no forced single serialization failure followed by success |
| Test timing (not lane code) | `test/intake/source-structural.test.ts:51`, `test/intake/dispatch-credits.test.ts:61` and the intake folder-inventory test fail under load and pass alone; they can turn a main check red |
