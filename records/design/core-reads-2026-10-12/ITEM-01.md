# ITEM-01 P-21 (1): a travel-date edit accepted past dates

Kind: defect, P0 (orchestrator classification of 13 Oct 2026; UI lane `P-21-wp17-timing-withdrawal.md` item 1, review
R-01). Commit: `4b4dc3e` (amended before reporting from `9c207a7`, which the review read; see §5).

## 1. Grants

Orchestrator, 13 Oct 2026: the function `editTravelDates` in `src/modules/core/commands/groups.ts` (a K2-S1 file of the
bulk lane), one commit; the one line `test/documents-association/application-documents.test.ts:432` (bulk lane file).
The commit body names both grants.

## 2. Failing test first

`test/core/groups-drafts.test.ts` "refuses a past travel start date on edit with the field error of create, and changes
nothing". Before the fix: `expected group_dates_invalid, got {"status":"accepted",...}`. After: pass.

## 3. Cause and fix

Cause: `core.edit_travel_dates` checked only `return >= start`; `core.create_group` also checked `start >= today`
(`checkDates`). Fix: the edit applies the create rules to the dates the travel agent sets. A start already passed and
kept unchanged is accepted, and the return MUST then be today or later.

## 4. Hostile states

| State | Behaviour |
|---|---|
| Asia/Kolkata day boundary | `businessCalendar.dateOf(tx.now)`, as create |
| Trip under way (stored start passed), return extended | Accepted with the start unchanged (test "records a later return for a trip under way…") |
| Trip under way, return set in the past | Refused, field `travelReturnDate` |
| Trip under way, start changed to another past day | Refused, field `travelStartDate` |
| Replay of an accepted edit after midnight | The kernel returns the stored result; the handler does not run |
| Refusal residue | None: only reads and locks precede the check; no revision, fact or task |
| One test used a past date as a convenience | Moved to 2 to 10 March (kit today 1 March); intent and assertions unchanged |

## 5. Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one review of `9c207a7`: lane `research/reviews/ITEM-01-review.md`. Verdict
"sound with the fixes above".

| Finding | Rank | Disposition |
|---|---|---|
| R-01 A return-only correction during a trip is refused because the unchanged start is past; open applications can then end at the old return date (auto-ending follows `today > return`, `tasks.ts:145`, `derived.ts:246`) | P1 (reviewer); the architect treats it as the same irreversible-harm class as the P0 | Accepted and fixed in the same function before reporting (amend to `4b4dc3e`, so the item stays one commit as the grant states). Regression test fails at `9c207a7`, passes at `4b4dc3e`. Deviation from the grant's literal method ("replace with `checkDates`"): reported to the orchestrator at the package boundary. |

The reviewer confirmed: edit is the only writer of `core_groups.travel_start_date`; create already checks; binding and
BFF call the command; intake writes no group dates.

## 6. Checks

`test/core/groups-drafts.test.ts`, `test/core/travel-date-rules.test.ts`, `test/documents-association/application-documents.test.ts`:
43/43. `test/views/case-projections.test.ts`: 17/17 (at `9c207a7`). `npm run typecheck` clean. `npx eslint` on the changed
files clean. Full `npm run check`: at the package boundary.
