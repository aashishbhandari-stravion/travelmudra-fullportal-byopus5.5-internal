# Core lane core-reads-2026-10-12: closure record (14 Oct 2026)

The lane stopped building on the orchestrator's instruction (OD-X26, 14 Oct 2026). The lane clone and the `lane-max`
installation stay until Max names their cleanup.

## 1. Final state

- Lane branch `core-reads-2026-10-12` head `dfbafaa` (the ITEM-24 R4 test fix, on `a1cc0a9`). `npm run check` at `dfbafaa`: typecheck and lint clean; 2648 of 2649; the one failure is the timing test `test/intake/source-structural.test.ts:51` (alone 2 of 2, with the originals register file 8 of 8).
- `lane-max` runs `dfbafaa`: `uat.py deploy`, release `rel_16JXFWD39JAW92WHRQ0ZN2GMBK`, 14 Oct 2026; no migration; data and accounts kept.
- Integration on main (orchestrator): wave 2 as `2b468d9`, wave 3 as `b400cae`, the Kind 2 package merged (id in the
  orchestrator's log); `dfbafaa` follows.
- Held branches (never on the lane branch; fetched by the orchestrator as lane refs):
  - `held/disclosure-correction` at `29ee313` (ITEM-05: `b6f7833`, `2bcc751`, `277ccf4`, `29ee313`). Waits for Point D
    (the "no replacement owed" decision), which waits for Max's Q-1 to Q-3; R ships only with D and D's new schema head.
  - `held/gate-exception-evidence` at `6a39fd3` (ITEM-32: `3265989`, `6a39fd3`; migration 1190). Waits for the UI lane's
    two grant forms; it lands with them in one integration (D-18).

## 2. Commit id map (worker or earlier id to lane id)

| Item | Lane id | Earlier id(s) | Why it changed |
|---|---|---|---|
| ITEM-01 | `b7d0b0f` | `4b4dc3e` (amended from `9c207a7`) | reword |
| ITEM-02 | `82ea904`, `1bec743`, `4347d83` | `100227f`, `88a1174`, `e41d64f` | rebased after the ITEM-01 reword |
| ITEM-03 | `6ad592e`; `e4ffed9` | `d2067af` | rebased after the ITEM-01 reword |
| ITEM-06 | `b3519e9` | `510718a` | cherry-pick |
| ITEM-13 | `8387ecc` | `64a9ce0` | cherry-pick, amended |
| ITEM-11 | `c9268b0` | `35df76c` | cherry-pick |
| ITEM-12 | `06193af` | `4013706` | cherry-pick |
| ITEM-28 | `5af3128` | `7dff0b2` | cherry-pick |
| ITEM-27 | `144f18a` | `fdc485b` | cherry-pick |
| ITEM-26 | `7ad52b2` | `aef35ad` | cherry-pick |
| ITEM-08 | `f1a2a2d` | `263dce9` | cherry-pick |
| ITEM-09 | `7eb943a` | `3ae88e6` | cherry-pick |
| ITEM-15 | `cdbf29b` | `0e130d1` | cherry-pick |
| ITEM-24 | `f309b23`; `60fd311` | `b32f0b5`; `86b403e` | cherry-pick |
| ITEM-14 | `95eb5e0` | `dfca5ff` | cherry-pick, message amended |
| ITEM-07 | `894667b`, `5779060` | `f5281cf`, `d8f8636` | cherry-pick |
| ITEM-10 | `05d7b46`, `da20fd7`, `10916cc`; `3a81652` | `621e0e1` (amended for D-14), `74cc1d9`, `155dc6d`; `e0b978d` | cherry-pick; `e0b978d` amended to `3a81652` (value-import cycle) |
| ITEM-25 | `6b9b87d`, `96bcf5d` | `e864a6f`, `1c5d365` | cherry-pick; `96bcf5d` test reordered |
| ITEM-19 | `3897d04` | `ccf9659` | cherry-pick |
| ITEM-20 | `6b97250` | `baa00e8` | cherry-pick |
| ITEM-21 | `bb772e6`; `fdd9f03` | `8c73b60`; `f9c1da4` | cherry-pick |
| ITEM-16 | `5ff0553` | `168973f` | cherry-pick, conflicts resolved |
| ITEM-18 | `da8d14b` | `504bbfb` | cherry-pick, conflict resolved |
| ITEM-22 | `1793248` | `7b3c7a6` | cherry-pick, conflict resolved |
| ITEM-17 | `03abf9a` | `107d47b` | cherry-pick |
| ITEM-30 | `bf2158d`; `b21f3ff` | same | fast-forward |
| ITEM-31 (b) | `acd666e`; `a1cc0a9` | `14f3fa7`; `20b525b` | cherry-pick |
| ITEM-24 R4 fix | `dfbafaa` | none | committed on the lane branch |
| ITEM-32 (held) | `3265989`; `6a39fd3` | `172a97b` (on `e0b978d`), `475a501` (rebased on `3a81652`) | rebase; reword (stale test clause) |
| ITEM-05 (held) | `b6f7833`, `2bcc751`; `277ccf4`, `29ee313` | `2b5a93e`, `127c54b` (on `e0b978d`) | rebase |

ITEM-04 `5f5e26b` and ITEM-33 `b26d2a5` never changed. The worker branches were deleted on 14 Oct 2026 (their last ids:
wave2-custody `b32f0b5`, wave2-impact `1c5d365`, wave2-launch `d8f8636`, wave2-originals-r02 `86b403e`, wave2-payments
`3ae88e6`, wave2-transitions `155dc6d`, wave3-assign `504bbfb`, wave3-disclosure `127c54b`, wave3-gate1 `baa00e8`,
wave3-gatebasis `f9c1da4`, wave3-reads `107d47b`, wave3-integration `03abf9a`, kind2-integration `a1cc0a9`,
outcome-correction-notice `b21f3ff`, price-after-publication-tests `20b525b`); every patch is on the lane branch or a
held branch under the ids above.

## 3. Waiting for Max

| Item | Open | Record |
|---|---|---|
| ITEM-29 | `correctionId` wiring waits for K2-P21-2 Q2 (scope authority) | PLAN §3 |
| ITEM-05 | Point D, S, G: Q-1 (SuperAdmin may record), Q-2 (authority rule and shape), Q-3 (refuse when a replacement is owed); Q-4 census and Q-5 release rule confirmations (built as stated) | ITEM-05.md |
| ITEM-30 | Point H (history line; Q-N3); Q-N2 (1 + P notices), Q-N4 (separate vs bulk decisions), Q-N5 (dependents in the notice) | ITEM-30.md |
| ITEM-31 | part (a): Q1 release reconciliation (RD-1 vs RD-2; kernel beyond vocabulary), Q2 scope authority (SC-1), Q4 "recorded payment"; Q3 B16 vs creation time | ITEM-31.md |
| ITEM-21 | may the assigned operator see the payment entry behind Gate 1 and Gate 2 | ITEM-21.md |
| ITEM-20 | the P-12 §11.1 pending-answer substitution (after-lanes A4) | ITEM-20.md |
| ITEM-33 | R-01 to R-03 (D-07, WITH MAX; R-01, R-02 recommended to the UI lane) | ITEM-33.md |
| ITEM-03 | the restore drill on `lane-max` (D-04, D-05), after the UI lane renders the `filing` field | ITEM-03.md |

P2 list: `P2-LIST.md`. UI-lane list: `UI-LANE-LIST.md`.

## 4. Lane numbers

- Items: 33 in the register. Done on the lane branch: ITEM-01 to 04, 06 to 28 (ITEM-23 handed to the UI lane), 30 (Point
  N), 31 (part (b)), 33. Held: ITEM-05, ITEM-32. Waiting: ITEM-29.
- Workers (subagents, one worktree each, at most three at once): W1 to W22, plus six read-only surveys (wave 1; wave 2 A,
  B; wave 3 C, D; S30). The P0 package (ITEM-01 to 04, 33) was built in the main tree before the waves (sizes not
  recorded). Sizes (context at return): W1 100k, W2 181k, W3 153k, W4 196k, W5 159k, W6 208k, W7 232k, W8 250k, W9 105k,
  W10 225k, W11 239k, W12 162k, W13 281k, W14 206k, W15 298k, W16 not recorded, W17 178k, W18 265k, W19 215k, W20 181k,
  W21 180k, W22 59k, S30 272k. Two breaches of the 275k partial-return rule (W13, W15), logged; ITEM-30 and 31 were then
  split into survey and implementation workers.
- Independent reviews: 35 Codex runs (`gpt-6.1-sol` high, read-only, one per item or part), no re-review.
- Architect chat compactions: 6.
- Defects found by review: 0 P0; about 25 P1 (about 14 fixed in follow-up commits, 7 parked as P2 by Max or the
  orchestrator, 3 handed to the UI lane, 1 to the restore drill); about 43 P2, parked.
- Defects found by checks and tests, not by review: (1) the value-import cycle of `e0b978d` (`test/static`, at
  integration; amended to `3a81652`; rule since: `test/static` on every branch before integration); (2) the originals
  register R4 tie at the 500-row cap (full check at `a1cc0a9`; fixed in `dfbafaa`); (3) the ITEM-25 B test order against
  ITEM-10 (c) (integration run; reordered in `96bcf5d`); (4) a closed assisted draft that looped back to
  `offering_withdrawn` (the ITEM-10 (d) follow-up's own test; fixed before commit); (5) a nondeterministic race in the
  ITEM-05 follow-up test (repeat runs; fixed before commit); (6) a wire `ref` pattern that turned a refusal into a server
  error (ITEM-02 test U1; fixed in the item). Pre-existing, not lane code: three intake timing tests fail under load.

## 5. Lane folders outside the repositories (to dispose at closure; Max names the cleanup)

| Folder | Holds | Disposition |
|---|---|---|
| `research/evidence/` | fails-first transcripts, mutation logs | promoted: every file copied to `evidence/` here |
| `research/reviews/*.md` (results), `*.prompt.md` | Codex review results and prompts | promoted: copied to `reviews/` here |
| `research/reviews/*.log` | 35 raw Codex session logs (about 14 MB) | to archive (tarball with SHA-256 manifest) if Max wants the raw transcripts; else delete. The results and prompts are promoted |
| `research/briefs/` | worker briefs, survey results, package messages | promoted: copied to `briefs/` here |
| `research/designs/` | ITEM-05 design note and walk-throughs | promoted (`ITEM-05-design.md`, `ITEM-05-WALKTHROUGH.md`, `ITEM-32-WALKTHROUGH.md`) |
| `research/inputs/` | copies of the UI lane's proposals and reviews, `MANIFEST.sha256` (SHA-256 of the manifest `80e8ecac662043500b45067d67001145806b5c7155c6df83b77b20f70e1ce4a3`) | delete: the source of truth is the UI lane's output; the manifest hash is recorded here |
| `research/patches/`, `research/questions/`, `output/proposals/` | empty | delete |
| `state/RESUME.md` | the lane chat's working state | delete: decisions are in PLAN.md, the records and this file |
| `hooks/context-guard.py` | the lane's context guard hook | delete with the lane (lane-local tooling) |
| `wt/` | empty after the last check worktree is removed | delete |
| `START-HERE.md`, `workspace.json` | lane set-up | delete with the lane clone |
