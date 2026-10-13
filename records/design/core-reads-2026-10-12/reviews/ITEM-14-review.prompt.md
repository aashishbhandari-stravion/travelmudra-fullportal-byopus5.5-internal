You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: 95eb5e0 in the current repository (branch core-reads-2026-10-12; parent f309b23). Read it with `git show 95eb5e0` and surrounding code with `git show 95eb5e0:<path>`.

Change: defect fix in the catalogue values publication. The preview staleness fingerprint kept only submitted applications and hashed id, price and payment, so a draft accepted after the preview, or a change to travel dates or act and filing state, left it unchanged and the publication recorded a stale affected count. The fingerprint now covers every open application the impact preview counts (drafts and submitted): id, lifecycle, act states, filed evidence, effective price, payment status and both travel dates, in id order; the values and the declaration publication share the function. The fingerprint hashes rows the publish already reads (keyset pages of 500, with per-application loads that existed before).

Judge: (1) that the fingerprint covers exactly the set and the fields the preview counts and prices, so a stale preview is refused and an unchanged one publishes (no false preview_stale from ordering, null handling, timestamp precision or pagination boundaries); (2) both publication paths and any other caller of the function; (3) concurrency between preview, a new draft and publish; (4) cost with many open applications; (5) whether the tests are sufficient and fail without the change.

One-time review; read-only; do not modify files; do not ask questions back.

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
