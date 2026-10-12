# WP-02 acceptance checklist: offering admission minimum

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-02 Offering admission minimum (UI-PLAN §12.1; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 12 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3. Not run. Input to the UX design review and the independent review. |
| Product base | lane branch `ui-revamp-2026-10-12` at 102e4c9 |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (travel-agent pages TA-02, TA-03); staff http://127.0.0.1:4652 (SuperAdmin pages SA-05, SA-06) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 12 October 2026

Source: the independent design review (lane `research/reviews/WP-02-design-review.md`, findings R-06, R-07, R-09
to R-14) and the architect's decisions and amendments in `WP-02.md` §3 and §4.1 (B-01 to B-14), which bind. Only
the rows and sections below changed; every other row keeps its text. Where an unchanged row names the old proof
data (Synthetica Gamma, `SYQ`, `syq_tourist_evisa`), the mapping in §0.2 applies.

| Row | Change | Reason |
|---|---|---|
| §0.2 | Personas with unique run suffixes; pages and paths of the design; rules B-06, B-07, B-08, B-14; one proof recipe; seeded rows by service code; checks by delta; mapping of old proof names in unchanged rows; pass rule with the explicitly deferred items (P-05, P-06, B-09, P-02) | R-06, R-07, R-08, R-13, R-14; B-04 to B-10, B-13, B-14 |
| §0.3 | Service codes added to identify seeded rows; prices on TA-03 only | R-13; B-06 |
| A03 | In-page country index, not a persistent filter | R-12; D-W02-06 |
| A04 | S3 does not apply; a hand-made query string is ignored | R-12; D-W02-06 |
| A10 | Price check on TA-03 only; TA-02 returns no price | R-12; B-06 |
| A19 | Interim product-wide scope text; offering-specific facts deferred to P-05 | `WP-02.md` §3 STOP-W02-01; B-04, B-05 |
| A20, A21 | Moved to §2.13, deferred to WP-03; WP-02 checks the interim link of A20 only | R-09; B-09 |
| A25 | Only launch-required items block selectability; action-scoped items show a boundary only | R-11 |
| A53, A60 | Previews show only the facts `cat.admin_preview` returns | R-06; B-06 |
| A70 | The unavailable launch page has no form; refusal proven by a hand-made post; plan completeness per B-07 | R-07, R-12; B-07 |
| A76 | Named audience is a text field with a reference list, not a filtered chooser | R-12; D-W02-12 |
| A79 | Expansion only from a named audience; no form once the audience is every active travel agent | R-11 |
| A81 | Launch-control effects as Core returns them; not a permission for a travel agent | R-11 |
| A83 | Only the columns the list returns; 200-row cap without a total | R-06, R-14; B-06, B-14 |
| A90 | The create form cannot show the audit state; refusal on send; disabled triggers on the account page | R-06; B-06 |
| A100 | Identity commands answer `stale_revision`; the browser offers only valid actions | R-11 |
| A105 | Replay-after-head-change case added, expected to fail until P-06 | R-10; B-10 |
| A117 | Native disclosures and full-screen task pages: no Escape requirement | R-12 |
| A123 | axe state after the in-page country link | R-12 |
| §3 Part A | Seeded rows by service code; baseline counts for deltas | R-13; B-13 |
| §3 Part D | New offering in Synthetica with a unique code per run; no country creation or listing change on `lane-ui`; plan completeness per B-07 | R-07, R-13; B-07, B-13; `WP-02.md` §3 Q-W02-04 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1, §2.3, §3.1 step 1, §3.2 (Preparation-only, Third-party filed, Dependency, Withdrawn/suspended offering), §3.3, §4.1, §4.2 Services, §4.4, §6.1, §6.2, §6.3, §7.3, §7.4, §12 V01 V20 V21 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B01, B02, B05, B06, B07, B08, B10, B11, B15, B17, B32, B44 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a…; internal a08eea4 | §A (AD-05, AD-13), §1, §2, §3.2 TA-02 TA-03, §3.4 SA-05 SA-06 SA-09, §4.1, §4.2, §5.2, §5.4, §6, §7, §10, §11, §12.1, §13 |
| CM | `../ui-plan-from-specs-2026-10-10/COVERAGE-MATRIX.md` | internal a08eea4 | §2 rows V01, V20, V21 |
| DC | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9…; internal a08eea4 | §1.3 (OC-07, OC-10), §1.6 |
| CC | `COMMAND-COVERAGE.md` (this folder) | internal a08eea4 | §3 (20 WP-02 rows), §5.1, §5.3 |
| LP | `PLAN.md` (this folder) | internal a08eea4 | §4 (LD-02, LD-03, LD-07, LD-08, LD-11, LD-12), §7 |
| W1 | `WP-01.md` §3 and `WP-01-design.md` §7 (this folder) | internal a08eea4 | Shared components: receipt without accepted time (P-02), CMP-10 boundary notice, CMP-12 freshness in lag form, CMP-13, CMP-14 |
| TR | `../../uat/2026-10-12-uat-pass1-triage.md` | internal a08eea4 | §3.1 Q-3 (UAT-07, services per group) |
| Code | lane repository | 102e4c9 | `catalogue/synthetic/catalogue.json`; `src/cli/commands/seed.ts`, `seed-catalogue.ts`; `src/modules/operations/commands/seed.ts`, `launch.ts`; `src/modules/operations/launch/readiness.ts`; `src/modules/catalogue/commands/*.ts`, `display.ts`; `src/modules/identity/commands/accounts.ts`, `elevation.ts`; `src/apps/shared/ta-catalogue.ts`; `scripts/uat/uat.py` step 11; `test/integration/catalogue-seed.test.ts`, `launch-control.test.ts` |

### 0.2 Conventions

- **Personas.** TA: `syn-ta-1`, `syn-ta-2`, `syn-ta-3` (`@synthetic.test`). SuperAdmin: `superadmin-1` and
  `superadmin-2` stand for `syn-superadmin-1` and `syn-superadmin-2`; every two-SuperAdmin step uses these two.
  Operator: `syn-operator-1`, `syn-operator-3`. New accounts made during the proof: `wp02-ta-<suffix>`,
  `wp02-sa-<suffix>`, `wp02-decline-<suffix>` (`@synthetic.test`). `<suffix>` is unique per run (for example
  `r1013a`: the run date and a letter) and the run record keeps it. TA participant: a person, not the harness (V01
  Part B). Keyboard-only user. Screen-reader user. Phone user (390 px wide).
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in, also for the new accounts of the proof.
  Nobody prints, logs, screenshots or stores a code, an enrolment code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary sentence form is mandatory: "[Action] is unavailable until [policy or evidence] is [approved /
  recorded]. Owner: [owner or 'not yet named']."
- **Prices.** TA-03 shows the published price in rupees without paise ("₹3,500" for 350000 paise). TA-02 shows no
  price: its read model returns none (B-06).
- **Viewports.** Wide 1440 × 900. Phone 390 × 844. Reflow checks add 320 px and 1280 px at 400% zoom.
- **Times.** Every time on a page carries "IST" (AD-10, CR-06). Freshness follows LD-08: the WP-02 read models are
  authoritative reads, so pages show "Read at [time] IST".
- **Paths and pages (design §1.2; LD-03).** SA-05a `/admin/catalogue`; SA-05b `/admin/catalogue/offerings/:id`;
  SA-05c `/admin/catalogue/declarations/:id`; SA-05d `/admin/catalogue/baselines/:id`; SA-05e publication decision
  `/admin/catalogue/previews/:id` (both publish forms are here); SA-05f `/admin/catalogue/publications/:id`; SA-05g
  `/admin/launch`; SA-05h `/admin/catalogue/offerings/:id/launch`; SA-05i launch plan `…/launch/plan` (new); SA-05j
  launch decision `…/launch/decide/launch` and `…/launch/decide/expand` (new); SA-06a `/admin/accounts`; SA-06b
  `/admin/accounts/new`; SA-06c `/admin/accounts/:id`; SA-06d `/admin/accounts/:id/duties`; TA-02 `/ta/catalogue`;
  TA-03 `/ta/catalogue/:offeringId`; operator Services `/ops/catalogue`, `/ops/catalogue/offerings/:id`. The second
  SuperAdmin approves on the existing page `/admin/elevations` until WP-15 (`WP-02.md` §3, Q-W02-03).
- **Facts the read models return (B-06).** A page shows only facts that its read model returns. WP-02 does not
  show: version numbers, governing before and after identities and unknown applicability on the preview; the audit
  state on the create-account form; request actor and second-approval details on the account list; the earlier
  value that a stale form showed (a stale comparison shows the unsent input beside the current values). A fact read
  after an operation is labelled "Current" (B-02). The WP-02 record lists each gap. No row requires these facts.
- **Plan completeness (B-07).** "Complete" shows only when the current readiness says that the plan is complete
  for the current head. A stored plan's completeness is labelled "Recorded when the plan was saved".
- **Operator Services (B-08).** `/ops/catalogue` and `/ops/catalogue/offerings/:id` show the published values and
  the read-only explanation, with no admission conclusion for travel agents: neither "Available" nor "Not
  available" appears. Proven by the U1 unit test (design §8.1) and once on `lane-ui` as `syn-operator-1`; the run
  record reports it with the pass rule.
- **Account list (B-14).** SA-06a shows at most 200 accounts, says that the list may be incomplete at that size and
  claims no total.
- **Proof recipe (B-13; `WP-02.md` §3, Q-W02-04).** One recipe. Part D creates one new synthetic offering per run in
  the existing country Synthetica (SYN): service code `wp02_<suffix>`, title "WP-02 proof <suffix>", mode
  TravelMudra files. Part E creates the `wp02-*` accounts with the same suffix. The proof creates no country and
  changes no listing on `lane-ui`: country creation and listing changes (A36, A38, A39, A40) are proven by system
  test only (`T`). A35 and A37 stay `L` because they create nothing. Seeded rows are identified by their service
  codes (§0.3), never by position or by total. Rows of earlier runs (service codes `wp02_*`, accounts `wp02-*`) are
  excluded from every check. Every count check compares with the values recorded in Part A step A3 (a delta), not
  with a total.
- **Old proof names in unchanged rows.** Where an unchanged row names "Synthetica Gamma", `SYQ`, `syq_tourist_evisa`
  or "SYQ Tourist e-visa (WP-02 proof)", read the country Synthetica and the run's proof offering `wp02_<suffix>`.
  A31's "Synthetica Gamma group of `syn-ta-2`" is the Synthetica group of `syn-ta-2` made in proof step D8. A06's "no
  country Synthetica Gamma" reads "no row of the proof offering". A36 and A38 to A40 are `T` (above). A41's
  country, service code and title are the recipe values.
- **Pass rule.** WP-02 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V01 proof (section 3) passes, except the
  explicitly deferred items below. The run record lists each of them as "Deferred" with its reference, not as
  "Fail":
  - P-05 (eligibility, promise, travel-date rules, dependencies and the declared authority label; needs Max's
    exception, B-04, B-05): the offering-specific part of A19 (WP-02 checks the interim text) and the provider
    naming of A17 (WP-02 shows the mode label only).
  - P-06 (B-01, B-10): the launch and expansion revision guard against a changed head (no row requires it; SA-05j
    shows the head version and the plan version under review and posts every revision that the form carries) and
    the launch-plan replay after a head change (A105 case (c), expected to fail until P-06).
  - B-09: A20 and A21, deferred to WP-03 (§2.13). WP-02 checks the interim link of A20 only.
  - P-02: the accepted time in receipts (A103).
  A failed item that is not deferred becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01 is integrated (shell, CMP-07, CMP-08, CMP-10, CMP-12, CMP-13, CMP-14). The
  installation holds the synthetic seed of §0.3. `syn-ta-1` holds at least one group in Synthetica (WP-01
  precondition). `syn-operator-3` holds one assigned application (assigned through the existing SuperAdmin pages,
  LD-02); if it does not, WP02-A96 runs by test. The run record keeps identifiers (suffix, offering, account and
  operation references) in the internal record only.
- **Data hygiene.** The proof MUST NOT change the business values, launch scope or listing of a seeded offering or
  country, and MUST NOT suspend a seeded SuperAdmin. Its own offering and accounts stay on `lane-ui` (no delete
  command exists) and are excluded from later runs by their codes.

### 0.3 Synthetic catalogue on `lane-ui` (from the code at 102e4c9)

