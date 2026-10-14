# ITEM-02 P-15 (1): a declared relation without a link blocked nothing (K2-P15-1)

Commit ids in this record are those before the reword of 13 Oct 2026; the map old → new is in `PLAN.md` §7.

Kind 2, P0 (register OD-X4, option A). Proposal `K2-P15-1-dependency-not-linked.md` (frozen in the lane
`research/inputs/`, hash in `MANIFEST.sha256`) and its review. Commits: `100227f` (blocker, rule 19a, wire pattern) and `88a1174` (packet release, Q1).

## 1. Grants and decisions

| Item | Source |
|---|---|
| Kernel reason code `dependency_not_linked` (additive, after `dependency_evidence_missing`) | Orchestrator grant, 13 Oct 2026; named in the commit body |
| Wire blocker `ref` pattern `^[a-zA-Z0-9_.]{1,60}$` | Proposal Q2, decided yes |
| `release_packet` enforced (Q1) | Max approved Q1 on 13 Oct 2026 (D-02 closed): second commit, `NOT_LINKED_ENFORCED` plus the unreleased-packet case of `notLinkedBlocksNextStep`, test I13 |
| Q3 (B44 boundary) | Max: stays parked for UAT; decided before a real dependent offering launches (D-03) |

## 2. Failing tests first

| Test | Before the change |
|---|---|
| U1 `test/unit/errors.test.ts` | `encodeWire` rejected `ref: 'needs_tourist_evisa'` (pattern without `_` and digits): a refusal became a server error |
| I2 `test/core/dependency-not-linked.test.ts` | The submission authorization of an unlinked TRANSIT application was accepted |
| I1 `test/operations/work-acts.test.ts` | The real `ops.record_readiness` was accepted |

## 3. Change

- `controls.ts` stage 10: one blocker `{dependency_prerequisite, mandatory_validation, dependency_not_linked,
  exceptionEligible: false, ref}` per declared relation without a live link: for `record_readiness` every applicable
  relation; for an `authorize_*` act only the relations that condition it.
- `derived.ts`: `applicableUnlinkedRelations` (relations that condition an enforced action and have no link row in a
  state other than `unlinked`); `notLinkedBlocksNextStep` (an unspent conditioned act, or readiness not valid before
  filing or release); pending rule 19a before rule 20.
- Records: `13-core-operations.md` rule 19a, CMD-O3 and CMD-X1 checks; `01-foundation-contract.md` stage 10 and the
  reason list.

## 4. Hostile states (tests)

| State | Behaviour | Test |
|---|---|---|
| Readiness or Gate 2 exception granted | Gate passes; blocker stays; exception stays `granted`; no reservation | I4, I5 |
| Act `authorized` before the deploy | Answer stays `record_external_evidence`; evidence accepted; after `not_filed_evidenced` both a fresh authorization and readiness are refused | I7 |
| Filed before the link | Readiness refused; answer rule 21, or rule 19a when an unlinked relation conditions an unspent fee act | I8 |
| Operation accepted before the deploy, replayed | Replay accepted (`replayed: true`); changed content under the key is a conflict | I9 |
| Retry of a refused envelope | `stale_revision` after the recovery; the corrected request under the same key is evaluated fresh | I10 |
| Two authorizations at once; link and readiness at once | One accepted; readiness refused in either order | I11 |
| Two relations, one linked and waiting | Both blockers; rule 19a, then rule 20 after the link | I12 |
| Drafts from intake | No link row and no blocker on submit | I14 |
| Release boundary (projection) | Forward observation, rebuild, rollback through the old rule port | V1 to V3 |

## 5. Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one review of `100227f` and `88a1174`: lane `research/reviews/ITEM-02-review.md`.
Verdict "sound with the fixes above". The reviewer found no bypass and no deadlock: every production writer of readiness,
authorizations and releases calls `requireControls`; no exception clears the stage 10 blocker; rule 19a precedence, the
spent-act logic and the release case match the design; the projection behaviour matches proposal §11; U1 fails with the
old pattern (verified in memory).

| Finding | Rank | Disposition |
|---|---|---|
| R-01 I11 races the link against a read-only readiness evaluation, not the real `ops.record_readiness` command | P1 (verification gap; no product defect found) | Worked: the proposal's I11 names the operator's readiness command, so this completes the planned test. Test-only commit `e41d64f` in `test/operations/work-acts.test.ts`: four runs, both start orders; link accepted each time; readiness refused with `hold_returned_to_ta` (or `stale_revision`, allowed, not observed); after the hand back `dependency_outcome_unmet`; no operation record, readiness row, readiness fact or task written by either refused command. |
| R-02 No command-level test of return → unlink → hand back after readiness (the fixture unlinks by SQL) | P2 | Parked note. The reviewer confirmed from source that unlink moves the material revision, readiness becomes stale and rule 19a returns. Revisit when the unlink path changes. |

## 6. Checks

- `100227f`: `npm run check` 2488 of 2488 pass.
- `88a1174`: the affected files 110 of 110 pass (`npm run check` ran again on the next package commit, below).
- `e41d64f`: `test/operations/work-acts.test.ts` 12 of 12 pass at `e41d64f` with no uncommitted change
  (`evidence/ITEM-02-e41d64f-standalone.txt`, beside this record).
- `npm run check` on the tree committed as `d2067af` (ITEM-03, which contains every ITEM-02 commit): 2541 of 2541 pass.
