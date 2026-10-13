You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: 8387ecc in the current repository (branch core-reads-2026-10-12; parent b3519e9). Read it with `git show 8387ecc` and surrounding code with `git show 8387ecc:<path>`.

Change (defect fix): a SuperAdmin's support view of an operator who holds the accounting grant omitted the Accounts surface, so the support view did not match the person's read scope. `src/modules/identity/sessions.ts` (`resolveSessionToken`) now derives the support view's surfaces with `surfacesOf(viewed.role, …)`, reading the VIEWED operator's accounting grant on every resolution; `src/modules/identity/policy.ts` adds `sv: true` to `accounts.surface_read` only. Downloads and account actions must stay refused for a support view (no `sv` on byte retrieval or the `*_admin` actions; boundary rules refuse a support view; a support view runs no command). The operations guide gains one sentence.

One-time review; read-only; do not modify files; do not ask questions back.

Judge: (1) Does a support view now see exactly the viewed person's read scope, no more: which other actions or queries become reachable through `sv: true` on `accounts.surface_read` or through the `accounts` surface (allowlists, BFF routes in `src/apps/staff/`, `supportViewQueries`)? (2) Is the grant read for the viewed account, current (validity window, revocation during the view), and never cached? (3) A suspended, deactivated or superadmin viewed account; a TA; clock-health gates. (4) Do downloads, receipt verification, adjustments and every command stay refused? (5) Are the tests sufficient and do they fail without the change?

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
