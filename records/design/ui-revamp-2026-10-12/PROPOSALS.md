# Proposals sent outside the UI revamp lane

Index of every proposal the lane sent to `output/proposals/` in the lane folder. The orchestrator routes each one.
Ranks follow PRI-20260930-01.

| ID | Date | Title | To | Kind | Rank | Status |
|---|---|---|---|---|---|---|
| P-01 | 12 Oct 2026 | Read model "imports of a travel agent across groups" (UAT-11, BU-P09 or TA-01) | Orchestrator → bulk lane (seam request) | Kind 1 projection | P1 | Routed 12 Oct 2026 (SEAM-CONTRACT §5, internal eeec0e0). Interim: BU-P09 per group, no per-group join |
| P-02 | 12 Oct 2026 | Command name and accepted time in `core.operation` (receipt CMP-08, WP-01 STOP-01) | Orchestrator | Kind 1 projection | P2 | Parked as P2 by the orchestrator (SEAM §5, internal 522328f); build without the two facts |
| P-03 | 12 Oct 2026 | `uat.py` admission control to show maintenance on `lane-ui` (V23-5) | Orchestrator (`uat.py` owner) | Tooling | P2 | Parked as P2 by the orchestrator; V23 proven by test |
| P-04 | 12 Oct 2026 | Sign-in code request with a mixed-case address fails on identical replay (WP-01 review R-03) | Orchestrator (`src/core-api/`) | Defect fix in a binding | P1 | With Max (orchestrator recommends a focused fix on main after the first integration); interim A-03 stays |
| P-05 | 12 Oct 2026 | Declared eligibility and promise in the TA offering display (WP-02 STOP-W02-01) | Orchestrator | Kind 1 projection (criterion point 2 noted) | P1 | With Max as an exception request (orchestrator recommends granting it with an ownership grant to the UI lane for the display query and its binding); interim on TA-03 stays |
| P-06 | 12 Oct 2026 | Launch/expansion do not check the reviewed offering revision; launch-plan replay changes after a head update (WP-02 review R-01, R-10) | Orchestrator | Defect fixes in command guards and a binding | P1 | With Max (orchestrator recommends one focused fix on main now, reproduction first); interim stays |
