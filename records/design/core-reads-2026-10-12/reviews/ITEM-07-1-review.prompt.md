You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: 894667b in the current repository (branch core-reads-2026-10-12; parent 95eb5e0). Read it with `git show 894667b` and surrounding code with `git show 894667b:<path>`.

Change: defect fix. Launch approval and scope expansion checked only the controls revision, so a head published after the SuperAdmin reviewed the launch was launched unreviewed. Both commands now accept an optional expectedOfferingRevision and, when present, compare it with the offering read under the existing offering lock, refusing stale_revision. The field is optional because contract changes are additive only and the current staff form does not post it yet (the UI lane will post _rev.offering); without it today's behaviour stays. ops.launch_offering serves offeringRevision (additive).

Judge: (1) correctness of the compare under the lock for approve and expand, including retries with the same operation key and a head published between the read and the command; (2) that an absent revision behaves exactly as before and that the seed path is unchanged; (3) whether the optional field leaves a gap that should be stated, and whether any staff form already posts _rev.offering; (4) consumers of the changed contract and binding; (5) whether the tests are sufficient and fail without the change.

One-time review; read-only; do not modify files; do not ask questions back.

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