`uat.py up` step 11 runs `tm seed synthetic`: the synthetic accounts, then the catalogue of
`catalogue/synthetic/catalogue.json`, then a complete launch plan and a launch for all active travel agents for each
of the 9 offerings. An offering whose launch is refused stays unlaunched (`src/modules/operations/commands/seed.ts`;
`test/integration/catalogue-seed.test.ts` "leaves the unapproved provider route unlaunched"). Part A of the proof
confirms these facts on `lane-ui` before anything else. The seeded rows are identified by the service codes below.
Rows that a proof run adds carry the service code `wp02_<suffix>` and are not seeded rows.

Countries: Synthetica (code SYN, listed), Synthetica Beta (code SYX, listed).

| # | Offering title | Service code | Country | Mode (label today) | Price (shown on TA-03 only) | Government fee | Documents | Other declared facts | Launch |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SYN Tourist e-visa | `syn_tourist_evisa` | Synthetica | TravelMudra files | ₹3,500 | TravelMudra pays, separate act; price–fee relation not selected | Passport: required, PDF/JPEG/PNG, 5 MB. Photograph: required, JPEG/PNG, 2 MB | Tourism; submit 3 to 90 days before travel | All active TAs |
| 2 | SYN Business visa (paper) | `syn_business_paper` | Synthetica | TravelMudra files | ₹5,200 | As 1 | As 1 | Business; originals held (passport); return policy not decided (boundary) | All active TAs |
| 3 | SYN e-visa, fee paid with submission | `syn_evisa_fee_with_submission` | Synthetica | TravelMudra files | ₹3,600 | TravelMudra pays with the submission | As 1 | Tourism | All active TAs |
| 4 | SYN Paper visa with original return | `syn_paper_return` | Synthetica | TravelMudra files | ₹5,400 | As 1 | As 1 | Originals held; synthetic approved return policy | All active TAs |
| 5 | SYN Tourist visa preparation | `syn_tourist_prep` | Synthetica | Preparation only — you file | ₹1,800 | Not handled by TravelMudra | As 1, plus Travel itinerary: optional, PDF, 5 MB | Withdrawal cut-off not decided (boundary) | All active TAs |
| 6 | SYN Tourist visa via provider | `syn_tourist_provider` | Synthetica | Filed by a declared provider | ₹4,100 | Not handled by TravelMudra | As 1 | Approved synthetic provider route | All active TAs |
| 7 | SYN Provider visa (route not approved) | `syn_tourist_provider_unapproved` | Synthetica | Filed by a declared provider | ₹4,100 | Not handled by TravelMudra | As 1 | Provider route not approved (parked) | **Not launched** (`provider_route_unapproved`) |
| 8 | SYN Transit e-visa (needs tourist e-visa) | `syn_transit_dependent` | Synthetica | TravelMudra files | ₹3,000 | As 1 | As 1 | Needs an issued SYN Tourist e-visa of the same applicant | All active TAs |
| 9 | SYX Tourist e-visa | `syx_tourist_evisa` | Synthetica Beta | TravelMudra files | ₹3,300 | As 1 | As 1 | Tourism | All active TAs |

Every seeded offering: estimate 5 to 12 calendar days with the note "SYN synthetic estimate"; three process steps;
display note "SYN synthetic offering for local testing only."; cancellation not declared (boundary). The
unavailable route of V01 is offering 7.

## 1. Scope

### 1.1 Pages

| Page | Host and path (existing paths stay, LD-03) | Part in WP-02 |
|---|---|---|
| TA-02 Services list | 4650 `/ta/catalogue` (rail "Services") | Whole page |
| TA-03 Service detail | 4650 `/ta/catalogue/:offeringId` | Whole page |
| Add-applicants step (existing page, LD-02) | 4650 `/ta/groups/:groupId/intake/new` | Only the V01 check that an unavailable route creates no draft. The page itself is WP-03 and WP-04. |
| SA-05 Offerings & launch | 4652 `/admin/catalogue`, `/admin/catalogue/offerings/:id`, `/declarations/:id`, `/baselines/:id`, `/previews/:id`, `/publications/:id`, `/offerings/:id/launch`, `/admin/launch` | Offering list; countries; definition and binding; effective business values; publication impact preview; readiness evidence; launch and expansion |
| SA-06 Accounts & access | 4652 `/admin/accounts`, `/admin/accounts/new`, `/admin/accounts/:id`, `/admin/accounts/:id/duties` | Account list; create account; approve, decline, activate, suspend, restore |

Read models: Offering catalogue (`cat.selectable_offerings`, `cat.offering_display`), Offering administration,
Accounts and grants.

### 1.2 Command coverage (20 commands, CC §5.1)

UI-PLAN §12.1 names five commands. They map to the 20 served commands as follows: Publish offering values =
`cat.edit_baseline`, `cat.preview_baseline`, `cat.publish_baseline`; Record structural approval =
`cat.record_owner_approval`; Launch offering = `ops.record_launch_plan`, `ops.approve_launch`,
`ops.expand_launch_scope`; Create account = `iam.create_account`; Change account status = `iam.approve_account`,
`iam.decline_account`, `iam.activate_account`, `iam.suspend_account`, `iam.restore_account`. The catalogue identity and
structure commands complete the lifecycle that admission needs (CC §5.1 observation).

| # | Command | Route id today | SA page part | Items |
|---|---|---|---|---|
| 1 | `cat.create_country` | `admin.catalogue.country_create` | SA-05 countries | A35, A36, A37 |
| 2 | `cat.set_country_listing` | `admin.catalogue.country_listing` | SA-05 countries | A38, A39, A40 |
| 3 | `cat.create_offering` | `admin.catalogue.offering_create` | SA-05 offering list | A41, A42 |
| 4 | `cat.draft_declaration` | `admin.catalogue.declaration_draft` | Definition and binding | A44, A45, A46 |
| 5 | `cat.record_owner_approval` | `admin.catalogue.owner_approval` | Definition and binding | A47, A48, A49, A50 |
| 6 | `cat.bind_declaration` | `admin.catalogue.bind` | Definition and binding | A51, A52 |
| 7 | `cat.preview_declaration` | `admin.catalogue.declaration_preview` | Publication impact preview | A53, A55 |
| 8 | `cat.publish_declaration` | `admin.catalogue.declaration_publish` | Definition and binding | A54, A55 |
| 9 | `cat.edit_baseline` | `admin.catalogue.baseline_create`, `admin.catalogue.baseline_edit` | Effective business values | A56, A57, A58, A59 |
| 10 | `cat.preview_baseline` | `admin.catalogue.baseline_preview` | Publication impact preview | A60, A62 |
| 11 | `cat.publish_baseline` | `admin.catalogue.baseline_publish` | Effective business values | A61, A62, A63, A64, A65, A66 |
| 12 | `ops.record_launch_plan` | `admin.launch.plan` | Readiness evidence | A67, A68, A69 |
| 13 | `ops.approve_launch` | `admin.launch.approve` | Launch and admission | A70 to A78 |
| 14 | `ops.expand_launch_scope` | `admin.launch.expand` | Launch and admission | A79, A80 |
| 15 | `iam.create_account` | `admin.accounts.create` | SA-06 create | A84 to A90 |
| 16 | `iam.approve_account` | `admin.accounts.approve` | SA-06 account detail | A88 (refused for a SuperAdmin), A91, A99 |
| 17 | `iam.decline_account` | `admin.accounts.decline` | SA-06 account detail | A93, A99 |
| 18 | `iam.activate_account` | `admin.accounts.activate` | SA-06 account detail | A88, A92 |
| 19 | `iam.suspend_account` | `admin.accounts.suspend` | SA-06 account detail | A94, A96, A97, A102 |
| 20 | `iam.restore_account` | `admin.accounts.restore` | SA-06 account detail | A95, A98, A100 |

All 20 also: A103 (receipt), A104 (unresolved, by test), A105 (same operation key, by test), A107 (refusal text).

Commands outside WP-02 that the proof touches: `iam.approve_elevation` (WP-15) completes A88 and A98 (Q-01).
`ops.suspend_offering` and `ops.lift_suspension` (WP-13) are proof set-up only in V01 step C6 (Q-04).

### 1.3 State coverage

S1 (loading) does not apply: every WP-02 page is server-rendered and no region loads after the page. If the design
adds a region that loads later, S1 applies and the design names its item. S5 (stale) does not apply to the WP-02
read models: each is an authoritative read ("Read at [time] IST", LD-08); the audit-record degradation of SA-06 is
listed as S5 because it changes what the page offers.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-02 | S2 A05; S3 A04; S4 A07; S6 not applicable (own scope; offerings out of scope are absent, A06); S7 A07 | — | — | — | — | — |
| TA-03 | S4 A25; S6 A22, A23; S7 as WP01-A80; not selectable A24 | — | — | — | — | — |
| Add-applicants step (V01 check only) | — | — | A30, A31, A32 | — | — | — |
| SA-05 offering list and countries | S2 A33; S3 not applicable unless the design adds filters; S4 A33; S6 A109; S7 as WP01-A80 | A35, A42 | A37, A38 | A36, A38, A39, A41 | A104 | A40 |
| SA-05 definition and binding | S6 A109 | A45, A49 | A46, A48, A50, A51, A52 | A44, A47, A51, A53, A54 | A104 | A55 |
| SA-05 effective business values and impact preview | S6 A109 | A57, A61 | A58, A62, A63, A64 | A56, A60, A61, A65 | A104 | A59 |
| SA-05 readiness evidence, launch and admission | S4 A67 (missing items); S6 A109 | A69 | A70, A73, A74, A75, A76, A77, A80 | A68, A72, A79 | A78, A104 | A73 |
| SA-06 list and create | S3 A83; S5 A90; S6 A109; S2 not applicable on `lane-ui` (seeded accounts) | A85 | A87, A88, A90 | A86, A88 | A104 | — |
| SA-06 account status | S5 A90, A102; S6 A109 | A97 | A88, A98, A100 | A91, A92, A93, A94, A95, A96, A98 | A104 | A99 |

## 2. Acceptance checklist

### 2.1 TA-02 Services list

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A01 | TA (`syn-ta-1`) | 4650 `/ta/catalogue` (rail "Services") | Sign in. Select "Services" in the rail. Read the page. | The `h1` names the page ("Services" or the same meaning). Offerings are grouped by country: Synthetica holds 7 rows and Synthetica Beta 1 row (§0.3). Each row shows country, service title, service mode in words (for example "TravelMudra files") and the availability fact in text with an icon: "Available for new applications". Each title links to TA-03. A synthetic offering carries a synthetic label. The freshness line shows "Read at [time] IST". | L | PL §3.2 TA-02, §5.2; UX §4.2; BS B01, B07; CR-08; LD-08 |
| WP02-A02 | TA (`syn-ta-1`) | TA-02 | Look for "SYN Provider visa (route not approved)". | It is never shown as available. It has no link or control that starts work. It follows the architect's answer to Q-02: absent, or shown as "Not available for new applications" with its reason. No "Information only" label appears unless the read model states that fact. | L | BS B07; PL TA-02; Q-02 |
| WP02-A03 | TA (`syn-ta-1`), keyboard user | TA-02 | Read the country index ("Countries: Synthetica · Synthetica Beta"). Select "Synthetica Beta". Press Back. Reload. | The index shows because two countries have rows. Each entry is an in-page link to its country section (`h2`). Selecting it moves to the Synthetica Beta section, and the next Tab continues from there; every section stays on the page. The address changes at most by a fragment: no filter state, no query string. Back returns to the previous position on the page. Reload shows the full list. No result count is announced, because nothing is filtered. | L | Design §3.12, D-W02-06; review R-12; AC-01 |
| WP02-A04 | TA (`syn-ta-1`); TA whose offerings are all in one country (fixture) | TA-02 | Add a query string to the address by hand (for example `?country=SYX`, then a malformed value). Reload. Render the page for the one-country TA. | S3 (no match) does not apply: TA-02 has no filter (D-W02-06). The page ignores the query string, shows the full grouped list and echoes no value; no error shows. One country: no country index; the single country section shows. | L+T | PL §1.3 S3; design §3.12, D-W02-06; review R-12; SH-R02 |
| WP02-A05 | TA that no launch includes (fixture) | TA-02 | Render the list. | S2: "No service is currently available for new applications in this scope." or the same facts. No wait-list promise, no invented country, no count. | T | UX §4.4; PL TA-02; BS B07 |
| WP02-A06 | TA (`syn-ta-1`, `syn-ta-2`) | TA-02 | After proof step D10 (proof offering launched for `syn-ta-1` only), compare the two lists. | `syn-ta-1` sees "SYQ Tourist e-visa (WP-02 proof)". `syn-ta-2` does not. Nothing on the page of `syn-ta-2` hints at it: no count, no "more services", no country Synthetica Gamma. | L | BS B07, B10 |
| WP02-A07 | TA | TA-02 when the catalogue read fails, and when one offering's facts cannot be read (fixtures) | Render the page. | Read failure: S7 with the error category and "Try again"; never the S2 text and never "0 services". Partial: readable rows show; each unreadable fact shows "Unavailable"; no unreadable offering shows as available or as not available. | T | PL §1.2 D7, §1.3 S4, S7; UX §8.3 |
| WP02-A08 | Phone user, TA | TA-02 at 390 px | View the list. Use the country filter. | Rows become cards. Each card shows title, service mode and availability before secondary data. The filter is reachable. No horizontal page scroll. | L | PL TA-02 (Mobile); AC-04, AC-21 |
| WP02-A09 | TA | TA-02 | Read all visible text. | No wait-list promise, no SLA or deadline, no support hours, no approval promise, no "Pay now", no forbidden label of §11.1. Counts name their unit. | L | UX §4.4; CR-02, CR-03, CR-07; UX §9 C13 |
| WP02-A10 | TA (`syn-ta-1`) | TA-03 and TA-02 of the proof offering | After proof step D13 (new values published), reload TA-03, then TA-02. | TA-03 shows "₹3,450" with a new "Read at" time; "₹3,300" does not show. TA-02 shows no price for any row, because its read model returns none (B-06); the row of the proof offering is otherwise unchanged. | L | BS B06; design §3.12; review R-12; B-06 |

