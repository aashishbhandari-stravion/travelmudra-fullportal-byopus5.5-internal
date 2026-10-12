# Proposals sent outside the UI revamp lane

Index of every proposal the lane sent to `output/proposals/` in the lane folder. The orchestrator routes each one.
Ranks follow PRI-20260930-01.

| ID | Date | Title | To | Kind | Rank | Status |
|---|---|---|---|---|---|---|
| P-01 | 12 Oct 2026 | Read model "imports of a travel agent across groups" (UAT-11, BU-P09 or TA-01) | Orchestrator → bulk lane (seam request) | Kind 1 projection | P1 | Routed 12 Oct 2026 (SEAM-CONTRACT §5, internal eeec0e0). Interim: BU-P09 per group, no per-group join |
| P-02 | 12 Oct 2026 | Command name and accepted time in `core.operation` (receipt CMP-08, WP-01 STOP-01) | Orchestrator | Kind 1 projection | P2 | Sent |
| P-03 | 12 Oct 2026 | `uat.py` admission control to show maintenance on `lane-ui` (V23-5) | Orchestrator (`uat.py` owner) | Tooling | P2 | Sent |
