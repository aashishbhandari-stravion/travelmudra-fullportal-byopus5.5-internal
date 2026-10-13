# ITEM-03 walk-through for Max: after a restore, a "possibly filed" mark resolves only with a filing answer

Commit ids in this record are those before the reword of 13 Oct 2026; the map old → new is in `PLAN.md` §7.

## What changed

A restore can lose recent work. When it does, the reopening procedure puts a protection mark on each application that
may have been filed, paid or released during the lost interval. Before this change a SuperAdmin could resolve a mark
that said "possibly filed" with any evidence. The operator could then authorize the government submission again, even
when the application had already been filed in the lost interval: a second filing.

Now Core answers the filing question itself when the mark is resolved. It reads the act records that remain:

| What the records show | What the resolution records |
|---|---|
| The service has no filing act (preparation only) | "not applicable" |
| A filed submission (or provider handoff) is on record | "filed on record", with that act; a new submission stays refused |
| An act is still authorized (live permission) | Nothing: the mark stays until that act's result is recorded |
| An act's filing is unknown, or its reconciliation was exhausted | "protected by act", with that act; refiling stays refused |
| No act tells | Only the SuperAdmin's statement "not filed" with an external reference or a document records "not filed"; an attestation alone is not enough |

Marks resolved before this change keep their record unchanged. Until a SuperAdmin records a disposition for such a mark,
with the same table and evidence, the application's external acts wait (`protection_mark_determination_missing`).

## The form of this walk-through: a test transcript (your option C, 13 October 2026)

A mark exists only after a real restore closure, so the click-through on `lane-max` needs a restore drill. You chose to
read a test transcript now and to run the drill later as its own item, after the Core package is integrated and the UI
shows the filing answer.

Transcript: `evidence/ITEM-03-transcript.txt` (beside this record). 55 of 55 pass on commit `d2067af`, each on a
throwaway test database with synthetic data. The full repository check on the same commit: 2541 of 2541 pass. The
first case, F1, fails on the code without the change: the resolution was accepted
(`evidence/ITEM-03-F1-fails-at-e41d64f.txt`).

## What to read in the transcript

| # | Question | Case lines to read |
|---|---|---|
| 1 | Is the second filing closed? | F1 (refused without an answer, the mark keeps guarding the case), F2 (the "not filed" statement with a reference, then the submission is allowed) |
| 2 | Does weak evidence pass? | F3 (an attestation alone is refused; nothing is written) |
| 3 | Does Core use the records that exist? | F4 (filed on record), F5 (live permission: no resolution), F6 and F7 (protected by act), F15 (provider handoff) |
| 4 | Is anything else changed? | F8 (preparation only), F9 (marks without "possibly filed" behave as before), F16 (gate exceptions untouched) |
| 5 | Retries and failures | F11 (same key, other body, new key), F12 (lost acknowledgement), F13 (failure before commit: nothing written) |
| 6 | Can the database be written around the rule? | F14 (a direct update is refused by a check) |
| 7 | Marks resolved before this change | L2 (external acts wait), L3 (the SuperAdmin disposition; the mark row stays as recorded), L4 (refusals; the disposition row cannot be changed or deleted), L6 (an earlier operation sent again is replayed and still waits) |
| 8 | The release and the backups | L1 (the migration keeps earlier rows exactly), S3 (a backup and restore keeps them and the check) |
| 9 | What the staff pages will read | V1 (the mark's flags and the filing answer for each case), V2 (the list of earlier marks that wait for a disposition) |

To run it yourself in the lane clone:

```bash
export TMPDIR=/tmp/claude-1000/walk && mkdir -p $TMPDIR && node --test --test-reporter=spec --test-global-setup=test/support/global-setup.ts test/operations/protection-mark-filing.test.ts test/operations/protection-mark-legacy.test.ts test/ops-tooling/mark-filing-migration.test.ts
```

## What `lane-max` shows after the package deploy

Nothing new on the pages yet. No application on `lane-max` holds a mark, and the staff pages do not yet render the
filing answer, the "not filed" field or the disposition form: those are UI-lane items in the package message. The
restore drill item will add the click-through.

## What is not covered

- A backup taken by the previous release, restored and then upgraded (case S6): not built, because it needs new test
  infrastructure. The migration over an earlier mark (L1), the backup and restore (S3) and the waiting acts (L2) cover
  its parts.
- The record of a restore's filing uncertainty and reconstructed acts (Part 2 of the design): not built, as decided.
- F7: when a reconciliation is exhausted, the product also records the unresolved outcome. A new authorization is
  therefore refused first with "outcome already recorded"; "no refiling" is also in the refusal.