### 2.2 TA-03 Service detail

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A11 | TA (`syn-ta-1`) | 4650 `/ta/catalogue/:offeringId` of "SYN Tourist e-visa" | Open the page from TA-02. Read it from the top. | Blocks in this order: identity (country "Synthetica", service title, service mode "TravelMudra files", who files), availability fact "Available for new applications", eligibility and inclusions (per Q-03), cost, processing estimate, required documents, process overview. One `h1` (the service title). Breadcrumb "Services / SYN Tourist e-visa". Freshness "Read at [time] IST". | L | PL §3.2 TA-03; UX §3.1 step 1, §4.1; BS B01 |
| WP02-A12 | TA | Same page, cost | Read the cost section. | Service price "₹3,500", stated as fixed for an application when the TA submits it. Government fee: TravelMudra pays it and recovers the exact government amount separately from the service price. The relation between price and fee shows as not decided, in the §11.3 form with "Owner: product owner". No sum, no "included", no zero. | L | BS B01, B17, B29; PL §11.3; §0.3 |
| WP02-A13 | TA | TA-03 of "SYN e-visa, fee paid with submission" | Read the cost section. Compare with A12. | Price "₹3,600". The fee statement says that TravelMudra pays the government fee with the submission. The text differs from A12, where the fee is a separate act. | L | BS B01; declaration `governmentFee.timing` (§0.3) |
| WP02-A14 | TA | TA-03 of "SYN Tourist e-visa", processing estimate | Read the section. | "5 to 12 calendar days", labelled an estimate, not a guarantee or a deadline. If the page states when the estimate starts, it says at submission, independently of payment. The page computes no date from today. | L | BS B17; PL §13.2 B-10; CR-03 |
| WP02-A15 | TA | Same page, required documents | Read the list. | Passport: required; PDF, JPEG, PNG; up to 5 MB. Photograph: required; JPEG, PNG; up to 2 MB (narrower than 5 MB, as declared). Each row shows the description from the published values. Sizes show in MB, not bytes. | L | BS B15; PL TA-03 |
| WP02-A16 | TA | TA-03 of "SYN Tourist visa preparation" | Read the page. Compare with A11 to A15. | The service mode says that TravelMudra prepares and the travel agent files. Price "₹1,800". TravelMudra does not handle government or provider fees. "Travel itinerary" is optional, PDF, up to 5 MB. The boundary "Withdrawing an application after submission is not available for this service." shows as a CMP-10 notice with an owner. | L | UX §3.2 (Preparation-only); BS B04, B15; PL §13.2 B-06 |
| WP02-A17 | TA | TA-03 of "SYN Tourist visa via provider" | Read identity and cost. | The service mode says that a declared provider files, not TravelMudra. The provider is named per Q-06; no invented name. Price "₹4,100". TravelMudra does not handle government or provider fees. | L | UX §3.2 (Third-party filed); BS B04; Q-06 |
| WP02-A18 | TA | TA-03 of "SYN Business visa (paper)", then each seeded offering | Read the boundary notices. | Each action-scoped item that is not supported shows one CMP-10 notice in the §11.3 form with its owner. For this offering: "Returning original documents through TravelMudra is not available for this service yet." and "Cancelling an application for this service is not available." The availability stays "Available for new applications": these boundaries concern later actions. No notice says only "This is not available at the moment." | L | BS B30, B44; PL §11.3, §13.2 B-05; CMP-10 |
| WP02-A19 | TA | TA-03 of "SYN Tourist e-visa" and of "SYN Transit e-visa (needs tourist e-visa)" | Read each page for eligibility, the service promise and the dependency. | Interim (`WP-02.md` §3, STOP-W02-01; B-04): TA-03 shows the product-wide scope: Indian ordinary-passport holders resident in India; tourism and business purposes; student, diplomatic and work visas are outside the service (or the same facts). It shows the sentence "Offering-specific conditions are not shown on this page yet." It shows no offering-specific eligibility, travel-date window, promise or dependency, and never "Not declared" for a declared fact. Deferred to P-05 (needs Max's exception to criterion point 2): offering-specific eligibility, the promise, the travel-date rules, the transit dependency and the declared authority label (B-05). Until P-05 is served, this item is "partly met" (pass rule, §0.2). | L | UX §3.1 step 1, §3.2 (Dependency), §4.1; BS B02, B22; `WP-02.md` §3; B-04, B-05; P-05 |
| WP02-A22 | TA (`syn-ta-1`) | TA-03 address of "SYN Provider visa (route not approved)" (reference from the SA-05 run record) | Open the address. | SH-02 denied, identical to not found (WP01-A74): no title, price, country or mode. No "Start an application". | L | BS B07, B10; PL §2.3 SH-R02 |
| WP02-A23 | TA (`syn-ta-2`) | TA-03 address of the proof offering while its launch includes `syn-ta-1` only | Open the address. | Same result as A22. | L | BS B07, B10 |
| WP02-A24 | TA | TA-03 of a visible offering that cannot be selected: suspended (proof offering, Q-04); withdrawn, binding missing, values incompatible (fixtures) | Open the page. | Availability "Not available for new applications". A CMP-10 notice states the specific reason (for example "TravelMudra has paused new applications for this service. Work you already started continues as TravelMudra decided."), the owner and the route ("none" where none exists). No "Start an application", no "Add applicants in bulk", no control that looks usable. Cost, estimate, documents and process still show. | L (suspended, per Q-04) + T (others) | BS B07; PL TA-03, §4.2 (Withdrawn or suspended offering); UX §3.2, §4.4 |
| WP02-A25 | TA | TA-03 with these fixtures: an undeclared or incomplete launch-required item; an undeclared action-scoped item (cancellation, withdrawal cut-off, original return); a document requirement without formats or size; an unavailable fee statement | Render each page. | Launch-required item: the offering is not selectable; TA-03 shows "Not available for new applications" with the reason that Core reports. Action-scoped item: the availability stays "Available for new applications" and TA-03 shows only the CMP-10 boundary line of that item (as A18); selectability does not change. Missing document format or size: that cell shows "Not declared", never "0 bytes" and never an empty cell. Unavailable fee statement: "Not declared." with its reason sentence. No value shows as blank, zero or a default. | T | BS B05, B07; launch classes L and A (`src/modules/catalogue/items.ts`); design §3.13 (S4), F-W02-05; review R-11 |
| WP02-A26 | TA | Every TA-03 page of §0.3 | Read all visible text. | No support hours, SLA, deadline, approval promise, "Pay now" or invented government-fee amount. The synthetic label shows. | L | CR-02, CR-03; UX §9 C13; BS B37 |
| WP02-A27 | Phone user, TA | TA-03 at 390 px | View the page. | Sections are stacked. The primary action is at the end of the identity block. The documents list is readable without horizontal page scroll (cards, or a labelled scroll region). | L | PL TA-03 (Mobile); AC-04 |
| WP02-A28 | SuperAdmin in a support view of `syn-ta-1` (fixture) | TA-03 | Render the page. | The same facts show, read-only. No "Start an application" and no other target action. | T | BS B10; PL §2.3 SH-R09 |

### 2.3 No draft for an unavailable route (V01)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A29 | TA (`syn-ta-1`) | Add-applicants step of a Synthetica group (existing page `/ta/groups/:groupId/intake/new`, LD-02) | Read the service choice. | The choice holds only offerings of the group's country that this TA can select. "SYN Provider visa (route not approved)" is not offered. A visible offering that cannot be selected shows its reason and cannot be chosen. | L | BS B07; PL §5.2 (Add applicants) |
| WP02-A30 | Harness as `syn-ta-1` | Same step | Send the individual-applicant form with the service reference changed to "SYN Provider visa (route not approved)". Then read the group, TA-06 and, as `superadmin-1`, SA-04 for `syn-ta-1`. | The form is refused with the offering reason (for example "This service is not open for new applications."). Entered values stay. No draft, application, intake attempt or intake issue is created. The counts of the group and of TA-06 are unchanged. | L+T | BS B07 ("all new intake, including drafts"); UX §3.1 step 1; UX §12 V01 |
| WP02-A31 | Harness as `syn-ta-2` | Add-applicants step of a Synthetica Gamma group of `syn-ta-2` (created after proof step D8) | Before proof step D12, send the form with the proof offering reference. | Refused with the scope reason ("This service is not open for your account yet." or the same facts). No draft, application, attempt or issue is created. | L+T | BS B07, B10 |
| WP02-A32 | TA | Draft creation and intake start against an offering that is not launched, out of scope, suspended, withdrawn, or without a supported binding (fixtures) | Run each case. | Each is refused with its reason. No draft, application, attempt or issue is written. | T | BS B07; for example `test/integration/launch-control.test.ts` ("refuses all new work while not launched") |

### 2.4 SA-05 offering list, countries and offerings

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A33 | SuperAdmin (`superadmin-1`) | 4652 `/admin/catalogue` (rail "Offerings & launch") | Open the page. Read it. Render it with no offering (fixture) and with an unreadable launch state (fixture). | The offering list shows each offering with country, service, mode, publication state and launch state as separate facts. Launch state names the audience ("All active travel agents", or the number of named travel agents). Suspension and withdrawal show apart from launch. The 9 seeded offerings show: 8 "Launched" for all active travel agents, "SYN Provider visa (route not approved)" "Not launched". Countries show with their listing state. Freshness "Read at [time] IST". S2: "No offerings yet" with the first task. S4: the unreadable fact shows "Unavailable". | L+T | PL SA-05; UX §6.2, §6.3 ("Display current launch scope and suspension independently"); BS B07 |
| WP02-A34 | SuperAdmin | `/admin/catalogue` | Read the texts beside countries and offerings. | The page says that listing a country lets travel agents create groups there, approves no route and launches nothing, and that a new offering is unpublished and not launched. No country shows as offered only because it exists. | L | BS B02, B07; UX §6.3 ("no candidate country is implicitly active") |
| WP02-A35 | SuperAdmin | Add a country | Submit the empty form. Then submit code "sy1", name "Synthetica Gamma", slug "Synthetica Gamma", reason "test". | C1: the error summary receives focus. Each field states its rule in words: the code is three capital letters; the slug uses lower-case letters, digits and hyphens; the reason has at least 10 characters. Entered values stay. Nothing is created. | L | CMP-07; AC-08; `cat.create_country` input rules |
| WP02-A36 | SuperAdmin (`superadmin-1`), TA (`syn-ta-1`) | Add a country | Code `SYQ` (not an ISO 3166 code), name "Synthetica Gamma", slug `synthetica-gamma`, listing "Not listed", a reason. As `syn-ta-1`, open the group-creation country choice (existing page). Open the public page `/countries` on 4650. | C3: the receipt (CMP-08) names the country, code, listing "Not listed" and its synthetic status, with the request reference. Nothing is launched. The TA's country choice does not hold Synthetica Gamma. The public page does not change: public countries are static content. | L | `cat.create_country`; BS B01, B02; UX §12 V25 |
| WP02-A37 | SuperAdmin | Add a country | Repeat with code `SYN` and slug `synthetica`. | C2: the page says that the code or slug is already used and links to the existing country. Nothing is created. | L | PL §7 K-STD (business duplicate); CMP-07 |
| WP02-A38 | SuperAdmin, TA (`syn-ta-1`) | Listing of Synthetica Gamma | Set the listing to "Listed" with a reason. As `syn-ta-1`, open the group-creation country choice and TA-02. Set "Listed" again. | C3: the receipt shows the listing before and after. The TA can now choose Synthetica Gamma for a group. TA-02 still shows no Synthetica Gamma service (listing is not launch). Setting the same state again: C2 "The listing is already Listed" or the same facts; nothing changes. | L | `cat.set_country_listing`; CC ("Listing gates group creation"); BS B07 |
| WP02-A39 | SuperAdmin, TA (`syn-ta-1`) | Listing of Synthetica Gamma | At the end of proof Part D, set the listing to "Not listed". As `syn-ta-1`, try to create another group there. Open the proof group of step D11. | C3 receipt. The group creation refuses the country ("That country is not listed." or the same facts). The existing proof group and its applications stay unchanged and open. | L+T | `cat.set_country_listing`; BS B07 (existing work survives) |
| WP02-A40 | `superadmin-1`, `superadmin-2` | Listing of Synthetica Gamma, two browsers | Both open the listing form. `superadmin-1` changes the listing. `superadmin-2` then sends a change from the older form. | C5: `superadmin-2` sees "Changed since your review" (CMP-14) with the current listing and the unsent value, and "Review current information". Nothing is overwritten. | L | CMP-14; UX §3.3; PL §1.4 C5 |
| WP02-A41 | SuperAdmin, TA (`syn-ta-1` to `-3`) | Create an offering | Country Synthetica Gamma, service code `syq_tourist_evisa`, mode "TravelMudra files", title "SYQ Tourist e-visa (WP-02 proof)", a reason. Then read TA-02 as each TA. | C3: the receipt names the offering, its country and mode, states "Unpublished" and "Not launched", and links to the offering detail. The copy says that creation approves no route, provider or launch. No TA sees the offering. | L | `cat.create_offering`; BS B05, B07 |
| WP02-A42 | SuperAdmin | Create an offering | Submit service code "SYQ Tourist" and no country. | C1: the country is required; the service code uses lower-case letters, digits and underscores, 3 to 40 characters. Values stay. | L | CMP-07; `cat.create_offering` input rules |
| WP02-A43 | SuperAdmin | Offering detail of the proof offering and of "SYN Tourist e-visa" | Open each. | Four separately labelled panels: definition and binding; effective business values; readiness evidence; launch and admission. Each panel states its current facts and what the offering needs next, in words. The publication impact preview and the publication records are reachable. Readiness stage labels follow Q-08; no stored or invented stage state. | L | UX §6.3 (Offering management); PL SA-05; DC §1.3 OC-07; Q-08 |

### 2.5 SA-05 definition and binding

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A44 | SuperAdmin | Definition and binding panel of the proof offering | Draft a declaration from the body of the head of "SYX Tourist e-visa" (per Q-07). Give a reason. | C3: the receipt names version 1 and its digest. Status "Draft". The item list shows each item with its status in words (supported by the release, needs an owner approval, unresolved). | L | `cat.draft_declaration`; BS B05; Q-07 |
| WP02-A45 | SuperAdmin | Draft a declaration | Submit a malformed body. Then submit a preparation-only body for this TravelMudra-filed offering. | C1: the summary names the problem in words ("The service mode does not match this offering", "The declaration cannot be read"). The reference code shows for staff as secondary text, never alone. The entered body stays. Nothing is created. | L | CMP-07; CR-01 |
| WP02-A46 | SuperAdmin | Draft a declaration | Draft again while version 1 is a draft. | C2: "A draft is already open" with a link to it. Nothing is created. | L | PL §7 K-STD (business duplicate) |
| WP02-A47 | SuperAdmin | Draft version 1, owner approval | Read the approval form. Record a structural approval: approver statement "Product owner (synthetic)", approval date, evidence "synthetic label", a reason. | The form names the exact version and its digest. It says that the approval records a decision made outside the product, for this version and scope only, and launches nothing. C3: the receipt names the version, digest, approval date and approver statement. The declaration becomes "Supported (owner approval)". | L | `cat.record_owner_approval`; BS B05; UX §6.1 |
| WP02-A48 | SuperAdmin | Owner approval | From a page that shows another version or another digest (second tab or harness), record the approval. | C2: the approval does not match this version. Nothing is recorded. | L+T | BS B05 ("exact version/scope") |
| WP02-A49 | SuperAdmin | Owner approval of a real (non-synthetic) offering (fixture) | Record an approval with the evidence "synthetic label", then with no evidence. | C1: owner-approval evidence is required; a synthetic label is refused for a real offering. | T | BS B05, B37 |
| WP02-A50 | SuperAdmin | Owner approval of a structure that the active release cannot supply (fixture) | Record a structural approval. | C2: the structure needs an engineering release; owner "engineering". Nothing is recorded. | T | BS B05 |
| WP02-A51 | SuperAdmin | Supported version 1 | Ask the active release for a binding. Ask again. | C3: the receipt names the binding and the release profile; the panel shows "Binding supported by the active release". Second request: C2 names the existing binding; nothing new is registered. The wording says that the release supplies the binding; the SuperAdmin only asks for it. | L | `cat.bind_declaration`; BS B05 |
| WP02-A52 | SuperAdmin | Binding of a draft, or of a structure that the release cannot supply (fixtures) | Ask for a binding. | C2 with the reason and the owner "engineering". | T | BS B05 |
| WP02-A53 | SuperAdmin | Proof offering, declaration version 1 with its draft business values (A56) | Preview the publication of the structure. Read the publication decision page (SA-05e). | The page shows: scope (the offering; the declaration published together with the draft business values; "New cases use them from the publication."); price (current "None (first publication)", new "₹3,300"); processing estimate (new maximum in days); "No open application is affected."; "Preview computed at [time] IST". It shows no declaration or values version numbers, no governing before and after identities, and no unknown-applicability count: `cat.admin_preview` does not return them (B-06; the WP-02 record lists the gap). Previewing publishes nothing: the offering still has no head and is "Not launched". | L | `cat.preview_declaration`; UX §6.3 (Publication and impact); design §3.5; review R-06; B-06 |
| WP02-A54 | SuperAdmin, TA (`syn-ta-1`) | Publish the structure | Give evidence and a reason. Choose a continuation for existing work only where the page asks for it. Publish. Read TA-02 as `syn-ta-1`. Read the launch panel. | C3: the receipt names the publication, the new head, the effective condition "New cases from publication" and the affected scope. The launch panel still shows "Not launched". No TA sees the offering. | L | `cat.publish_declaration`; BS B06, B07; UX §12 V20 |
| WP02-A55 | `superadmin-1`, `superadmin-2` | Publish the structure, two browsers | `superadmin-1` previews. `superadmin-2` changes the draft values. `superadmin-1` publishes from the older preview. | C5: "The preview is out of date. Preview again." or the same facts. Nothing is published. After a new preview the publication works. | L | BS B06; PL SA-05 (REJ stale) |

### 2.6 SA-05 effective business values and publication impact

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A56 | SuperAdmin | Business values panel of the proof offering | Draft values: price ₹3,300; estimate 5 to 12 calendar days with a note; a label and a description for each declared document type; three process steps; display notes. Save. | The form lists exactly the document types that the declaration declares (no free types). C3: the receipt names the values version and the status "Draft". | L | `cat.edit_baseline` (create route); BS B05; PL SA-05 |
| WP02-A57 | SuperAdmin | Business values | Save a price of 0 without the zero-price confirmation. Save a price above the configured maximum. Save a minimum estimate above the maximum. Leave a document label empty. | C1 for each field, in words. A zero price needs an explicit confirmation. Entered values stay. | L | CMP-07; `cat.edit_baseline` input rules |
| WP02-A58 | SuperAdmin | Business values | Start a second draft while one is open. | C2: "A draft of business values is already open" with a link. Nothing is created. | L | PL §7 K-STD (business duplicate) |
| WP02-A59 | `superadmin-1`, `superadmin-2` | Business values draft | Preview the draft. Edit and save it. Then both open the same draft; `superadmin-1` saves; `superadmin-2` saves from the older form. | After the edit the draft is "Draft" again; the page says that the old preview no longer describes it and offers no publication until a new preview. `superadmin-2`: C5 "Changed since your review" with current and unsent values (CMP-14); no overwrite. | L | `cat.edit_baseline` (edit route); CMP-14; UX §3.3 |
| WP02-A60 | SuperAdmin | Proof offering after launch (proof step D13) | Save new values with price ₹3,450. Preview. Read SA-05e. | The page shows: price (current "₹3,300", new "₹3,450", change "₹150 increase"); processing estimate (current and new maximum, in days); the changed fields; existing work by class with counts and unit (for example "1 application: drafts"); submitted applications whose forecast reaches the travel date; automatic reductions (count and total); applications quoted higher; paid applications with a higher quote; the affected applications in a labelled scroll region, with the "first 500 are listed" line when the list is cut; "Preview computed at [time] IST". A count whose key is absent shows "Unavailable", never 0. It shows no version numbers, no governing identities and no unknown-applicability count (B-06). The SuperAdmin can read the list before any confirmation. | L | `cat.preview_baseline`; UX §6.3; BS B06; design §3.5, F-W02-01; review R-06; B-06 |
| WP02-A61 | SuperAdmin | Publish values while drafts exist | Publish without a continuation choice. Then choose a continuation for drafts and publish. | Without a choice: "Choose what happens to existing drafts" (C1 or C2); no choice is preselected. With a choice: C3 receipt names the publication, before and after values, effective condition "New cases from publication", affected scope with counts, the continuation chosen and the actor. | L | `cat.publish_baseline`; BS B06; UX §6.3 |
| WP02-A62 | SuperAdmin, TA (`syn-ta-1`) | Publish values | After the preview of A60, `syn-ta-1` starts one more draft for the proof offering. The SuperAdmin publishes from the older preview. | C2: the preview is out of date because existing work changed; "Preview again". Nothing is published. | L | BS B06 ("Preview price/impact before publication") |
| WP02-A63 | SuperAdmin | Publish values as a mistaken-price correction | Choose "mistaken price" with no evidence. Then with a reason shorter than 20 characters. | C2: a mistaken-price correction needs evidence and a reason of at least 20 characters. Nothing is published. | L | BS B17 (mistaken price); `cat.publish_baseline` guard |
| WP02-A64 | SuperAdmin | Publish values, the Nth time | After A61, resend the same form (browser "resend form data" or harness, same operation key). Then send a fresh publish form for the same values (new key). | Same key: the same receipt; one publication exists. New key: C2 "These values are already published", naming the publication. | L+T | PL §7 K-STD; BS B35 |
| WP02-A65 | SuperAdmin | Publication record (link from the receipt) | Open it. | It shows actor, reason, evidence, before and after values, publication time in IST, effective condition, affected scope, preview reference and the accountable SuperAdmin. | L | BS B06; CR-06 |
| WP02-A66 | SuperAdmin | Business values form | Look for fields that change gates, cut-offs, validity checks, retries, security or behaviour. | No such field exists. Where such a change is needed, a CMP-10 notice says that it needs an engineering release or a product-owner decision, with the owner. | L | BS B05; PL SA-05 (Unavailable: shared control change) |

### 2.7 SA-05 readiness evidence, launch and admission

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A67 | SuperAdmin | Readiness evidence panel of the proof offering | Read it. | It lists each B32 item that the head declares. Each measure: applicability, owner, numerator and denominator, event boundaries, timezone, waits and pauses, dimensions, exclusions, missing-data treatment, provisional numeric target, sample-size note. Each monitor: owner, signal, escalation. Operating readiness: support hours, escalation path, staffing, peak capacity, availability, response and recovery targets, fallback. Each item shows "Recorded" or "Missing" in words, never zero or "done". | L | BS B32; UX §6.3 (Launch/suspension/lift) |
| WP02-A68 | SuperAdmin | Launch plan | Record a plan with "Fallback" empty. | C3: the receipt names plan version N as "Incomplete" and lists "Fallback" as missing. The page says that an incomplete plan cannot launch. | L | `ops.record_launch_plan` |
| WP02-A69 | SuperAdmin | Launch plan | Name a TA account and a suspended account as measure owners. Enter the timezone "IST+5". | C1: an owner must be an active operator or SuperAdmin; the timezone must be a valid zone name (for example "Asia/Kolkata"). Values stay. | L | `ops.record_launch_plan` input rules |
| WP02-A70 | SuperAdmin, harness | SA-05h and SA-05j kind=launch of the proof offering, with the incomplete plan of A68 | Read the readiness evidence and the plan summary on SA-05h. Open SA-05j kind=launch. Then post the approve route by hand with that plan (harness). | SA-05h: the item "The current launch plan is complete for the head declaration" is Not met and lists the missing field ("Fallback"). The stored plan reads "Incomplete", labelled "Recorded when the plan was saved". No page says "complete" while the current readiness is not complete (B-07). SA-05j: the CMP-10 notice "Approving the launch is unavailable until every launch requirement above is met. Owner: SuperAdmin." with links to the plan page and the values; the "Approve launch" button shows with `aria-disabled` and its reason; the page has no form, so nothing can be sent from it. The hand-made post is refused (C2 `launch_plan_incomplete`, each missing item named). Nothing is launched. | L+T | PL SA-05 ("Missing B32 launch facts block launch with reasons"); BS B32; design §3.10 (Unavailable); review R-07, R-12; B-07 |
| WP02-A71 | SuperAdmin | Launch decision with a complete plan (version N+1) | Open the decision. Read it before sending. | Anatomy per Q-05: exact scope (offering, head version, audience: all active travel agents or named travel agents); evidence (plan version, readiness evidence); effect (new selection, intake, drafts and submission open for the audience; existing work, payment facts and other offerings unchanged); hard stops (publication, launch-required items, provider route, plan); each action-scoped item that is not supported, with its own labelled acknowledgement; reason; consequence review before the final button. The final button names the act (for example "Launch for 1 travel agent"). | L | UX §6.3, §7.3 (SuperAdmin decision page); PL SA-05, SA-09, AD-13; Q-05 |
| WP02-A72 | SuperAdmin, TA (`syn-ta-1`, `syn-ta-2`) | Launch decision | Launch for the named travel agent `syn-ta-1`. Reload TA-02 as `syn-ta-1` and as `syn-ta-2`. | C3: the receipt names the launch, the audience (1 named travel agent, by name), the plan version, the acknowledged items and the head. Launch state "Launched". `syn-ta-1` sees the offering "Available for new applications"; `syn-ta-2` does not (A06). | L | `ops.approve_launch`; BS B07 |
| WP02-A73 | `superadmin-1`, `superadmin-2` | Launch decision | `superadmin-1` sends with one acknowledgement missing. Then `superadmin-2` records a newer plan version, and `superadmin-1` sends from the older form. | C2: each unacknowledged item is named. Then C5: "The launch plan changed: version [n] is current" with "Review current information". Nothing is launched. | L | `ops.approve_launch` guards; PL §1.4 C5 |
| WP02-A74 | SuperAdmin | Launch panel of "SYN Provider visa (route not approved)" | Open the launch decision. | A CMP-10 notice in the §11.3 form says that launch is unavailable until the product owner approves the provider route; "Owner: product owner". No acknowledgement passes it. If a send is possible, it is refused (C2) with the blocker "provider route". | L | BS B05, B44; PL §4.2 (Third-party filed), §13.2 B-06 |
| WP02-A75 | SuperAdmin | Launch decision of an unpublished offering (proof offering before A54, or fixture) | Send. | C2: "Publish the offering first" or the same facts. Nothing is launched. | L+T | BS B07 (publication is separate from launch) |
| WP02-A76 | SuperAdmin | SA-05j kind=launch of the proof offering (proof step D10, before sending), field "Named travel agent accounts" | Choose "Named travel agents only". Open the reference list "Travel agent accounts". Enter the reference of `syn-operator-1` and send. Enter the reference of `syn-ta-1` twice and send. Render the page while the reference list read fails (fixture). Send a named suspended or declined TA account (fixture). | The field is a text field: one account reference per line, with the hint that each must be an active or approved travel agent account. The reference list is a disclosure that lists travel agent accounts with name, status and reference (with copy); it is a reference, not a chooser, and it does not filter what can be typed. When its read fails it shows "Unavailable" and the field stays usable. Each send is refused (C2 `launch_audience_invalid`) on the named-accounts field; the typed text stays; nothing is launched. | L+T | Design §3.10, D-W02-12; `ops.approve_launch` guards; review R-12; BS B10 |
| WP02-A77 | `superadmin-1`, `superadmin-2` | Launch decision, two browsers | Both open the decision. Both send at about the same time. | One decision becomes current. The other gets C2 "This offering is already launched" with a link to the current decision. The history shows one launch. | L+T | PL §7 K-STD; `test/integration/launch-control.test.ts` ("two SuperAdmins approving concurrently") |
| WP02-A78 | SuperAdmin | Launch decision, the Nth time and a lost acknowledgement | Resend the same form (same key). Inject a lost acknowledgement (fixture). | Same key: the same receipt; one decision. Lost acknowledgement: C4 (CMP-13) "Checking the original result" with "Check status"; no second decision. | L+T | PL §1.1 UNR, §7 K-STD; BS B35 |
| WP02-A79 | SuperAdmin, TA (`syn-ta-2`, `syn-ta-3`) | SA-05j kind=expand of the proof offering, launched for named `syn-ta-1` (proof step D12) | Send the named audience `syn-ta-2` only. Then expand to "Every active travel agent". Then open SA-05j kind=expand again. Then post an expansion by hand (harness). | While the audience is named, the page uses the decision anatomy of A71. Named `syn-ta-2` only: C2 "The new audience must include everyone already approved" (`launch_audience_not_wider`); typed values stay; the page says that suspension is the narrowing tool. Every active travel agent: C3 receipt names the new audience and the superseded decision; `syn-ta-2` and `syn-ta-3` now see the offering. Third visit: no form; the page states "Expanding needs a current launch for named travel agents, with no suspension." (or the same facts) with a link to SA-05h. The hand-made post is refused (`launch_audience_not_wider`); nothing changes. | L+T | `ops.expand_launch_scope`; BS B07; design §3.10 (Expand not applicable); review R-11 |
| WP02-A80 | SuperAdmin | Expansion while suspended, and of an offering that is not launched (fixtures) | Send each. | C2: "Scope cannot widen while the offering is suspended"; "The offering is not launched". | T | `ops.expand_launch_scope` guards; BS B07 (lift restores only approved scope) |
| WP02-A81 | SuperAdmin | SA-05h of the proof offering, before proof step D10, after D10 and after D12 | Read "What launch control allows now" each time. | The table shows, for a travel agent in the approved audience, the launch-control effect that Core returns for each listed action: "Select the service, start intake, create a draft" (one row), "Submit a draft" and the actions on submitted cases. Each effect reads Allowed, Held or Refused, with its reasons in words. Before D10 the first row is Refused (not launched); after D10 it is Allowed. The page says that "Allowed" means launch control does not stop the action and that the action keeps its own checks. The table states no permission and no audience membership for a particular travel agent. An action with no returned effect shows "—", never "Allowed". | L | BS B07; design §3.8; contract `ops.launch_offering.effects`; review R-11 |
| WP02-A82 | SuperAdmin | Launch panel after A61 | Read it. | Launch state, audience and decision are unchanged by the values publication. No second launch approval is asked for. The copy says that the new values apply to new cases from publication. | L | UX §12 V20; BS B06 (no second version-specific launch approval) |

### 2.8 SA-06 Accounts & access: list and create

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A83 | SuperAdmin | 4652 `/admin/accounts` (rail "Accounts & access") | Open the page. Filter by role "Travel agent" and status "Suspended". Clear the filters. Render the list with 200 matching accounts (fixture). | Columns: name (link), email, role, status in words (Waiting for approval, Approved, Active, Suspended, Declined), authenticator ("Set up", "Not set up" or "Not used"), data ("Synthetic fixture" or "Real"). Rows that wait for a SuperAdmin (waiting for approval, approved) carry an attention marker with text. "Active SuperAdmins: [n]" and "Open elevation requests: [n]" (link to `/admin/elevations`) show as facts. The filters are enumerated values in the address (SH-R06). No match: S3 "No accounts match these filters." with "Clear filters". Primary action "Create an account". Freshness "Read at [time] IST". No row shows a request actor or second-approval details: the list does not return them (B-06). With 200 rows a line says that the list shows at most 200 accounts and may be incomplete, and to use the filters; no total is claimed (B-14). | L+T (T for the 200-row cap) | PL SA-06, §2.3 SH-R06; design §4.1; review R-06, R-14; B-06, B-14; LD-08 |
| WP02-A84 | SuperAdmin | Create account form | Read it. | Fields: role, email address, display name, reason, each with a visible label. A CMP-10 notice: TA eligibility and fraud criteria are not selected; "Owner: product owner". The page says that the account starts "Waiting for approval" and cannot sign in until it is approved and activated. No self-registration or account-request page exists on 4650 or 4652. | L | AD-05; BS B08, B11, B44; DC §1.6 (OC-10); PL §13.2 B-01 |
| WP02-A85 | SuperAdmin | Create account | Submit the empty form. Then email "abc" and reason "short". | C1: the error summary receives focus; each field states its rule. Values stay. Nothing is created. | L | CMP-07; AC-08 |
| WP02-A86 | SuperAdmin | Create account | Role "Travel agent", email `wp02-ta-<run>@synthetic.test`, a display name, a reason. | C3: the receipt names the individual and the role, the status "Waiting for approval", the next step "Approve" and the request reference. The list shows the account. No sign-in code goes to the address. | L | `iam.create_account`; BS B11 |
| WP02-A87 | SuperAdmin | Create account | Email `syn-ta-1@synthetic.test`. | C2: the address is already used by an account, with a link to that account. No generic error. | L | `iam.create_account` (`email_in_use`); CR-01 |
| WP02-A88 | `superadmin-1`, `superadmin-2` | Create a SuperAdmin account | `superadmin-1` creates `wp02-sa-<run>@synthetic.test` with the role SuperAdmin. `superadmin-1` tries to approve it. `superadmin-2` approves it (where, per Q-01). `superadmin-1` activates it. | The receipt of `superadmin-1` says that a second, different SuperAdmin must approve. The approval of `superadmin-1` is refused (C2) with that reason; no approve control is offered to `superadmin-1` as usable. After the approval of `superadmin-2` the status is "Approved". After activation the status is "Active"; the receipt says that an enrolment code goes to the person's own address and that nobody sees it. | L | BS B11; UX §6.3 (Account changes); UX §12 V21; PL §7 K-2P; Q-01 |
| WP02-A89 | SuperAdmin | SA-06 | Look for a way to create or recover a SuperAdmin without a second SuperAdmin, or after all SuperAdmins are lost. | No such control exists. A CMP-10 notice says that first-admin and all-admin-loss recovery is not available; "Owner: product owner". | L | BS B11, B44; PL §13.2 B-01 |
| WP02-A90 | SuperAdmin | SA-06b and SA-06c while the audit record is behind (fixture) | On SA-06b, send a create request. On SA-06c of a pending, an approved and a suspended account, read the actions. Decline a pending account. Suspend an active account. | SA-06b shows no audit state before sending: its read model returns none (B-06). The send is refused with the form-level text "The audit record is behind, so creating an account is unavailable now. Suspension and declines still work." (or the same facts); typed values stay; nothing is created. SA-06c shows the approve, activate and restore triggers disabled, each with the visible reason "Unavailable while the audit record is behind." (`aria-describedby`). Decline and suspend stay available and are accepted. | T | BS B11, B33; UX §12 V21; design §4.2, §4.3; review R-06; B-06 |

### 2.9 SA-06 account status

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A91 | SuperAdmin, harness | Account detail of `wp02-ta-<run>` | Open "Approve". Read the consequence review. Approve with a reason. Request a sign-in code for the address on 4650 (harness). | The review says that the status becomes "Approved" and that the account still cannot sign in. C3: the receipt names the individual and the consequence. The code request gets the neutral answer and no code arrives (WP01-A31). | L | `iam.approve_account`; BS B08, B11 |
| WP02-A92 | SuperAdmin, new TA (harness) | Same account | Activate with a reason. Sign in as the new TA (LD-11). Open Services. | The review says that the travel agent can sign in with codes sent to their own address. C3 receipt. The TA signs in. TA-02 shows the offerings launched for all active travel agents: the 8 seeded ones and, after proof step D12, the proof offering. | L | `iam.activate_account`; BS B07, B08, B11 |
| WP02-A93 | SuperAdmin | Account `wp02-decline-<run>` | Create it. Decline it with a reason. Create an account with the same address again. | The review says that the account is not created for use and its address becomes free. C3 receipt, status "Declined". The second creation is accepted. | L | `iam.decline_account` |
| WP02-A94 | SuperAdmin, new TA | Account `wp02-ta-<run>` (it holds one group from proof step E3) | While the TA is signed in, suspend the account with a reason. The TA opens a page. As SuperAdmin, open SA-04 for that TA. | The review lists the consequences: sessions and codes end, an open email change ends, groups and applications stay. C3 receipt. The TA lands on sign-in (WP01-A76). The group and its applications still exist. | L | `iam.suspend_account`; BS B11 ("suspending a TA preserves applications"); UX §6.3 |
| WP02-A95 | SuperAdmin, new TA | Same account | Restore it with a reason. Sign in as the TA. | The review says that grants are not restored. C3 receipt, status "Active". The TA signs in and finds the group unchanged. | L | `iam.restore_account`; BS B11 |
| WP02-A96 | SuperAdmin | Account `syn-operator-3` (holds one assigned application, §0.2) | Open "Suspend". Read the review. Suspend. Open "Duties and hand-off". Restore the account at the end. | Before the act, the review lists the unresolved duties (assigned applications, acts with reconciliation, open holds, owned incidents) and says that each needs audited reassignment (SA-03; the existing page until WP-06). After the suspension the duties page lists them, owned by the SuperAdmin queue. Nothing is reassigned automatically. | L (T if the precondition is not met) | BS B11, B19; UX §6.3; PL SA-06 (Suspend operator) |
| WP02-A97 | SuperAdmin | Suspend the last active SuperAdmin (fixture) | Suspend without and then with the acknowledgement. | Without: C1 asks for the explicit acknowledgement. The review warns that no active SuperAdmin will remain and that no recovery path exists (CMP-10, "Owner: product owner"). With the acknowledgement: accepted. | T | BS B11, B44 |
| WP02-A98 | `superadmin-1`, `superadmin-2` | Account `wp02-sa-<run>` | `superadmin-1` suspends it, then restores it, then tries to approve the restoration. `superadmin-2` approves it (per Q-01). | The restore of `superadmin-1` opens a second-approval request and the receipt says so; the status stays "Suspended". The approval of `superadmin-1` is refused. After the approval of `superadmin-2` the status is "Active". | L | BS B11; UX §12 V21; Q-01 |
| WP02-A99 | `superadmin-1`, `superadmin-2` | Account detail of a pending account, two browsers | Both open it. `superadmin-1` approves. `superadmin-2` declines from the older page. | C5: `superadmin-2` sees "Changed since your review" with the current status. Nothing is overwritten. | L | CMP-14; PL §1.4 C5 |
| WP02-A100 | SuperAdmin, harness | SA-06c; hand-made requests | Read the actions offered for a pending, an approved, an active, a suspended and a declined account. Then send by hand: activate a pending account; restore an active account; approve a pending account with an older revision. | The page offers only the actions of design §4.3 for the current status (for example no "Activate" on a pending account, no action on a declined one). Each hand-made request is refused with `stale_revision`: the page shows CMP-14 "Changed since your review" with the current status ("[status] since [time] IST") beside the unsent reason. It does not state the earlier status that the form showed (B-06). Nothing changes. | L+T (L for the offered actions; T for the hand-made requests) | `iam.*_account` guards (`stale()`, `src/modules/identity/commands/accounts.ts`); design §3.15, §4.3; review R-11; B-06 |
| WP02-A101 | SuperAdmin | Account detail of `syn-ta-1` | Look for a control that changes the email address, shows or chooses a credential, or signs in as the person. | None exists. A note says that only the travel agent changes the address, with codes to the current and the new address. | L | BS B08, B09, B11; UX §6.1; UX §12 V21 |
| WP02-A102 | SuperAdmin | Suspend while the audit record is behind (fixture) | Suspend a TA account. | Accepted. One SuperAdmin can suspend in an emergency while the audit record is behind. | T | BS B11 ("emergency suspension may be unilateral"); UX §12 V21 |

### 2.10 Command results, access and shell on WP-02 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A103 | SuperAdmin | Every accepted WP-02 command reachable on `lane-ui` | Read the receipt. | CMP-08: title, request reference that links to the operation status page, "Recorded once. Sending the same form again does not repeat it." (or the same facts), the resulting facts. No accepted time until P-02 is served; any time shown carries "IST". The polite region announces the result; focus does not move. | L | PL §1.1 ACC, §1.4 C3; W1 (P-02); AC-09 |
| WP02-A104 | SuperAdmin | Each of the 20 WP-02 commands with a lost acknowledgement (fixture) | Inject the fault. | C4 (CMP-13): "Checking the original result" and "Check status". No new submission of the same intent is offered. "Check status" reads the same operation and shows the final result. | T | PL §1.1 UNR, §1.4 C4; BS B35; WP-01 Q-01 split |
| WP02-A105 | SuperAdmin, harness | Each of the 20 WP-02 commands; the launch plan after a head change | (a) Send the same operation key with the same content. (b) Send the same key with different content. (c) Record a launch plan (form F, key K). Publish a new head whose declaration requires a different set of measures or monitors. Resend form F with key K unchanged. | (a) The original result; no second record. (b) Refused as a conflict; no second record. (c) Required: the original accepted plan result (replay), with no conflict and no second plan version. Case (c) is expected to fail until P-06 (B-10): today the Core binding builds the input from the current requirements and answers an operation-key conflict. The run record reports (c) as "Deferred (P-06)" until P-06 is integrated (pass rule, §0.2). | T | PL §7 K-STD; BS B35; review R-10; B-10; P-06 |
| WP02-A106 | SuperAdmin | Every WP-02 form that needs a reason | Read the reason field. Cause an error elsewhere in the form. | Visible label. Hint "At least 10 characters. It is kept in the audit record." or the same facts. The entered reason stays after the error. | L | BS B07, B11; AC-05, AC-08 |
| WP02-A107 | SuperAdmin | Every refusal reachable on `lane-ui` in A35 to A101 | Read each message. | CMP-07 with the reason in words, its owner and its route. The reference code shows for staff as secondary text. No message is a code alone. No forbidden label of §11.1 ("Override", "Admin override", "Approved" or "Done" as an overall status). | L | PL §1.1 REJ, §11.1; CR-01, CR-05 |
| WP02-A108 | TA | Every reason code that TA-02, TA-03 or the add-applicants step can show | Check the text map against the reason vocabulary. | Every code has travel-agent text. No known code falls back to "This is not available at the moment." | T | CR-01; UX §4.4 |
| WP02-A109 | Operator (`syn-operator-1`), TA (`syn-ta-1`), SuperAdmin | SA-05 and SA-06 addresses on 4652; each WP-02 page | As the operator, open the SA-05 and SA-06 addresses. As the TA, open them. As each role, read the shell of each WP-02 page. | The operator gets SH-02 denied with no catalogue or account facts. The TA session does not open staff pages (WP01-A57). Each WP-02 page shows the environment label, the "[TEST]" title prefix, the current rail item ("Services", "Offerings & launch" or "Accounts & access"), the breadcrumb and one `h1`. | L | BS B10; PL §2.1, §2.2; WP01-A01, WP01-A08 |

### 2.11 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A110 | Keyboard-only TA | TA-02 → TA-03 → "Start an application", at 1440 and 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape. No action needs a mouse or a hover. | L | AC-01, AC-12 |
| WP02-A111 | Keyboard-only SuperAdmin | Proof steps D1 to D13 and E1 to E2 at 1440 px; D10 and E1 at 390 px | Use the keyboard only. | Every form, acknowledgement, consequence review and receipt works with the keyboard. | L | AC-01 |
| WP02-A112 | Keyboard-only user | Every WP-02 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a sticky action area. | L | AC-02 |
| WP02-A113 | Phone user | TA-02, TA-03, SA-05 impact preview, launch decision, SA-06 list and account detail | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The impact list, the documents table and the account list scroll only inside a labelled region, or become cards. Identity, reason, owner and next action come before secondary data. | L | AC-04, AC-21; UX §7.3 |
| WP02-A114 | Any | Every WP-02 form | Inspect each input. | Each input has a visible label. Each acknowledgement checkbox is labelled with its item. The audience chooser and each named-TA option are labelled. | L | AC-05, AC-15 |
| WP02-A115 | Any | Availability, launch, publication and account statuses | View in greyscale. | Each status has text (and an icon where the plan shows one). No status is shown by colour alone. | L | AC-06 |
| WP02-A116 | Any | Every WP-02 form | Submit each form with an error. | Focus moves to the error summary. Each summary link moves focus to its field. Entered values stay. | L | AC-08; CMP-07 |
| WP02-A117 | Screen-reader user, keyboard-only user | Consequence reviews: native disclosures on SA-05a and SA-06c; full-screen task pages SA-05e, SA-05i, SA-05j | Open and close each disclosure with the keyboard. Read each task page from the `h1` to the primary button. Use "Cancel". Confirm one action of each kind. Repeat one of each with JavaScript off. | A native disclosure opens and closes with Enter or Space on its summary and exposes its expanded state; its consequences are read before its confirm button. On a task page the review is a visible section before the primary button, never inside a collapsed region; "Cancel" is a link back to the host page. Neither pattern is a dialog, so no Escape behaviour is required. After confirmation the receipt is the first content after the `h1` of the host page and starts the document title. Each flow works with JavaScript off. | L | AC-01, AC-09; design §5 (JavaScript off), §6, D-W02-08; review R-12 |
| WP02-A118 | Screen-reader user | Each unavailable action on a WP-02 page (launch of the unapproved route; approval of an own SuperAdmin request; start on a paused offering) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order). A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP02-A119 | Phone user | Every WP-02 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions are at least 44 × 44 CSS px. | L+T | AC-10 |
| WP02-A120 | — | Every WP-02 page | Measure contrast of text, focus indicators, status badges and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP02-A121 | Any | Long titles and names; reduced motion | Use an offering title of 120 characters and a display name of 120 characters (fixture). Turn on "reduce motion" and open a consequence review. | Titles and names wrap without hiding identity. A truncated text has a full form that keyboard and touch can reach. No transition plays. | L | AC-14, AC-20 |

