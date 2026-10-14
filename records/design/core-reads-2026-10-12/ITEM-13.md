# ITEM-13 WP-15 note: the support view of an accounting-grant holder omitted the Accounts surface

Defect, identity. Wave 1, worker W1 (Sonnet, worktree `wave1-identity`). Commit: `8387ecc` (cherry-picked from `64a9ce0`
and amended by the architect with the granted guide sentence; parent `b3519e9`). Inside prompt §4 (identity session
and surface-read wiring for this item; the orchestrator confirmed that `policy.ts` `accounts.surface_read` is that
wiring, 13 Oct 2026). `docs/operations.md`: one sentence, orchestrator grant (wave 1, 13 Oct 2026).

## Defect and change

`src/modules/identity/sessions.ts` gave a support view `['ta']` or `['ops']` and never read the viewed operator's
accounting grant, and `accounts.surface_read` had no `sv`, so a support view could not read the Accounts surface that the
person reads. Now the support view's surfaces come from `surfacesOf(viewed.role, …)` with the VIEWED operator's grant read
on every resolution (a grant revoked during the view drops the surface; a suspended account gets none), and
`accounts.surface_read` has `sv: true`. Downloads, receipt verification, adjustments and commands stay refused for a
support view (no `sv` on byte retrieval or the `*_admin` actions; boundary rules; a support view runs no command).

## Tests

`test/identity/policy.test.ts`: "shows the Accounts surface of an operator who holds the accounting grant, read-only, and
drops it with the grant and the account": surfaces `['ops', 'accounts']` and `accounts.surface_read` allowed with a grant;
`document.retrieve_bytes` and `accounts.receipt_verify` refused; no grant → `['ops']`, refused; grant revoked → drops;
suspended → `[]`. Failed first (`['ops']`): `evidence/ITEM-13-fails-first.txt`. Worker deviation: the test uses `op2`
(granted, then suspended) and `op3` (no grant) with explicit grants, because the existing support-view test suspends `op1`.
`policy` 13/13. Not exercised end to end: the staff `/accounts` route for a support view (it uses the same action).

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (lane `research/reviews/ITEM-13-review.md`). Verdict: sound as written.
The only newly reachable route is staff `GET /accounts` (`iam.accounts_surface`), which carries no finance data. Session
resolution and policy both read the viewed operator's grant on every request; revocation takes effect on the next read;
byte retrieval, selections, receipt verification and adjustments stay refused.

- R-01, P2, parked: no end-to-end request of `/accounts` through staff and Core for a support view. Coverage note.

## Checks

`npm run check` at `8387ecc` (detached checkout): typecheck and lint clean; 2568 of 2569 tests pass. The one failure is
`test/intake/source-structural.test.ts:51` (an import reached `fully_processed` before the assertion read
`processing`). It is a timing flake under machine load, not this change: run alone it failed 1 of 3 times at `8387ecc`
and 1 of 5 times at `b3519e9`, at a load average of about 70 while six other full checks ran. Rerun alone on a quiet machine: 2 of 2 pass.
