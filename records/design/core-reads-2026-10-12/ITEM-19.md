# ITEM-19 P-10 (e): Gate 1 facts for an assignment and for the first operator work

Kind 1 read. Wave 3, worker W10 (Opus, worktree `wave3-gate1`; about 225k context for ITEM-19 and ITEM-20 together).
Commit: LANE_19 (cherry-picked from `ccf9659`; parent e0b978d on the worker branch). Grants: prompt scope
(`src/modules/core/controls.ts`, `staff-views.ts`, `store.ts`, `src/contracts/core.ts`, `src/core-api/bindings/core.ts`,
`test/core/assignment-holds.test.ts`); one register line (D-16 G4).

## Read and change

The SuperAdmin could not see why Gate 1 holds a new assignment or an operator's first work. A Core read helper
`gate1Facts` (`controls.ts`) returns the recorded facts Gate 1 reads for its two exception keys, `assign` (assignment and
reassignment) and `start_operator_work`: the service payment status with its entry and status revision; the active
assignment; the first-work basis recorded on it (kind, exception id, time); whether Operations recorded a work step; the
granted exception of the key with its expiry and the existing freshness check's failure code; `asOf`. It decides nothing;
the evaluator's basis `passed` also stands for an exception basis, so the read serves facts, not a verdict (lane rule;
D-16 C). The three Gate 1 decision sites are unchanged. The SuperAdmin's staff case read (`core.admin_case`) serves it as
a nullable `gate1Context` (`{ assign, startOperatorWork }`); other readers get null or no field. Additive contract change.

Worker deviations: the grant eligibility codes are left out (the rule is a private function inside `gateCommands` in
`gates.ts`; reaching it would change a decision site). The helper passes empty acts and readiness to
`exceptionFreshness`, because the Gate 1 basis holds only the payment revision and the assignment (comment in the code).
"Open" means draft or submitted with no outcome. `exception.state` is always `granted` (the read selects granted rows).

## Tests

`test/core/assignment-holds.test.ts`, "Gate 1 facts on the SuperAdmin case read": an unpaid assistance case, in turn
unpaid and assigned, with a start exception granted, the exception expired, paid, after the first work and after a work
step: the facts are as recorded, and the evaluator blocks the first work exactly when no payment is received, no
exception can be used and no basis is recorded. The field encodes through the contract; the operator's read carries
null and the travel agent's read has no such field. Failed first: `evidence/ITEM-19-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `ccf9659` (`reviews/ITEM-19-review.md`). Verdict: sound as written. The
reviewer confirmed that the empty acts and readiness passed to the freshness check give the same result for Gate 1 (its
exception basis uses only the payment status revision and the active assignment), and that the three decision sites are
unchanged. All findings P2, parked:

- R-01: no projection of an exception-backed first-work basis while unpaid, nor of the replacement assignment after a
  reassignment.
- R-02: no support-view audience test; no payment-revision staleness or inactive-grantor freshness case.

## Checks

CHECKS_19