### 2.12 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness MUST NOT take a screenshot of a page that shows a
code or a key (activation of a staff account mails an enrolment code; no WP-02 page shows it).

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP02-A122 | TA | TA-02, all countries | L | UX §4.2; AC-01 to AC-28 |
| WP02-A123 | TA | TA-02 after selecting "Synthetica Beta" in the country index (A03) | L | same; design §3.12, D-W02-06 |
| WP02-A124 | TA | TA-03 of "SYN Tourist e-visa" | L | same |
| WP02-A125 | TA | TA-03 of "SYN Tourist visa preparation" (boundary notices) | L | same |
| WP02-A126 | TA | TA-03 not selectable (A24) | L (per Q-04) or T | same |
| WP02-A127 | TA | Add-applicants step with the refusal of A30 | L | same |
| WP02-A128 | SuperAdmin | SA-05 offering list with the country and offering forms | L | same |
| WP02-A129 | SuperAdmin | Add-a-country form with the error summary (A35) | L | same |
| WP02-A130 | SuperAdmin | Offering detail with the four panels (A43) | L | same |
| WP02-A131 | SuperAdmin | Declaration version with the owner-approval form (A47) | L | same |
| WP02-A132 | SuperAdmin | Business values form with the error summary (A57) | L | same |
| WP02-A133 | SuperAdmin | Publication impact preview (A60) | L | same |
| WP02-A134 | SuperAdmin | Values publication receipt and publication record (A61, A65) | L | same |
| WP02-A135 | SuperAdmin | Launch plan form and the incomplete-plan receipt (A68) | L | same |
| WP02-A136 | SuperAdmin | Launch decision with acknowledgements and consequence review open (A71) | L | same |
| WP02-A137 | SuperAdmin | Launch boundary of the unapproved provider route (A74) | L | same |
| WP02-A138 | SuperAdmin | SA-06 list with filters and the S3 state (A83) | L | same |
| WP02-A139 | SuperAdmin | Create-account form with the error summary (A85) | L | same |
| WP02-A140 | SuperAdmin | Account detail with a consequence review open (A91, A94) | L | same |
| WP02-A141 | SuperAdmin | Stale-revision comparison (A99) | L | same |
| WP02-A142 | SuperAdmin | Operator duties page (A96) | L | same |

