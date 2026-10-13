You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: baa00e8 in the current repository's object store (worker branch wave3-gate1; parent ccf9659, which added the Gate 1 facts helper gate1Facts). Read it with `git show baa00e8` and surrounding code with `git show baa00e8:<path>`.

Change: core.admin_queue gains the kind first_work_gate1, a display-only SuperAdmin queue: candidates from Core's tables (open applications, draft or submitted with no outcome, an active assignment, no recorded first-work Gate 1 basis, no work step), oldest assignment first, at most 200 candidates scanned; a candidate is a row when gate1Facts shows no payment received and no usable exception for first work. Rows carry the facts (assignment, exception id and failure code), not a verdict. Every kind of core.admin_queue now answers asOf and truncated (for the existing kinds, one more row than the limit is read). queueOf gains a limit parameter (default 200).

Judge: (1) whether queue membership matches what the evaluator would block for first work (no drift: the same predicates as the gate stage and requireGate1AtWork), and whether rows can mislead; (2) truncated: set exactly when more candidates exist than scanned, for every kind; the existing kinds' order and limit unchanged otherwise; (3) cost: per-candidate reads (up to 200 x the helper), the SuperAdmin navigation count calling the queue; (4) authorization (SuperAdmin only; travel agent and operator refused) and that unknown kinds cannot fall into another branch; (5) additive contract change (required asOf and truncated on the output: compatible within a matched release?); (6) whether the tests are sufficient and fail without the change.

One-time review; read-only; do not modify files; do not ask questions back.

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
