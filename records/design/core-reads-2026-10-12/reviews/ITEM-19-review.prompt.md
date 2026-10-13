You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: ccf9659 in the current repository's object store (worker branch wave3-gate1; parent e0b978d). Read it with `git show ccf9659` and surrounding code with `git show ccf9659:<path>`.

Change: a Core read helper gate1Facts (src/modules/core/controls.ts) returns the recorded facts Gate 1 reads for its two exception keys, assign (assignment and reassignment) and start_operator_work (first operator work): the service payment status with entry and status revision, the active assignment, the first-work basis recorded on it, whether work started, the granted exception of the key with its expiry and the failure code of the existing freshness check, and asOf. The SuperAdmin's staff case read (core.admin_case) serves it as a nullable gate1Context; other readers get null or no field. Lane rule: recorded facts only, never a computed verdict; the three Gate 1 decision sites (the evaluator's gate stage, requireGate1AtWork in commands/assignment.ts, the grant eligibility in commands/gates.ts) stay unchanged, and a test compares the facts with the evaluator.

Judge: (1) whether each fact is exactly what the evaluator and requireGate1AtWork read (keys, the assignment, the exception selection, the freshness inputs: the helper passes empty acts and readiness to exceptionFreshness; is that what the gate stage passes for Gate 1?); (2) whether any field reads as a verdict or can mislead (for example an exception shown usable while the evaluator refuses it, or reassignment); (3) authorization and audience: SuperAdmin only, support views; (4) bounded reads and cost per case read; (5) additive contract change only; (6) whether the tests are sufficient and fail without the change.

One-time review; read-only; do not modify files; do not ask questions back.

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