### 2.13 Deferred to WP-03 (B-09)

Moved from §2.2 by the corrections of 12 October 2026. WP-03 builds a path that keeps the context (country and
offering as opaque ids in the address; Core still validates scope and selectability). WP-02 checks only the
interim of A20.

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP02-A20 | TA (`syn-ta-1`) | TA-03, available offering | Select "Start an application". | WP-03 target: the TA chooses an existing group of the same country or creates one; no group of another country is offered; the add-applicants step opens with this service preselected; no draft exists until the TA sends that step. WP-02 interim (B-09, checked in WP-02): the link opens the Groups page `/ta/groups`, with the line "Choose or create a group of travellers for [country], then add an application for this service."; nothing claims that the service is preselected. | WP-03 (interim: L in WP-02) | PL TA-03, §4.1 steps 2 to 4; UX §2.1 (Group: one country); review R-09; B-09; TR Q-3 (Q-10) |
| WP02-A21 | TA | TA-03, available offering | Find "Add applicants in bulk" and "View requirements". | WP-03 target: both are present as secondary actions; "View requirements" shows the declared requirements; "Add applicants in bulk" leads to the bulk start of a chosen group. WP-02 interim: not required; the documents section of TA-03 states the requirements. | WP-03 | PL TA-03; review R-09; B-09 |

