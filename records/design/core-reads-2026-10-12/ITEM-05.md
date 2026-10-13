# ITEM-05 P-20 (1), K2-P20-1: disclosure correction evidence (the parts that do not wait for Max)

Kind 2, P1 pre-launch. Worker W13 (Opus, worktree `wt/w13-disclosure`; about 281k context, above the 275k
partial-return rule; logged with the orchestrator). Review follow-up worker W17 (Opus, same worktree).

HELD (PLAN D-20). Branch `held/disclosure-correction` in the lane clone, never on the lane branch. Commits `b6f7833`
(Point R) and `2bcc751` (census and release record), rebased on the lane head `3a81652` (the first build was `2b5a93e`,
`127c54b` on `e0b978d`). Follow-up commits: FOLLOWUP_05. Reason for the hold: Point R is not releasable alone. Without
Point D (the recorded "no replacement owed" decision), a disclosure incident that names no file can never be resolved.
The branch waits for Point D, which waits for Max's answers to Q-1 to Q-3.

## Split (design note `ITEM-05-design.md`)

| Point | Built | Reason |
|---|---|---|
| R: only a replacement the travel agent can receive meets the correction (R1 to R6) | Yes | Reads existing rows through existing ports; no answer to Q-1 to Q-3 changes it |
| D: the "no replacement owed" decision (column, migration, command, wire fields) | No | Q-2 decides its shape |
| S: a SuperAdmin may record the decision | No | Q-1 |
| G: refuse the decision when a replacement is owed | No | Q-3 (a check inside D's command) |
| Census (§0.5), read-only, in the release record | Yes | Q-4 stays Max's confirmation |
| Release rule (§0.6), in the release record | Yes | Stated without D's migration number; Q-5 stays Max's confirmation |

## Change

- `b6f7833`: the correction of a wrong-recipient disclosure is met only by the one eligible artifact of the file's type
  for the confirmed application, whose version is current, canonical, content-safe and of that application's group, and
  which no open incident blocks (`releasableReplacement`, `src/modules/operations/case-work/incidents.ts`). Replacement
  links are not followed. No reference counts. An incident without a file stays unresolved. Re-evaluated at every read
  and resolution of an open incident; resolved and closed incidents are unchanged.
- `2bcc751`: `docs/operations.md` section 2 release record: the first release with the rule raises the schema head; no
  build without the rule declares that head compatible; rollback rules; a read-only census of open incidents whose
  correction is missing, and of resolved or closed ones as follow-up candidates.

Walk-through: `ITEM-05-WALKTHROUGH.md`.

## Tests

`test/operations/disclosure-correction.test.ts` (new) and the disclosure tests of `incident-authority` and
`artifacts-incidents`: references, a replacement under review, rejected, for another application, of another type,
with unavailable bytes, blocked by an incident; chains; an earlier eligible replacement; a replacement reported later;
the staff incident read; the path after completion; the census exactly as the guide states it. Failed first:
`evidence/ITEM-05-rule-fails-first.txt`, `evidence/ITEM-05-census-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on the two commits (`reviews/ITEM-05-review.md`). Verdict: sound with the
fixes above; the commits are not independently releasable.

- R-01, P1: the release record does not say that R ships only with D and its new schema head. **Orchestrator (13 Oct
  2026, under OD-X26; PLAN D-20): fix now.** Docs follow-up commit (W17).
- R-02, P1: no tests for both orders of a resolve and a concurrent invalidation, retry and replay, unchanged resolved
  history, and the independent eligibility guards. **Orchestrator (D-20): fix now, tests only, fresh Opus worker.**
  Tests follow-up commit with mutation checks (W17; `evidence/ITEM-05-followup-mutations.txt`). The proposed
  rollback-boundary test waits for the new head (Point D).
- R-03, P2, parked: the census has no statement timeout or result-size bound.

No re-review of the follow-up (lane rule).

## Open for Max (parked under OD-X26; do not build)

- Q-1: may a SuperAdmin record the "no replacement owed" decision (Point S)?
- Q-2: the authority rule and shape of the decision (Point D; option (c) adds a pending state and a second command).
- Q-3: refuse the decision when a replacement is owed (Point G)?
- Q-4: confirm the census; Q-5: confirm the release rule (both built as stated).

## UI-lane notes

`labels.ts:38` and `incidents.ts:76` say "or evidence that none is owed" (no such decision exists until Point D);
`case-work.ts:259` says "verified and available" (the rule now also needs current, canonical, content-safe, same group
and no blocking incident).

## Checks

CHECKS_05
