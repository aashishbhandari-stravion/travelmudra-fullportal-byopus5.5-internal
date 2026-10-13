You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: 7b3c7a6 in the current repository's object store (worker branch wave3-reads; parent e0b978d). Read it with `git show 7b3c7a6` and surrounding code with `git show 7b3c7a6:<path>`.

Change: the staff case reads (core.admin_case and core.ops_case) serve, for each external act, four nullable fields: future_owner_id, exhausted_by, exhausted_reason and exhausted_at (the state change time of an act in state reconciliation_exhausted); the exhausted_by account is added to the resolved names; and a top-level activeMarkCount (active protection marks of the application). The travel agent's case read (core.ta_application) must not carry the exhausted reason. Owner decision: the exhausted reason (a SuperAdmin's working note, up to 1000 characters) is served to the assigned operator and the SuperAdmin.

Judge: (1) whether exhausted_at is truly the exhaustion time (is the exhausted state terminal, and can state_changed_at change after exhaustion?); (2) whether the four fields are null for every other state; (3) the count: bounded, index use, consistency with the mark already served (oldest active); (4) personal data or free text reaching a surface it should not (TA read, support views); (5) additive contract change only; (6) whether the tests are sufficient and fail without the change.

One-time review; read-only; do not modify files; do not ask questions back.

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