## 3. Proof scenario V01

V01 (UX §12): "TA explains cost, estimate, documents and actual service mode before intake; unavailable route cannot
create a draft." Authority B01–B07. Sources: UX §3.1 step 1, §4.1, §4.4; BS B01, B05, B07, B15, B17; PL §4.1 step 2,
§3.2 TA-02, TA-03, §5.2; COVERAGE-MATRIX V01 (P0). The data are the synthetic facts of §0.3. Parts D and E prove the
WP-02 commands that make an offering and an account admissible; they also give V01 a route that becomes available
only through an explicit launch.

### Part A. Catalogue facts and baseline counts on `lane-ui` (L)

| Step | Action | Observable result |
|---|---|---|
| A1 | `superadmin-1` opens SA-05a and SA-05g. Identify the seeded rows by their service codes (§0.3). | The 2 seeded countries are listed. The 9 seeded offerings show: 8 "Launched for every active travel agent"; `syn_tourist_provider_unapproved` "Not launched", and SA-05g names the provider item under "What blocks a launch" (A74). Rows of earlier runs (`wp02_*`) are listed in the run record and excluded. Record the references of offerings 1, 3, 5, 6 and 7 in the internal run record. |
| A2 | `syn-ta-1` opens Services. | The 8 seeded launched offerings show "Available for new applications" (A01); offering 7 is absent (A02; `WP-02.md` §3). No row shows a price. A proof offering of an earlier run may show; it is ignored. |
| A3 | Record the baseline counts: groups, applications and intake attempts of `syn-ta-1` and `syn-ta-2` (TA-04, TA-06; SA-04 as `superadmin-1`). | The run record holds the counts. Parts B and C MUST NOT change them. Part D checks deltas from them, never totals. |

