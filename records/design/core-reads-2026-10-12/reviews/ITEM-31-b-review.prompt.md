You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: 14f3fa7 on branch price-after-publication-tests in the current repository (parent 03abf9a). Read it with `git show 14f3fa7` and surrounding code with `git show 14f3fa7:<path>`.

Context: tests only, no product change. Proposal /home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/inputs/proposals/K2-P21-2-price-fixed-by-payment.md, §12 and the §9 rows T-B1 and T-B2 (lines 456-457). The owner's direction: applications added after a catalogue price change are quoted at the price current at their creation. T-B1 proves it for an individual draft. T-B2 pins today's rule that each bulk intake attempt has one applicable baseline (with drafts policy continue_current a draft created after a publication keeps the attempt's older price); whether that rule should change is an open owner question, and the test says so. Worker deviation: the two bulk scenarios run in sequence on the one offering priced 3,500, so the second quotes 4,500.

Judge: (1) each test proves what its description says against the real product path (no fixture shortcut that hides the rule); (2) each test would fail if the rule it covers broke (the worker's mutations: the submission price check at submission.ts:144; the draft-policy handling at impact-recheck.ts:226); (3) the tests are isolated (state left behind for later tests, shared offering prices, ordering); (4) the T-B2 comment states the open question accurately; (5) any gap against the proposal rows.

One-time review; read-only; do not modify files; do not ask questions back.

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 350 words.
