# ITEM-04 P-18 (1) guard slice: a passport record is shared only with its applicant's applications (K2-P18-1 (a))

Kind 2, P0 pre-production. Proposal `K2-P18-1-custody-corrections.md` (frozen in the lane `research/inputs/`, hash in
`MANIFEST.sha256`): §0 (a), §2.9 (iii), §10, §12 H-4, §15 rows 3 and 10, §16 guard-only slice, Q10. Commit: `5f5e26b`
(parent `e4ffed9`).

Not built (PLAN §3, parts that wait for Max): Q1 to Q8 and Q10's later part, `ops.correct_original` and its five kinds,
`closure`, the `removed` part state, migration 1060, the E7 incident, the late-arrival route, refusals (i) `link_ended`
and (ii) `original_closed` of §2.9 (both need state that only the corrections create).

## 1. Grants and decisions

| Item | Source |
|---|---|
| `passport_identity_mismatch` appended last to `REASON_CODES` | Orchestrator grant, 13 Oct 2026 (additive only; no other kernel change; no migration; commit body names the grant; `npm run check` green) |
| The grant's condition "the refusal playbook row in the same commit" | Not applied (deviation D-06, PLAN §6). The condition came from the architect's own request, by mistake. `docs/playbooks/refusal-codes.md` covers the refusals of the `tm` procedures and of instance start (`test/static/refusal-playbook.test.ts` scope); no product command refusal has a row (`custody_path_not_declared`, `dependency_not_linked`, `applicant_identity_missing` have none). The ITEM-03 row exists because that code is a restore-procedure code. Reported in the package message |
| The UI sentence for the code (`src/apps/shared/core/shared.ts`) | UI-lane file: package message |

## 2. Failing test first

`test/operations/original-link-identity.test.ts` (new), run at `e4ffed9` with only the test and kit changes:
G2 fails (the share to another applicant's application was `accepted`); G1, G3 and G4 pass, as they pin unchanged
behaviour. Evidence: `evidence/ITEM-04-G-fails-at-e4ffed9.txt` (beside this record).

## 3. Change

- `src/modules/operations/case-work/commands/originals.ts` `ops.link_original`: after the cross-operator loop, for a
  record whose item key starts with `passport:`, the target's current applicant identity (`core.applicantIdentity`,
  under the target's share lock) gives `passport:<applicantKeyOf(identity)>`; a different key refuses
  `control_blocked` / `passport_identity_mismatch`. A target without a usable key fails closed and no link is
  written: a valid snapshot always has a key; a malformed stored identity fails the snapshot read (`internal`) before
  `applicantKeyOf` runs (reviewer's reading). Other item types: unchanged.
- `src/kernel/vocabulary/reasons.ts`: the granted value, last.
- `test/operations/kit.ts`: `app()` takes an optional `passportNumber` (a second application of one applicant in a
  group) and finds the created application by group, offering and key.
- Writers of `ops_original_links`: the receipt (links the record to its own receipt application, the key comes from the
  same identity) and `ops.link_original`. No other writer.

## 4. Tests

| Case | What it shows |
|---|---|
| G1 | The same applicant's other application in the group (another physical offering) shares the passport record: link row, custody of the target, one `ops.original_linked` fact |
| G2 | Another applicant's application: `control_blocked` / `passport_identity_mismatch`; links, record revision, facts of the record, the target's custody and `sys_operations` unchanged; no operation record for the key |
| G3 | A record of another item type (written with SQL; the synthetic catalogue declares only passports) is shared with another applicant's application, as before |
| G4 | For another applicant's passport, a preparation-only target, an electronic target and another operator's application keep `preparation_only_holds_no_originals`, `custody_path_not_declared` and `parked_custody_route_policy` |

Existing `test/operations/originals.test.ts` and `test/operations/access.test.ts` pass unchanged.

## 5. Known behaviour that waits for the corrections (H-4)

A record keeps the key of the receipt. If the applicant's passport number is corrected after the receipt, a share to the
same person's other application (which carries the corrected number) is refused. The designed remedy is the move
correction (K2), which is not built. Until then the operator records a new receipt on the other application: its key
is the corrected one, so it does not collide with the old record.

## 6. Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one review of `5f5e26b`: lane `research/reviews/ITEM-04-review.md`. Verdict "sound as
written". The reviewer found: the command, its binding and its route reach the same handler; the receipt is the only
other link writer and keys the record from its own application; the target's snapshot is read under `FOR SHARE` and
identity writers take the conflicting update lock; receipt and share use the same `applicantKeyOf` (issuing country and
normalization); an earlier accepted share replays without the guard and writes nothing; a refused share leaves no
operation record; the refusal precedes every write; G2 would fail on the parent.

| Finding | Rank | Disposition |
|---|---|---|
| R-01 More regression cases: a corrected target, equal normalized numbers, the same number from another issuing country, both orders of a concurrent correction and share, same-key retries | P2 | Parked (§6 of this record): no defect found; the cases guard against a later change |

## 7. For the UI lane (package message)

The sentence for `passport_identity_mismatch` (`src/apps/shared/core/shared.ts`), for example: "This passport belongs
to another applicant. Share it only with an application of the person whose passport it is."

## 8. Checks

- `npm run check` (typecheck, lint, every test) on the tree committed as `5f5e26b`: 2567 of 2567 pass, 0 fail. This
  run is also the package check of the P0 package (ITEM-01 to ITEM-04 and ITEM-33).
- Before the commit: `original-link-identity`, `originals`, `access` 11/11; `vocabulary`, `frozen-interfaces`,
  `refusal-playbook` 22/22; typecheck; eslint on the changed files.