### Part B. The TA explains cost, estimate, documents and actual service mode before intake (L)

| Step | Action | Observable result |
|---|---|---|
| B1 | `syn-ta-1` opens "SYN Tourist e-visa". | Mode "TravelMudra files". Price "₹3,500", fixed at submission. Government fee: TravelMudra pays and recovers the exact amount separately; the price–fee relation is not decided (boundary). Estimate "5 to 12 calendar days", an estimate. Passport: required, PDF, JPEG, PNG, 5 MB. Photograph: required, JPEG, PNG, 2 MB. Three process steps (A11 to A15). |
| B2 | Open "SYN Tourist visa preparation". | Mode: TravelMudra prepares, the travel agent files. "₹1,800". TravelMudra does not handle fees. Travel itinerary optional, PDF, 5 MB. Withdrawal-after-submission boundary (A16). |
| B3 | Open "SYN Tourist visa via provider". | A declared provider files. "₹4,100". Fees not handled by TravelMudra (A17). |
| B4 | Open "SYN e-visa, fee paid with submission". | "₹3,600". TravelMudra pays the government fee with the submission (A13). |
| B5 | Open "SYX Tourist e-visa". | Country "Synthetica Beta". "₹3,300". Same documents as B1. |
| B6 | TA participants (people, not the harness) read the pages of B1 and B2 on a phone at 390 px. Ask each to say, for each service, the price, who pays the government fee, the estimate, the documents with formats and size limits, and who files. | Record per participant: facts stated correctly, errors, hesitation, and the sample size. No target is invented. A participant who states a fact that the page does not state (for example a deadline or a promise of approval) is a finding. |
| B7 | Repeat the counts of A3. | Unchanged: reading TA-02 and TA-03 created no group, draft, application or intake attempt. |

### Part C. An unavailable route cannot create a draft (L+T)

| Step | Action | Observable result |
|---|---|---|
| C1 | `syn-ta-1` opens the TA-03 address of offering 7. | SH-02 denied, identical to not found (A22). |
| C2 | `syn-ta-1` opens the add-applicants step of a Synthetica group. | Offering 7 is not offered (A29). |
| C3 | The harness sends the individual-applicant form of `syn-ta-1` with the reference of offering 7. | Refused with the offering reason; values kept (A30). The counts of A3 are unchanged. SA-04 shows no new draft. |
| C4 | `superadmin-1` opens the launch decision of offering 7. | The provider-route boundary blocks the launch; "Owner: product owner" (A74). |
| C5 | After step D10: `syn-ta-2` reads TA-02, opens the TA-03 address of the proof offering, and the harness sends the form of `syn-ta-2` with that reference (before step D12). | Absent from TA-02 (A06). SH-02 denied (A23). Refused for scope; no draft (A31). |
| C6 | Per Q-04: `superadmin-1` suspends the proof offering through the existing launch page (LD-02). `syn-ta-1` opens its TA-03 page and the add-applicants step; the harness sends the form. `superadmin-1` lifts the suspension. | TA-03 shows "Not available for new applications" with the pause reason and no start action (A24). The service cannot be chosen (A29). The harness form is refused; no draft. After the lift, the offering is available again for the same audience. |
| C7 | Run the named tests of A32 and A24 (not launched, out of scope, suspended, withdrawn, binding missing, values incompatible). | Each refuses draft creation and intake start; no row is written. |

### Part D. Admission of a new offering (L; `superadmin-1` and `superadmin-2`)

One recipe (§0.2): a new synthetic offering in Synthetica with the run's unique service code. No country is
created and no listing changes on `lane-ui`.

| Step | Action | Observable result |
|---|---|---|
| D1 | `superadmin-1` reads the Countries section of SA-05a. Choose the run suffix and record it. | Synthetica is listed. No country form is sent on `lane-ui` (A36 and A38 to A40 by test). |
| D2 | `superadmin-1` creates the offering: country Synthetica, service code `wp02_<suffix>`, mode "TravelMudra files", title "WP-02 proof <suffix>" (A41). | Receipt: unpublished, not launched. No TA sees it (TA-02 delta 0). A rerun with the same code would be refused (`offering_identity_taken`); the new suffix avoids it. |
| D3 | `superadmin-1` registers declaration draft version 1 from the head body of "SYN Tourist e-visa", copied from its declaration page (A44). | Draft with its digest and item statuses. |
| D4 | `superadmin-1` records the structural owner approval for that digest with synthetic evidence (A47). | Version 1 "Supported (owner approval)". |
| D5 | `superadmin-1` asks the active release for a binding (A51). | "Binding supported by the active release". |
| D6 | `superadmin-1` saves business values: ₹3,300, 5 to 12 calendar days, passport and photograph labels, three process steps (A56). | Values draft receipt. |
| D7 | `superadmin-1` previews the structure with these values (A53). `superadmin-2` edits the values. `superadmin-1` publishes from the older preview (A55), previews again and publishes (A54). | The first publication is refused as out of date. The second is accepted: the head for new cases. Launch "Not launched". No TA sees the offering (V20). |
| D8 | `syn-ta-2` creates a group in Synthetica through the existing pages (LD-02), for A31 and step C5. | The group exists (groups of `syn-ta-2`: delta +1). |
| D9 | `superadmin-1` records a plan without "Fallback" (A68), reads SA-05h and opens SA-05j kind=launch (A70). The harness posts the approve route by hand. `superadmin-1` records a complete plan. | The stored plan reads "Incomplete", labelled "Recorded when the plan was saved"; the readiness item lists "Fallback". SA-05j shows the unavailable notice and has no form. The hand-made post is refused (`launch_plan_incomplete`); nothing is launched. After the complete plan, the item "complete for the head declaration" is met and SA-05j shows its form (B-07). |
| D10 | `superadmin-1` checks the named-audience field (A76), then launches for named `syn-ta-1` only, with every acknowledgement (A71, A72). | Receipt. `syn-ta-1` sees the offering; TA-03 shows ₹3,300, the mode, the estimate and the documents. `syn-ta-2` does not see it (A06). |
| D11 | `syn-ta-1` starts one individual-applicant draft for the proof offering in a Synthetica group (existing pages, LD-02). | Drafts of the proof offering: 1 (applications of `syn-ta-1`: delta +1). A launched route admits a draft. |
| D12 | On SA-05j kind=expand, `superadmin-1` sends named `syn-ta-2` only, then expands to every active travel agent, then opens kind=expand again (A79). | The narrower audience is refused. The expansion is accepted; `syn-ta-2` and `syn-ta-3` see the offering. The third visit shows no form. |
| D13 | `superadmin-1` saves values with ₹3,450 and previews (A60). `syn-ta-1` starts a second draft. `superadmin-1` publishes from the older preview (A62), previews again, chooses a continuation for drafts and publishes (A61). | The first publication is refused as out of date. The second is accepted; the receipt names the before and after values and the affected scope (2 drafts of this offering). |
| D14 | `syn-ta-1` reloads TA-03 of the proof offering and TA-02. `superadmin-1` reads SA-05h. | TA-03 "₹3,450"; TA-02 shows no price (A10). Launch state and audience unchanged; no second launch approval (A82). |
| D15 | Record the suffix, the offering reference and the publication and launch references in the internal run record. | The proof rows stay on `lane-ui`; later runs exclude them by their code. |

### Part E. Account admission (L; `superadmin-1` and `superadmin-2`)

| Step | Action | Observable result |
|---|---|---|
| E1 | `superadmin-1` creates `wp02-ta-<run>` (A86) and approves it (A91). | No code arrives for the address while it is not active. |
| E2 | `superadmin-1` activates it (A92). The harness signs in as the new TA. | TA-02 shows the 8 seeded offerings and the proof offering (all active travel agents after D12). The TA can explain the facts of Part B from the same pages. |
| E3 | The new TA creates a group in Synthetica. `superadmin-1` suspends the account (A94), then restores it (A95). | While suspended, the TA cannot sign in. The group stays. After the restore, the TA signs in and finds the group. |
| E4 | `superadmin-1` creates `wp02-sa-<run>` with the role SuperAdmin; `superadmin-2` approves; `superadmin-1` activates (A88). | One SuperAdmin alone cannot complete the creation. |
| E5 | `superadmin-1` creates and declines `wp02-decline-<run>`, then creates it again (A93). | The address is free after the decline. |

### Part F. Result

V01 passes when B1 to B7 and C1 to C5 show their results on `lane-ui` at the integrated WP-02 commit, C6 shows its
result on `lane-ui` or in a named test as Q-04 decides, and the tests of C7 pass. Parts D and E are part of the
package pass (section 0.2). The run record names each test, the `lane-ui` ref, the run tag and the identifiers.

### Part G. V20 and V21 in WP-02 (traceability)

WP-02 proves the parts of V20 and V21 that its commands carry. The full proofs belong to WP-13 (V20) and WP-15 (V21).

| Scenario part | Items |
|---|---|
| V20: publication or a released binding does not launch | A54, A38, D7, D8 |
| V20: existing-case impact is explicit | A60, A61, A62 |
| V20: a supported update of a launched, unsuspended offering needs no second launch approval for new cases | A82 |
| V21: one SuperAdmin can suspend in an emergency | A94, A102 |
| V21: a second, distinct SuperAdmin is required for a new or restored SuperAdmin | A88, A98 |
| V21: no administrator override of a TA email | A101 |

