You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: 6b9b87d in the current repository (branch core-reads-2026-10-12; parent 10916cc). Read it with `git show 6b9b87d` and surrounding code with `git show 6b9b87d:<path>`.

Change: a new read. The travel agent's case read (core.ta_application, contract zWireTaCase) gains a field launchEffects: for each existing-work action that applies to this application (by lifecycle and service mode), the effect and reason codes that launch control decides, computed by launchEffectsOf in src/modules/core/derived.ts through deps.launch.launchDecision with the same request as the control evaluator's launch stage. Only the effect and codes are served (no SuperAdmin treatment detail). A dated read-model comment and a register line in docs/verification/read-model-register.md record it.

Judge: (1) agreement with the control evaluator's launch stage for each listed action (request fields: action, lifecycle, admitted launch, travel agent account); (2) the action list per lifecycle and service mode; (3) whether the field leaks anything the travel agent must not see; (4) contract change: is a required new field additive for every consumer (UI typed page literals, support views, encoders)?; (5) cost per case read; (6) whether the tests are sufficient and fail without the change.

One-time review; read-only; do not modify files; do not ask questions back.

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