## 4. Out of scope and boundaries

These MUST NOT appear on any WP-02 page:

- A self-registration page, an account-request form or invented TA eligibility or fraud criteria (AD-05; OC-10;
  BS B08, B44).
- A first-admin or all-admin-loss bypass; one SuperAdmin completing a new or restored SuperAdmin (BS B11, B44).
- A control that changes a TA's email address, shows or chooses a credential, or signs in as another person
  (BS B08, B09, B11).
- One control that publishes and launches together, or a publication that changes launch state (BS B07; V20).
- A launch that an acknowledgement or a reason can force past a hard stop (provider route, publication,
  launch-required items, incomplete plan) (BS B05, B07, B32, B44).
- "Override", "Admin override" or any other forbidden label of §11.1.
- A business-values field that changes shared controls, security, retries or behaviour (BS B05).
- A stored readiness-stage state machine or an extra approval chain (UX §6.3; OC-07).
- On TA pages: a wait-list promise, an SLA or deadline, support hours, an approval promise, "Pay now", a live or
  invented government-fee amount, or a start action for a route that is not selectable (UX §4.4, §9 C13; BS B07,
  B17).
- A country shown to TAs or on the public site as offered because it exists or is listed (BS B01, B02).
- An "Information only" availability that the read model does not state (Q-02).

Not in WP-02 (later packages): suspend, lift, withdraw and existing-work treatment of an offering, the impact
assessment sub-page and retirement (`ops.suspend_offering`, `ops.lift_suspension`, `ops.withdraw_offering`,
`ops.record_existing_work_treatment`, `cat.approve_transition`, `cat.assign_impact_reviewer`,
`cat.decide_impact_items`, `cat.request_impact_recheck`, `cat.retire_offering`, `cat.retire_declaration_draft`:
WP-13); elevation requests, credential reset, read grants, support view and accounting grant (WP-15; elevation
approval per Q-01); the other SA-09 decision kinds (WP-06 and later); the group set-up page TA-13, the individual
intake TA-09 and the bulk pages (WP-03, WP-04; used here only through the existing pages, LD-02); the public country
pages (WP-20); services per group (UAT-07, a Kind 2 change in the bulk lane, Q-10).

## 5. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Where does the second SuperAdmin approve a new or restored SuperAdmin? Core refuses `iam.approve_account` for the role SuperAdmin (`second_superadmin_required`); the second person acts through `iam.approve_elevation`, which CC assigns to WP-15. CC row `iam.approve_account` says "Second person for a SuperAdmin account (K-2P)"; that note does not match the code. | `superadmin-1` creates a SuperAdmin on the rebuilt SA-06. The receipt says a second SuperAdmin must approve. `superadmin-2` opens the account and finds no approve action; the request expires (elevation lifetime) and the account stays "Waiting for approval". Likelihood: high for every SuperAdmin creation or restoration during the transition. | Pull the approve and decline of the two kinds `create_superadmin` and `restore_superadmin` into WP-02, on the SA-06 account detail, with the K-2P rule shown. Until then, link to the existing elevation page (LD-02) from the receipt and the account detail. Correct the CC note. |
| Q-02 | P1 | Which availability facts does TA-02 show? Core returns to a TA only the offerings launched for that TA; suspended and withdrawn ones stay visible with a reason. A route that is not launched is invisible, and no "Information only" fact exists. UI-PLAN TA-02 lists "Available for new applications", "Information only" and "Not available". | The design derives "Information only" from reason codes. A TA tells a customer that a route exists that no SuperAdmin approved. Or the design shows nothing and A02 has no pass criterion. Likelihood: certain without a decision. | Show the two facts that the read model states: "Available for new applications" and "Not available for new applications" with the reason. A route that is not launched stays absent (BS B07: information display "may" continue). Do not show "Information only" until a read model states it. Record this as a deviation from the TA-02 text. |
| Q-03 | P1 | Eligibility, inclusions and exclusions, and a declared dependency are not in `cat.offering_display`. UX §3.1 step 1 and §4.1 require eligibility before intake. The declaration holds the population, the purposes, the travel-date window, the promise and the dependency. | A TA promises a customer the tourist e-visa for a trip in 2 days, or the transit e-visa without a tourist e-visa. The draft or the submission is refused later, after the customer paid the TA. Likelihood: medium. | Raise a Kind 1 projection request (facts that Core holds), like P-02. Until it is served, TA-03 omits the block and the run record marks A19 "partly met". TA-03 never shows "Not declared" for a declared fact. |
| Q-04 | P2 | How does the proof show a visible offering that cannot be selected? Suspend and lift are WP-13 commands. | A24 and C6 cannot run on `lane-ui`, so TA-03's main not-selectable state is proven only by test. Likelihood: certain without a decision. | Suspend and lift the proof offering (never a seeded one) through the existing launch page (LD-02) in step C6. Withdrawn, binding-missing and values-incompatible states by test. |
| Q-05 | P1 | Which surface records the launch and expansion decisions? AD-13 lists launch on SA-09, and SA-05 says "each via SA-09", but WP-06 first builds SA-09. AD-13 keeps "Publish offering values" and "Record structural approval" on their own page. | WP-02 builds launch as a plain form with a collapsed confirmation. The SuperAdmin launches without reviewing the effect and the acknowledged unsupported items. WP-06 then rebuilds the form. Likelihood: high. | WP-02 builds the launch and expansion decisions with the SA-09 anatomy (A71) as the first SA-09 decision kind; WP-06 reuses it. Publish values and structural approval stay on SA-05 panels. |
| Q-06 | P2 | UX §3.2 asks to name the declared filing provider. The offering read model carries no provider name; the declaration carries a route reference only. | TA-03 shows "synthetic:provider-1", or invents a provider name. Likelihood: medium. | Say "Filed by a provider that TravelMudra approved for this service" until a provider name exists as a fact. Never show the route reference. |
| Q-07 | P2 | How does a SuperAdmin enter a declaration body? Today it is a JSON text area. | The SuperAdmin pastes a malformed body and gets a code such as `item_value_not_permitted` with the field "(body)". Likelihood: medium, staff only. | Accept a JSON text area in WP-02 with a "start from the current head of [offering]" helper and errors in words (A45). A structured editor is later work. |
| Q-08 | P2 | Does SA-05 show the five readiness stage labels of OD §6? DC §1.3 decided the labels, but UX §6.3 forbids a stored state machine and Core holds no stage. | SA-05 shows "Operationally ready" from a page rule while the plan lacks "Fallback"; the SuperAdmin trusts the label. Likelihood: low. | Show the B07/B32 checklist (A67). Show a stage label only if it is derived from Core facts on read, never stored. Record the choice. |
| Q-09 | P2 | The proof adds a country, an offering and accounts to `lane-ui` that cannot be deleted. Is this acceptable, and must the seeded data stay untouched? | Max tests by hand and finds "SYQ Tourist e-visa (WP-02 proof)" and `wp02-*` accounts; or a proof run raises the price of a seeded offering and a later test fails. Likelihood: certain (additions), low (seed change). | Accept the additions, each marked with the run tag in its title or address. Never change seeded values, launches or listings. The run record lists every identifier. |
| Q-10 | P2 | UAT-07 (services per group, Kind 2, bulk lane) changes the path of "Start an application". | When groups carry allowed services, TA-03 offers a group that does not allow this service, and the add-applicants step refuses it. Likelihood: certain after UAT-07 lands. | WP-02 filters the group choice by country only. When UAT-07 lands, its package also filters by the group's allowed services. No WP-02 change now. |

## 6. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag and identifiers (internal record reference) | |
| Browsers and versions | |
| Assistive technology used | |
| V01 result (parts A to F; where shown) | |
| TA participants for B6 (number; results) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP02-A01 | | | |
| WP02-A02 | | | |
| WP02-A03 | | | |
| WP02-A04 | | | |
| WP02-A05 | | | |
| WP02-A06 | | | |
| WP02-A07 | | | |
| WP02-A08 | | | |
| WP02-A09 | | | |
| WP02-A10 | | | |
| WP02-A11 | | | |
| WP02-A12 | | | |
| WP02-A13 | | | |
| WP02-A14 | | | |
| WP02-A15 | | | |
| WP02-A16 | | | |
| WP02-A17 | | | |
| WP02-A18 | | | |
| WP02-A19 | | | |
| WP02-A20 | | | |
| WP02-A21 | | | |
| WP02-A22 | | | |
| WP02-A23 | | | |
| WP02-A24 | | | |
| WP02-A25 | | | |
| WP02-A26 | | | |
| WP02-A27 | | | |
| WP02-A28 | | | |
| WP02-A29 | | | |
| WP02-A30 | | | |
| WP02-A31 | | | |
| WP02-A32 | | | |
| WP02-A33 | | | |
| WP02-A34 | | | |
| WP02-A35 | | | |
| WP02-A36 | | | |
| WP02-A37 | | | |
| WP02-A38 | | | |
| WP02-A39 | | | |
| WP02-A40 | | | |
| WP02-A41 | | | |
| WP02-A42 | | | |
| WP02-A43 | | | |
| WP02-A44 | | | |
| WP02-A45 | | | |
| WP02-A46 | | | |
| WP02-A47 | | | |
| WP02-A48 | | | |
| WP02-A49 | | | |
| WP02-A50 | | | |
| WP02-A51 | | | |
| WP02-A52 | | | |
| WP02-A53 | | | |
| WP02-A54 | | | |
| WP02-A55 | | | |
| WP02-A56 | | | |
| WP02-A57 | | | |
| WP02-A58 | | | |
| WP02-A59 | | | |
| WP02-A60 | | | |
| WP02-A61 | | | |
| WP02-A62 | | | |
| WP02-A63 | | | |
| WP02-A64 | | | |
| WP02-A65 | | | |
| WP02-A66 | | | |
| WP02-A67 | | | |
| WP02-A68 | | | |
| WP02-A69 | | | |
| WP02-A70 | | | |
| WP02-A71 | | | |
| WP02-A72 | | | |
| WP02-A73 | | | |
| WP02-A74 | | | |
| WP02-A75 | | | |
| WP02-A76 | | | |
| WP02-A77 | | | |
| WP02-A78 | | | |
| WP02-A79 | | | |
| WP02-A80 | | | |
| WP02-A81 | | | |
| WP02-A82 | | | |
| WP02-A83 | | | |
| WP02-A84 | | | |
| WP02-A85 | | | |
| WP02-A86 | | | |
| WP02-A87 | | | |
| WP02-A88 | | | |
| WP02-A89 | | | |
| WP02-A90 | | | |
| WP02-A91 | | | |
| WP02-A92 | | | |
| WP02-A93 | | | |
| WP02-A94 | | | |
| WP02-A95 | | | |
| WP02-A96 | | | |
| WP02-A97 | | | |
| WP02-A98 | | | |
| WP02-A99 | | | |
| WP02-A100 | | | |
| WP02-A101 | | | |
| WP02-A102 | | | |
| WP02-A103 | | | |
| WP02-A104 | | | |
| WP02-A105 | | | |
| WP02-A106 | | | |
| WP02-A107 | | | |
| WP02-A108 | | | |
| WP02-A109 | | | |
| WP02-A110 | | | |
| WP02-A111 | | | |
| WP02-A112 | | | |
| WP02-A113 | | | |
| WP02-A114 | | | |
| WP02-A115 | | | |
| WP02-A116 | | | |
| WP02-A117 | | | |
| WP02-A118 | | | |
| WP02-A119 | | | |
| WP02-A120 | | | |
| WP02-A121 | | | |
| WP02-A122 | | | |
| WP02-A123 | | | |
| WP02-A124 | | | |
| WP02-A125 | | | |
| WP02-A126 | | | |
| WP02-A127 | | | |
| WP02-A128 | | | |
| WP02-A129 | | | |
| WP02-A130 | | | |
| WP02-A131 | | | |
| WP02-A132 | | | |
| WP02-A133 | | | |
| WP02-A134 | | | |
| WP02-A135 | | | |
| WP02-A136 | | | |
| WP02-A137 | | | |
| WP02-A138 | | | |
| WP02-A139 | | | |
| WP02-A140 | | | |
| WP02-A141 | | | |
| WP02-A142 | | | |
| V01 proof | | | |
