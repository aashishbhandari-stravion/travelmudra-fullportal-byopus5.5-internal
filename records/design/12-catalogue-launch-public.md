# TravelMudra design record 12 — Catalogue, launch control and public site

Owner: design-phase agent for the orchestrator. Date: 2026-10-04. Status: proposed for orchestrator review.
Authority, in order: `internal/records/BUILD_SPEC.md` (rules B01–B47); architecture brief revision 2 (`00-architecture-brief.md`); `ENGINEERING_OVERRIDES.md`; environment inventory 2026-10-04; foundation contract `01-foundation-contract.md` (binding). This record adds module detail. It does not edit the contract. Every place where this module needs a contract change is in Section 8.

Scope: Catalogue (B05, B06), launch control owned by Operations (B07, with the B32 per-offering measures plan required before launch), the public site (B01), the B02 rollout gate as it applies to catalogue and launch, and the B41 verification items that fall in this scope.

This is an internal record. It cites rule IDs. Product source, tests, comments, content files and commit messages MUST NOT copy rule IDs, record identifiers (`CCR-…`, `OD-…`, `RI-…`) or internal paths (brief §0).

## 0. Reading notes

### 0.1 Code locations

| Path | Content | Writer of |
|---|---|---|
| `src/modules/catalogue/` | Catalogue module: `api.ts`, `decl/` (decl/1 schema, item rules, capability requirements), `baseline/` (bv/1 schema), `impact/` (derivation, recheck), `commands/`, `tasks/` | `cat_` tables only |
| `src/modules/operations/launch/` | Launch control sub-area of Operations: launch plans, decisions, suspension, withdrawal, treatments, `launchDecision` | launch `ops_` tables listed in Section 2.3 only |
| `src/web/public/` | Public site renderer, static search index, public routes. No import of any module, kernel database API or policy (static test T-C52) | nothing (reads files) |
| `content/public/` | Versioned static public content (JSON). Public-fit only | — |
| `catalogue/synthetic/` | Synthetic declarations and baselines for local testing (labelled synthetic) | — |
| `src/cli/seo/` | `tm seo check` crawl and search-readiness check | report file only |

### 0.2 Test level vocabulary

The computed task text names the integration level "integration over real persisted SQLite". Brief revision 2 and EO-01 replaced SQLite with PostgreSQL 16. This record follows the brief: "integration" means real persisted PostgreSQL in a per-test-file database cloned from the migrated template (contract §10.1). "Multi-process" means several concurrent `tm_app` clients or separate OS processes against the same database, with fault points or process kill where named.

### 0.3 Places where the brief or contract reads differently from the spec (resolved here or by a change request)

| ID | Text | Resolution |
|---|---|---|
| K-01 | Contract §2.24: the `engineering` actor writes "never other business facts". Contract §6.3 and B05/B06: a release supplies declarations, bindings and release impact through Catalogue. | The engineering actor MAY run exactly the catalogue release commands in Section 3.3. CCR-01. |
| K-02 | Contract §3.4 stores `cat_bindings.status`; contract §6.3 `bindingStatus(tx, id, releaseId)` derives support against a release. | Support is derived against the active release's `capability_set` at every use. The stored column records registration state only. CCR-05. |
| K-03 | Contract §2.13 and I-05: provider handoff is unavailable (no approved route). B41 requires tests of every service shape. | A synthetic provider route exists only in `test` and `local_test` for synthetic offerings. Real third-party offerings stay unlaunchable. CCR-10. |
| K-04 | Contract §5.3 `catalogue.read_selectable`: TA sees "only published + launched for the TA audience". B07: "truthful information display may continue". | `launch_state = 'launched'` stays true during suspension and withdrawal, so a TA in the audience continues to see the offering with its unavailable state. CCR-09 states this. |
| K-05 | Brief §2: `tm` CLI includes the SEO crawl check. Brief §1: Playwright is a dev-only dependency. | `tm seo check` loads Playwright dynamically and fails with a clear message when dev dependencies are absent. It runs from a development checkout before release. |

No other conflict between the brief and the spec was found in this scope.

## 1. Responsibilities and non-responsibilities

### 1.1 This module owns

| # | Responsibility | Rules |
|---|---|---|
| R1 | Countries and their listing state. | B02, B05 |
| R2 | Offerings: stable service identity (country, service code, service mode), catalogue availability, head governing identities. | B05, B03 |
| R3 | Versioned structural declarations (`decl/1`) with per-item status `supported`, `incomplete`, `unsupported`, `unresolved`, and the action-to-item dependency map used by control stage 5, 6 and 9. | B05, B04, B02 |
| R4 | Support basis of each declaration: engineering release with attributed commit, or the product owner's outside-product approval recorded by a SuperAdmin for the exact version and scope. | B05 |
| R5 | Behaviour bindings and their derived support against the active release. | B05, B39 |
| R6 | Business baselines (`bv/1`): price, processing estimate, required-documents description, process overview. Draft, preview of price and impact, publication. | B05, B06, B17 |
| R7 | Publication records: actor, before/after, reason, recorded and publication time, effective condition, affected scope, accountable review. | B06 |
| R8 | Impact assessments and items for affected unfiled work, the recheck task, and the derived `impactFor` answer used by controls. Release-supplied affected scope and business impact. | B06, B23 |
| R9 | Pure evaluation of declared travel-date rules for Core's group travel-date recheck. | B06 |
| R10 | Launch plans (B32 measures plan and operating readiness), launch and scope expansion, suspension, existing-work treatment, lifting, withdrawal, and the per-action launch effect with the "more restrictive per action" rule. Admission refusal of selection and all new intake including drafts. | B07, B32, B02 |
| R11 | Synthetic countries, offerings, declarations and baselines for every service shape, for `test` and `local_test` only. | B04, B37, B41 |
| R12 | Public site: static versioned content, pages, unique titles and descriptions, canonical HTTPS URLs on `b2b.travelmudra.co`, sitemap, robots, JSON-LD with business locality only when verified, public search over static content only. | B01 |
| R13 | The crawl/SEO check tool and its report. | B01, B41 |

### 1.2 Other owners (this module does not do these)

| Concern | Owner | Interface this module uses or offers |
|---|---|---|
| Accounts, roles, sessions, MFA, policy decisions | Identity & Access | `policy.authorize`, `policy.scope`, `identity.getAccount` |
| Application and group facts, governing-id writes, price records, transitions, continuation, readiness basis, pending-on-action, travel-date recheck task and timing notices | Core | Core writers in CCR-07; `core.applyBaselinePriceReduction` (contract §6.4) |
| Operator readiness judgements, incidents, custody, artifacts, failure classification | Operations (other sub-areas) | `operations.openIncident` for country-defect attribution |
| Payment status and money | Payment Records | read-only through Core |
| Notices and their delivery evidence | TA Delivery | called by Core inside Core writers |
| Intake attempts and their catalogue snapshot | Intake | `catalogue.snapshotForIntake`, Core admission |
| B32 measure computation, projections, queues | Derived Views | reads `ops_launch_plans` measure definitions |
| Release manifest, cutover, admission | Kernel and `tm` CLI | reads `sys_releases`, `sys_installation` |
| Web shell, CSRF, origin checks, session handling | Web shell (`src/web`) | route registration with `Action` |
| Production hosting, DNS activation, TLS for the public hostname | Not selected (B37) | the SEO check runs locally only |

Catalogue never writes `core_`, `ops_` or other tables. Launch control never writes `cat_` tables. Cross-owner effects use the named writers inside one transaction (contract §6.11).

## 2. Data model and tables owned

### 2.1 Structural declaration `decl/1`

A declaration body is one JSON object with schema id `decl/1`. Every key below is optional in the parser so that a SuperAdmin can register a draft. A missing key is `incomplete`. A key MAY hold `{ "unresolved": <UNRESOLVED_REASON> }`. The parser never fills a default.

```ts
export const UNRESOLVED_REASONS = [
  'owner_policy_pending','engineering_pending','parked_prep_only_cutoff','parked_custody_route_policy',
  'parked_provider_route','parked_cancellation','unselected_price_fee_formula','unselected_other_mode_fee',
] as const;
export const DECL_ITEM_KEYS = [
  'serviceMode','custodyPaths','promise','eligibility.population','eligibility.travelDateRules','actorsActions','authority',
  'controls.gates','controls.submitChecks','controls.withdrawalCutoff','controls.otherCutoffs','documents','dependencies',
  'progressMapping','financialConditions.servicePrice','financialConditions.governmentFee','financialConditions.priceFeeRelation',
  'originals','originals.returnPolicy','outcomeEvidence','deliveryEvidence','completionEvidence','cancellation','provider',
  'operatingReadiness',
] as const;
export const ITEM_STATUSES = ['supported','incomplete','unsupported','unresolved'] as const;
export const ITEM_LAUNCH_CLASSES = ['launch_required','action_scoped'] as const;
```

Item table. "L" = `launch_required`: launch and every new-case action need it `supported`. "A" = `action_scoped`: only the named dependent actions need it; an unresolved value leaves those actions visibly unavailable and MUST be acknowledged at launch (Section 3.4, OD-12-02).

| Item key | Declared content | Complete when | Capability required | Class | Mode rules |
|---|---|---|---|---|---|
| `serviceMode` | one of `SERVICE_MODES` | equals `cat_offerings.service_mode` | `shape.<mode>` | L | — |
| `custodyPaths` | `{ electronic: boolean, physical: boolean }` | at least one true | `custody.electronic` and/or `custody.physical` | L | `preparation_only` ⇒ `physical` original custody not declared (see `originals`) |
| `promise` | `{ deliverable: 'government_outcome' or 'validated_packet' or 'provider_outcome', claimsGovernmentResult: boolean, summary: string ≤ 500 }` | all fields present | — | L | `preparation_only` ⇒ `validated_packet`, `claimsGovernmentResult = false` (B04); `third_party_filed` ⇒ `provider_outcome` |
| `eligibility.population` | `{ nationality: 'IND', passportType: 'ordinary', residence: 'IND', purposes: ('tourism' or 'business')[] ≥ 1 }` | all fields present | — | L | any other value ⇒ `unsupported` with `population_out_of_scope` (B02) |
| `eligibility.travelDateRules` | `{ minPassportValidityDaysAfterReturn: int ≥ 0, minDaysBeforeTravelStartToSubmit: int ≥ 0, maxDaysBeforeTravelStartToSubmit: int ≥ 1 or null }` | all fields present (null is a declared "no maximum") | — | L | used by Section 2.6 |
| `actorsActions` | `{ localSteps: { code, actor: 'assigned_operator' or 'ta' or 'superadmin' }[] ≥ 1, externalActs: EXTERNAL_ACT_KINDS[] }` | step codes unique | `shape.<mode>` | L | `travelmudra_filed` ⇒ `government_submission` (+ `government_fee_payment` when fee `tm_funded`); `preparation_only` ⇒ `[]`; `third_party_filed` ⇒ `provider_handoff` only |
| `authority` | `{ externalAuthority: { kind: 'government' or 'provider', label ≤ 120 }, taConfirmationTextVersion: string, applicantConsentStatement: boolean }` | all present | — | L | `preparation_only` ⇒ `externalAuthority` names the authority the TA files with; TravelMudra files nothing |
| `controls.gates` | `{ gate2: 'applicable' or 'not_applicable', readiness: 'required' }` | both present | — | L | `travelmudra_filed` ⇒ `gate2 = 'applicable'` (B27); other modes ⇒ `not_applicable` (no inferred Gate 2) |
| `controls.submitChecks` | `SUBMIT_CHECKS[]` (`mandatory_documents_present`, `identity_evidence_present`, `population_confirmed`, `travel_dates_valid`); empty array is a declared value | array present | — | L | — |
| `controls.withdrawalCutoff` | `{ kind: 'evidenced_government_portal_submission' or 'evidenced_provider_handoff' or 'packet_release' }` | present | — | A | `travelmudra_filed` with `custodyPaths.electronic` ⇒ MUST be `evidenced_government_portal_submission` (B24); `preparation_only` real offerings hold `{ unresolved: 'parked_prep_only_cutoff' }` (B44) |
| `controls.otherCutoffs` | `{ code, evidenceKind, appliesTo: ControlledAction }[]`; empty is declared | array present | — | L | — |
| `documents` | `{ requirements: { type: /^[a-z][a-z0-9_]{1,39}$/, mandatory: boolean, subject: 'applicant' or 'other_person', formats: ('pdf' or 'jpeg' or 'png')[] ≥ 1, maxBytes: int ≤ 5242880, validityChecks: VALIDITY_CHECKS[] }[] }` | ≥ 1 mandatory requirement with `type = 'passport'`, `subject = 'applicant'` (B15 passport primary); types unique | `docs.standard`, `docs.check.<code>` per check | L | an `other_person` requirement is never mandatory identity evidence (B15) |
| `dependencies` | `{ relations: { relationshipCode, upstreamServiceCode, requiredOutcome: Outcome, requiredArtifactType: string or null }[] }`; empty is declared | array present | `deps.declared` when non-empty | L | upstream in the same country (same group, B03) |
| `progressMapping` | `{ steps: { code, meaning: ProgressMeaning }[] }` | every `actorsActions.localSteps` code mapped exactly once | — | L | — |
| `financialConditions.servicePrice` | `{ basis: 'fixed_quoted_at_submission' }` | present | — | L | B17 |
| `financialConditions.governmentFee` | `'tm_funded'` or `'not_handled_by_travelmudra'` | present | — | L | `travelmudra_filed` ⇒ `tm_funded` (B27); other modes ⇒ explicit `not_handled_by_travelmudra` or `{ unresolved: 'unselected_other_mode_fee' }` (B27, B29) |
| `financialConditions.priceFeeRelation` | always `{ unresolved: 'unselected_price_fee_formula' }` for `tm_funded`; `'not_applicable'` otherwise | present | — | A | B29, B43; affects no executable action in this build (Accounts actions PARKED); shown as a boundary |
| `originals` | `{ held: false }` or `{ held: true, itemTypes: string[] ≥ 1 }` | present | `custody.physical` when `held` | L | `held = true` requires `custodyPaths.physical`; `preparation_only` ⇒ `held = false` (B04, B30) |
| `originals.returnPolicy` | `{ unresolved: 'parked_custody_route_policy' }` in this build when `held`; `'not_applicable'` when not held | present | — | A | B30 PARKED |
| `outcomeEvidence` | `{ outcomes: { outcome: Outcome, evidenceKinds: EvidenceKind[] ≥ 1 }[] ≥ 1 }` | every outcome applicable to the mode (contract §2.5) | — | L | `preparation_only` ⇒ only `prepared_and_handed_over`, `withdrawn`, `dependency_failed`, `cancelled` if declared |
| `deliveryEvidence` | `{ channels: DELIVERY_CHANNELS[] ≥ 1 }` | consistent with custody | — | L | — |
| `completionEvidence` | `{ requires: ('outcome_recorded' or 'document_email_and_notice' or 'original_receipt_by_owner' or 'packet_handover' or 'direct_external_record')[] ≥ 1 }` | present | — | L | electronic TM-held result ⇒ `document_email_and_notice` (B24) |
| `cancellation` | `'undeclared'` or `{ path: { code, evidenceKinds } }` | present | — | A | `'undeclared'` is a declared value: cancellation unavailable (B44) |
| `provider` | `'none'` or `{ routeRef, ownerApprovalRef }` or `{ unresolved: 'parked_provider_route' }` | present | `provider.synthetic` for synthetic routes | L for `third_party_filed`; otherwise MUST be `'none'` | B04, B15, B42, B44 |
| `operatingReadiness` | `{ requiredMeasures: MEASURE_CODES[] ≥ 1, requiredMonitors: MONITOR_CODES[] ≥ 1 }` | present | `measures.core` | L | `preparation_only` ⇒ includes `packet_handover_duration`, excludes government-result measures (B32) |

A body that violates a mode rule or a type rule is refused at registration with `validation_failed`. A body that passes the parser but lacks a key or a "complete when" condition is registered; the item is `incomplete`.

### 2.2 Item status, declaration support and dependent actions

Item status is derived by one pure function `itemStatus(key, body, offering, releaseCaps)`:

| Order | Condition | Status | Code |
|---|---|---|---|
| 1 | value is `{ unresolved: r }` | `unresolved` | `declaration_item_unresolved` (detail `r`) |
| 2 | key absent, or "complete when" fails | `incomplete` | `declaration_incomplete` |
| 3 | value outside the approved population (B02) | `unsupported` | `population_out_of_scope` |
| 4 | a required capability `id@version` is absent from the active release `capability_set` | `unsupported` | `declaration_unsupported` |
| 5 | otherwise | `supported` | — |

Statuses 1–3 are stored at registration in `cat_declarations.items`. Status 4 depends on the active release and is evaluated at use. A declaration is usable only when `cat_declarations.status = 'supported'` (it has a support basis). A draft declaration answers `declaration_unsupported` for every action.

Dependent actions (control stage in brackets). The application's governing declaration is evaluated, never the head, except for new-case actions.

| Controlled action | Items that MUST be `supported` | Failing code (stage) |
|---|---|---|
| `select_offering`, `start_intake`, `create_draft` (head declaration) | every L item | item code (5) |
| `submit` | every L item of the governing declaration | item code (5) |
| `request_assistance`, `assign`, `start_operator_work`, `assistance_entry` | `serviceMode`, `actorsActions`, `progressMapping` | item code (5) |
| `record_readiness` | `documents`, `eligibility.*`, `dependencies`, `controls.gates`, `controls.otherCutoffs` | item code (5) |
| `authorize_government_submission` | `authority`, `actorsActions`, `controls.gates`, `financialConditions.governmentFee`, `outcomeEvidence` | item code (5) |
| `authorize_government_fee_payment` | as above and `governmentFee = 'tm_funded'` | item code (5); `service_mode_not_applicable` (6) |
| `authorize_provider_handoff` | `provider`, `authority`, `actorsActions` | `provider_route_unapproved` (6) when `provider` is unresolved |
| `release_packet` | `outcomeEvidence`, `deliveryEvidence` | item code (5) |
| `record_outcome` (`cancelled`) | `cancellation` declared path | `cancellation_undeclared` (6) |
| `request_withdrawal` | `controls.withdrawalCutoff` | `withdrawal_cutoff_undeclared` (9) |
| `complete` | `completionEvidence`, `deliveryEvidence`, `originals` | item code (Core completion check) |
| original return (Operations) | `originals.returnPolicy` | `parked_custody_route_policy` |

Catalogue exports `declarationSupportFor(tx, governing, action, releaseId)` (CCR-06) that returns the blockers above with the item key in `ControlBlocker.ref` (CCR-12). The single control evaluator calls it in stage 5 and reads the stage 6/9 items through it.

### 2.3 Business baseline `bv/1`

```ts
export const zBaselineValues = z.strictObject({            // unknown keys refused: no controls, security, retries or behaviour (B05)
  schema: z.literal('bv/1'),
  servicePricePaise: zPaiseString,                         // decimal integer string, 0 ≤ value ≤ config catalogue.priceMaxPaise
  processingEstimate: z.strictObject({ minDays: zInt.min(0), maxDays: zInt.min(1), dayBasis: z.literal('calendar'), note: zText(300).optional() }),
  documents: z.array(z.strictObject({ type: zDocType, label: zText(80), description: zText(600) })).min(1),
  processOverview: z.array(z.strictObject({ step: zText(200) })).min(1).max(12),
  displayNotes: zText(500).optional(),
}).refine(v => v.processingEstimate.maxDays >= v.processingEstimate.minDays);
```

Compatibility with a declaration (pure `baselineCompatible(values, decl)`): the set of `documents[].type` equals the set of `documents.requirements[].type` of the declaration. Nothing else in the declaration is restated in the baseline. Mandatory flags, formats and size limits come from the declaration and are displayed beside the baseline wording. Text fields are plain text; the renderer escapes them. `dayBasis` is `calendar` only, because no working-day calendar is declared (RI-12-09). A price of zero is accepted only with an explicit confirmation field (RI-12-11).

### 2.4 Behaviour binding and capabilities

```ts
export const CAPABILITY_IDS = [
  'shape.travelmudra_filed','shape.preparation_only','shape.third_party_filed','custody.electronic','custody.physical',
  'docs.standard','deps.declared','measures.core','provider.synthetic',
  // plus 'docs.check.<VALIDITY_CHECK>' and 'country.<ALPHA3>' generated from closed lists
] as const;
```

- The release manifest `capability_set` lists `{ id, version, sourceDigest }` entries (CCR-11). One release MAY carry more than one version of a capability to keep earlier bindings supported.
- `requiredCapabilities(decl, offering)` (pure) returns the ids from the item table plus `country.<code>`.
- A binding row links one declaration to one exact requirement profile. `capability_id = 'profile'`. `capability_version` is the canonical string of the sorted `id@version` list, for example `country.SYN@1+custody.electronic@1+docs.standard@1+measures.core@1+shape.travelmudra_filed@1`. This keeps contract uniqueness `(declaration_id, capability_id, capability_version)`.
- Derived support (`bindingStatus`): `supported` when every `id@version` of the profile is in the active release `capability_set`; `incompatible` otherwise; `missing` when no binding row exists. No stored status is authoritative (K-02).
- For a head declaration the binding chosen at registration uses, for each capability id, the highest version present in the release.

### 2.5 Governing identities and the derived impact answer

`GoverningIds = (declarationId, baselineId, bindingId)` (contract §6.1). `cat_offerings.head_*` is the head tuple used only for new cases. An application keeps its own governing tuple (contract §9.3). There is no universal latest lookup (B06).

Each head change (baseline publication, declaration publication, release registration that changes the head or withdraws support from any binding of the offering) creates one impact assessment and increments `cat_offerings.latest_assessment_no` in the same transaction.

`impactFor(tx, applicationId, lock)` (contract §6.3 signature unchanged) is derived, fail-closed:

| Step | Condition | Result |
|---|---|---|
| 1 | application closed (`completed`, `ended_with_group`) | `none` |
| 2 | application governing tuple equals the offering head tuple and no current item has treatment `hold` | `none` |
| 3 | no current item (`is_current`) for the application | `unknown` |
| 4 | current item `valid_through_assessment_no` < `cat_offerings.latest_assessment_no` | `unknown` |
| 5 | item `applicability = 'unknown'` | `unknown` |
| 6 | item `applicability = 'unaffected'` | `none` |
| 7 | item `treatment = 'pending'` | `affected_pending` |
| 8 | item `treatment = 'hold'` | `affected_hold` |
| 9 | item `treatment = 'continue'` | `continue` |
| 10 | item `treatment = 'transition'` and Core transition `awaiting_ta_authority` | `transition_pending` |
| 11 | item `treatment = 'transition'` and Core transition `declined` | `affected_pending` |
| 12 | item `treatment = 'transition'` and Core transition `applied` | `none` |

Control mapping: `unknown` ⇒ `catalogue_impact_unknown` (stage 11); `affected_pending` and `affected_hold` ⇒ `catalogue_impact_hold` (stage 11); `transition_pending` ⇒ `transition_pending` (stage 5). Stage 11 applies to `submit`, `record_readiness`, `authorize_*` and `release_packet` (contract §8.3). Therefore unknown applicability prevents filing readiness (B06) from the commit of the head change until the recheck or a SuperAdmin decision classifies the application. A late-created application on a non-head tuple (for example an intake row accepted under an older snapshot) is `unknown` by step 3 without any item. No path makes it filing-ready by omission.

"Touched" rule used by the recheck (Section 5.1): a head change from `H_old` to `H_new` touches an application with governing tuple `G` (`G ≠ H_new`) when `G = H_old`, or when the binding of `G` changes derived support under the release that caused the change, or when the engineering statement scope names `G`. An untouched application with a decided current item keeps its decision: the recheck advances `valid_through_assessment_no` (a carry). A touched application gets a new current item.

Continuation kinds:

| Kind | Meaning | Allowed when |
|---|---|---|
| `continue_current` | The application continues on its own governing tuple. Nothing changes. | Governing declaration `supported`; governing binding derived `supported`; no transition pending. |
| `continue_on_head` | Core changes the application's governing tuple to the head tuple. | The difference between `G` and head is baseline-only (same declaration and binding), or the engineering statement classifies `G → head` as `compatible_continuation`; no external act in `authorized`, `filing_unknown` or `reconciliation_exhausted` (B23). |
| transition | Per-application structural transition (Core `core_transitions`). | SuperAdmin approval per application, engineering compatibility evidence, renewed TA authority where required (B06). |

### 2.6 Travel-date rule evaluation (for Core's recheck, B06)

`evaluateTravelDateRules(decl, baseline, input)` is pure. Input: travel start and return (`LocalDate`), `today` (`LocalDate`, Asia/Kolkata), submitted flag, original estimate window end (from Core) or `null`, passport expiry date from the current positive passport extraction or `null`. Output:

| Field | Values | Rule |
|---|---|---|
| `validity` | `valid`, `invalid`, `unknown` | `unknown` when `eligibility.travelDateRules` is not `supported` or the passport expiry is `null`; `invalid` when expiry < return + `minPassportValidityDaysAfterReturn`, or (not submitted) today > start − `minDaysBeforeTravelStartToSubmit`, or (not submitted, max not null) today < start − max |
| `timing` | `threatens_travel`, `ok`, `unknown` | uses the governing baseline `processingEstimate.maxDays` from today as the later forecast; `threatens_travel` when forecast end ≥ travel start; `unknown` when any input is missing |
| `codes` | closed reason codes | `travel_rule_passport_validity`, `travel_rule_too_late_to_submit`, `travel_rule_too_early_to_submit`, `travel_rule_unknown` (CCR-02) |

Core records the result and keeps `travel_date_recheck_pending` while `validity = 'unknown'`. Filed facts are not re-evaluated (B06). The original estimated window is never changed; the forecast is shown separately (B17). The evaluator runs inside a country adapter boundary: an exception or a time-limit breach in a country's validity check returns `unknown` with `country_defect` attribution for that country only (B36; Section 5.1).

### 2.7 Launch effect (Operations `launchDecision`)

```text
input: offering controls row (locked FOR SHARE by the caller's command), action, TA account, application admitted_launch_id or null, application lifecycle or null
effects := []
if action ∈ NEW_WORK = {select_offering, start_intake, create_draft}:
    availability ≠ 'published'                     ⇒ refuse  catalogue_not_published
    launch_state = 'not_launched'                  ⇒ refuse  offering_not_launched
    TA ∉ audience(current_launch_id)               ⇒ refuse  offering_out_of_launch_scope
    suspension active                              ⇒ refuse  offering_suspended
    withdrawal effective                           ⇒ refuse  offering_withdrawn
else (existing work; admitted_launch_id is not null):
    suspension active: treatment continue ⇒ allow; hold ⇒ hold existing_work_hold; missing ⇒ hold existing_work_treatment_missing   (rows of contract §2.14)
    withdrawal effective: lifecycle draft and action ∈ {submit, request_assistance, assign, start_operator_work, assistance_entry} ⇒ refuse offering_withdrawn
                          submitted: permits ⇒ allow; not permitted ⇒ hold withdrawal_continuation_not_permitted; action = submit ⇒ refuse offering_withdrawn
    always-allowed actions (record_outcome, release_bytes, send_document_email, complete, reconciliation, custody return, incident work) ⇒ allow
result := most restrictive of effects (refuse > hold > allow), codes := every contributing code in stage order
```

`audience(launch)` is `all_active_tas` or the named list in `ops_launch_audience`. The TA's account status is checked by policy, not here. The rule "lifting restores only previously approved scope" holds because expansion is refused while a suspension is active (Section 3.4), so the current launch decision at lifting is the decision recorded at suspension.

### 2.8 Launch plan (B32 per-offering measures plan and operating readiness)

```ts
export const MEASURE_CODES = [
  'stage_event_durations','calendar_waits_by_reason_owner','tm_controlled_waits_by_reason_owner','post_submission_correction_rate',
  'repeat_external_act_rate','wrong_association_rate','operator_effort','ta_effort','partner_effort','intake_row_yield',
  'ta_fee_reserved_count_age_value','ta_fee_paid_unrecovered_count_age_value','packet_handover_duration',
] as const;
export const MONITOR_CODES = ['unpaid_overrides','unowned_waits','travel_date_risk','external_uncertainty','custody_incidents','artifact_incidents','reporting_gaps'] as const;
export const MEASURE_DIMENSIONS = ['offering','service_mode','country','ta','operator','reason','owner','cohort_month'] as const;
export const TARGET_UNITS = ['hours','days','percent','count','rupees'] as const;
```

Measure entry (every field required; `not_applicable` requires `notApplicableReason` and no other field):

| Field | Type | Rule |
|---|---|---|
| `code` | `MEASURE_CODES` | each code in the declaration's `operatingReadiness.requiredMeasures` appears once |
| `applicability` | `applicable` or `not_applicable` | — |
| `ownerAccountId` | `acc_` | active operator or SuperAdmin at recording |
| `numerator`, `denominator` | text ≤ 300 each | non-empty |
| `startEvent`, `endEvent` | fact type from contract §2.22 | event boundaries |
| `timezone` | IANA name accepted by `Intl.DateTimeFormat` | — |
| `waitsAndPauses` | text ≤ 500 | how calendar and TravelMudra-controlled waits and pauses are treated |
| `dimensions` | `MEASURE_DIMENSIONS[]` ≥ 1 | — |
| `exclusions`, `missingTreatment` | text ≤ 500 each | missing data is never zero (B32) |
| `provisionalTarget` | `{ valueMilli: safe integer, unit: TARGET_UNITS, direction: 'at_most' or 'at_least' }` | a number is required; no default; the former 5× ambition is not offered (B32) |
| `sampleSizeNote` | text ≤ 300 | sample-size limits for the 30-day review |

Monitor entry: `code`, `ownerAccountId`, `signal` (text ≤ 300), `escalation` (text ≤ 300). Operating fields: `supportHours`, `escalationPath`, `staffing`, `peakCapacity`, `availabilityTarget`, `responseTarget`, `recoveryTarget`, `fallback` (text ≤ 500 each, all required).

`planCompleteness(plan, decl)` (pure) returns `complete` or the list of missing field paths. An incomplete plan MAY be recorded. Launch, scope expansion and lifting require a `complete` current plan.

### 2.9 Tables owned

Conventions of contract §3.1 apply to every table: `text` ids with prefix checks, `timestamptz` from the injected clock (no `DEFAULT now()`), `revision` on mutable rows, closed-set `CHECK` lists, foreign keys `ON DELETE RESTRICT`. "Insert-only" means an append-only trigger raising `TM001` on UPDATE, DELETE and TRUNCATE plus `tm_app` privileges `INSERT, SELECT` only (CCR-13).

#### 2.9.1 Catalogue (`cat_`, writer `src/modules/catalogue`)

##### `cat_countries`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `country_id` | text | no | PK `cty_` |
| `code` | text | no | `^[A-Z]{3}$` (ISO 3166-1 alpha-3, or synthetic `SYN`, `SYX`) |
| `name` | text | no | ≤ 80 chars |
| `public_slug` | text | no | `^[a-z0-9-]{2,40}$` |
| `listing_state` | text | no | `listed`, `unlisted` |
| `is_synthetic` | boolean | no | immutable |
| `created_by_kind` | text | no | `account`, `engineering` |
| `created_by_ref` | text | no | `acc_…` or engineering label |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (code)`, `UNIQUE (public_slug)`, immutable-column trigger on `code`, `is_synthetic`.

##### `cat_offerings` (guard row)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `offering_id` | text | no | PK `off_` |
| `country_id` | text | no | FK; immutable |
| `service_code` | text | no | `^[a-z0-9_]{3,40}$`; immutable |
| `service_mode` | text | no | `SERVICE_MODES`; immutable |
| `title` | text | no | ≤ 120 chars |
| `is_synthetic` | boolean | no | equals the country flag; immutable |
| `availability` | text | no | `unpublished`, `published`, `retired` |
| `head_declaration_id` | text | yes | FK `cat_declarations` |
| `head_baseline_id` | text | yes | FK `cat_baselines` |
| `head_binding_id` | text | yes | FK `cat_bindings` |
| `publication_seq` | bigint | no | 0, +1 per publication row |
| `latest_assessment_no` | bigint | no | 0, +1 per impact assessment |
| `created_by_kind`, `created_by_ref`, `created_at` | | no | |
| `retired_by`, `retired_at`, `retire_reason` | | yes | |
| `revision` | bigint | no | |

Guards: `UNIQUE (country_id, service_code, service_mode)`; `CHECK (availability <> 'published' OR (head_declaration_id IS NOT NULL AND head_baseline_id IS NOT NULL AND head_binding_id IS NOT NULL))`; immutable trigger on `country_id`, `service_code`, `service_mode`, `is_synthetic`. Lock protocol: new-case readers and impact readers `FOR SHARE`; every head change `FOR UPDATE` (contract §3.4).

##### `cat_declarations`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `declaration_id` | text | no | PK `sdv_` |
| `offering_id` | text | no | FK |
| `version_no` | integer | no | ≥ 1 |
| `decl_schema` | text | no | `decl/1` |
| `body` | jsonb | no | parsed and canonical |
| `body_sha256` | bytea | no | SHA-256 of canonical JSON |
| `items` | jsonb | no | per item: `{ declared: 'complete' or 'incomplete' or 'unresolved' or 'unsupported', code, reason, requires: string[], launchClass }` (statuses 1–3 of Section 2.2; `complete` becomes `supported` or `unsupported` against the active release at use) |
| `status` | text | no | `draft`, `supported`, `unsupported`, `retired` |
| `support_basis` | text | yes | `engineering_release`, `owner_approval` |
| `release_id` | text | yes | FK `sys_releases` (basis release, or release that registered a draft) |
| `owner_approval_id` | text | yes | FK `cat_owner_approvals` |
| `is_synthetic` | boolean | no | copied from offering |
| `created_by_kind`, `created_by_ref`, `created_at` | | no | |
| `supported_at` | timestamptz | yes | |
| `revision` | bigint | no | |

Guards: `UNIQUE (offering_id, version_no)`; `UNIQUE (offering_id) WHERE status = 'draft'`; `CHECK (status <> 'supported' OR support_basis IS NOT NULL)`; `CHECK (support_basis IS DISTINCT FROM 'engineering_release' OR release_id IS NOT NULL)`; `CHECK (support_basis IS DISTINCT FROM 'owner_approval' OR owner_approval_id IS NOT NULL)`; immutable trigger on `offering_id`, `version_no`, `body`, `body_sha256`, `items`. `unsupported` marks a declaration that a release shipped as a planning record without support; it never becomes head.

##### `cat_owner_approvals` (insert-only)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `owner_approval_id` | text | no | PK `opa_` |
| `offering_id`, `declaration_id` | text | no | FKs |
| `declaration_body_sha256` | bytea | no | MUST equal the declaration hash |
| `scope` | jsonb | no | `{ offeringId, versionNo, itemKeys[] }` exact version and scope (B05) |
| `approver_role_statement` | text | no | ≤ 200; states that the product owner approved outside the product |
| `approved_on` | date | no | Asia/Kolkata date of the outside approval |
| `evidence` | jsonb | no | `EvidenceRef[]` ≥ 1, at least one kind `owner_approval` |
| `reason` | text | no | ≥ 10 chars |
| `recorded_by` | text | no | FK account (SuperAdmin) |
| `recorded_at` | timestamptz | no | |

Guard: `UNIQUE (declaration_id)`.

##### `cat_bindings`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `binding_id` | text | no | PK `bnd_` |
| `offering_id`, `declaration_id` | text | no | FKs |
| `capability_id` | text | no | `profile` |
| `capability_version` | text | no | canonical profile string (Section 2.4) |
| `requires` | jsonb | no | `{ id, version }[]` |
| `release_id` | text | no | FK; release that supplied the binding (B05) |
| `registration_state` | text | no | `registered`, `retired` (CCR-05) |
| `registered_by_kind`, `registered_by_ref`, `registered_at` | | no | |
| `revision` | bigint | no | |

Guard: `UNIQUE (declaration_id, capability_id, capability_version)`; immutable trigger on all columns except `registration_state`, `revision`.

##### `cat_baselines`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `baseline_id` | text | no | PK `bbv_` |
| `offering_id` | text | no | FK |
| `declaration_id` | text | no | FK; declaration it was validated against |
| `version_no` | integer | no | |
| `values` | jsonb | no | `bv/1` |
| `values_sha256` | bytea | no | |
| `status` | text | no | `draft`, `previewed`, `published`, `superseded` |
| `preview_id` | text | yes | FK `cat_previews`; set while `previewed` |
| `publication_id` | text | yes | FK; set when published |
| `effective_from` | timestamptz | yes | publication commit time |
| `created_by`, `created_at` | | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (offering_id, version_no)`; `UNIQUE (offering_id) WHERE status = 'published'`; `UNIQUE (offering_id) WHERE status IN ('draft','previewed')` (one open draft); trigger: `values`, `values_sha256`, `declaration_id` immutable when `status IN ('published','superseded')`.

##### `cat_previews` (insert-only)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `preview_id` | text | no | PK `prv_` |
| `offering_id` | text | no | FK |
| `kind` | text | no | `baseline`, `declaration` |
| `baseline_id` | text | yes | FK |
| `declaration_id` | text | no | target head declaration |
| `values_sha256` | bytea | yes | baseline values previewed |
| `offering_revision` | bigint | no | offering revision when computed |
| `before_head`, `after_head` | jsonb | no | tuples |
| `summary` | jsonb | no | Section 3.2 C8 content: field diff, counts by class, price deltas (paise), reduction count and total, increase count, estimate change, timing-threat count |
| `scope_fingerprint` | bytea | no | SHA-256 over sorted ids and price-bearing state of submitted open applications on the offering |
| `affected_count` | integer | no | |
| `computed_by`, `computed_at` | | no | |

##### `cat_publications` (insert-only, B06 record)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `publication_id` | text | no | PK `pub_` |
| `offering_id` | text | no | FK |
| `publication_no` | bigint | no | = offering `publication_seq` after increment |
| `kind` | text | no | `baseline`, `declaration_owner_approved`, `declaration_release`, `binding_release` |
| `actor_kind` | text | no | `account`, `engineering` |
| `actor_account_id` | text | yes | set for `account` |
| `actor_label` | text | yes | set for `engineering` |
| `before`, `after` | jsonb | no | head tuple and the changed business values or declaration summary |
| `reason` | text | no | ≥ 10 chars |
| `evidence` | jsonb | no | `EvidenceRef[]` |
| `recorded_at` | timestamptz | no | commit attempt time |
| `publication_at` | timestamptz | no | SuperAdmin kinds: = `recorded_at`; release kinds: `sys_releases.activated_at` (deployment) |
| `effective_condition` | text | no | `new_cases_from_publication`, `new_cases_from_deployment` |
| `affected_scope` | jsonb | no | counts by class and `impact_assessment_id` |
| `accountable_reviewer_id` | text | yes | SuperAdmin accountable for affected-work review; `NULL` only for release kinds until assigned on the assessment |
| `impact_assessment_id` | text | no | FK |
| `preview_id` | text | yes | required for SuperAdmin kinds (`CHECK`) |
| `release_id` | text | no | active release at acceptance |
| `price_correction` | text | no | `none`, `mistaken_price` |
| `continuation_policy` | jsonb | yes | baseline kind: explicit per class choice |

Guards: `UNIQUE (offering_id, publication_no)`; `CHECK (actor_kind <> 'account' OR (actor_account_id IS NOT NULL AND preview_id IS NOT NULL))`.

##### `cat_impact_assessments`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `impact_assessment_id` | text | no | PK `ima_` |
| `offering_id` | text | no | FK |
| `assessment_no` | bigint | no | = offering `latest_assessment_no` after increment |
| `cause` | text | no | `baseline_publication`, `declaration_change`, `binding_change`, `release` |
| `publication_id` | text | yes | FK |
| `release_id` | text | yes | FK |
| `before_declaration_id`, `before_baseline_id`, `before_binding_id` | text | yes | head before (NULL for first publication) |
| `after_declaration_id`, `after_baseline_id`, `after_binding_id` | text | no | head after |
| `change_class` | text | no | `baseline_only`, `structural`, `binding_only`, `support_withdrawn` |
| `continuation_policy` | jsonb | yes | baseline cause: `{ drafts, submitted }` each `continue_current`, `continue_on_head` or `hold` |
| `statement` | jsonb | yes | engineering release impact statement (Section 3.3) |
| `statement_state` | text | no | `not_applicable`, `supplied`, `missing` |
| `accountable_superadmin_id` | text | yes | FK account |
| `state` | text | no | `rechecking`, `review_required`, `reviewed`, `superseded` |
| `recheck_generation` | integer | no | +1 per requested recheck |
| `counts` | jsonb | no | per applicability and treatment |
| `opened_at` | timestamptz | no | |
| `reviewed_at` | timestamptz | yes | |
| `revision` | bigint | no | |

Guards: `UNIQUE (offering_id, assessment_no)`; index `(state) WHERE state IN ('rechecking','review_required')`.

##### `cat_impact_items`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `impact_item_id` | text | no | PK `imi_` |
| `impact_assessment_id` | text | no | FK |
| `offering_id`, `application_id` | text | no | FKs |
| `is_current` | boolean | no | the application's current item |
| `valid_through_assessment_no` | bigint | no | advanced by carry (Section 2.5) |
| `from_declaration_id`, `from_baseline_id`, `from_binding_id` | text | no | application governing tuple when the item was created |
| `applicability` | text | no | `unknown`, `unaffected`, `affected` |
| `classification_code` | text | no | `IMPACT_CLASSIFICATIONS` (below) |
| `treatment` | text | no | `pending`, `continue`, `transition`, `hold` |
| `continuation_kind` | text | yes | `continue_current`, `continue_on_head` when `treatment = 'continue'` |
| `transition_id` | text | yes | FK `core_transitions` |
| `hold_owner_id` | text | yes | SuperAdmin account owning the hold |
| `decided_by_kind`, `decided_by_ref`, `decided_at` | | yes | SuperAdmin or recheck task (policy application) |
| `decision_reason` | text | yes | |
| `evidence` | jsonb | no | default `[]` |
| `recorded_at` | timestamptz | no | |
| `revision` | bigint | no | |

```ts
export const IMPACT_CLASSIFICATIONS = [
  'pending_recheck','closed_historical','filed_historical','held_while_filing_possible','left_behind_baseline_only',
  'left_behind_structural','binding_support_withdrawn','statement_compatible_continuation','statement_requires_transition',
  'statement_incompatible_hold','statement_unaffected','statement_missing','country_rule_defect','superadmin_judged',
] as const;
```

Guards: `UNIQUE (impact_assessment_id, application_id)`; `UNIQUE (application_id) WHERE is_current`; `CHECK (treatment <> 'continue' OR continuation_kind IS NOT NULL)`; `CHECK (treatment <> 'hold' OR hold_owner_id IS NOT NULL)`; index `(application_id) WHERE applicability <> 'unaffected' AND treatment IN ('pending','hold')` (contract).

##### `cat_release_registrations`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `release_id` | text | no | PK, FK `sys_releases` |
| `previous_release_id` | text | yes | release of the previous registration |
| `capability_diff` | jsonb | no | added, removed, version-changed ids |
| `declaration_ids`, `assessment_ids` | jsonb | no | effects |
| `statement_sha256` | bytea | yes | digest of the supplied impact statement |
| `registered_by_label` | text | no | engineering label |
| `registered_at` | timestamptz | no | |
| `revision` | bigint | no | |

#### 2.9.2 Launch control (`ops_`, writer `src/modules/operations/launch`)

##### `ops_offering_controls` (guard row; created with the offering through `operations.ensureOfferingControls`, CCR-08)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `offering_id` | text | no | PK, FK |
| `launch_state` | text | no | `not_launched`, `launched` |
| `current_launch_id` | text | yes | FK `ops_launch_decisions` |
| `suspension_state` | text | no | `none`, `active` |
| `current_suspension_id` | text | yes | FK |
| `withdrawal_state` | text | no | `none`, `effective` |
| `current_withdrawal_id` | text | yes | FK |
| `current_plan_id` | text | yes | FK `ops_launch_plans` |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Guards: `CHECK ((launch_state = 'launched') = (current_launch_id IS NOT NULL))`; same pairing for suspension and withdrawal; `CHECK (withdrawal_state = 'none' OR launch_state = 'launched')`. Readers `FOR SHARE`; launch commands `FOR UPDATE`.

##### `ops_launch_plans`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `plan_id` | text | no | PK `lpl_` (CCR-03) |
| `offering_id` | text | no | FK |
| `version_no` | integer | no | |
| `declaration_id` | text | no | head declaration when recorded |
| `measures`, `monitors`, `operating` | jsonb | no | Section 2.8 |
| `completeness` | text | no | `complete`, `incomplete` |
| `missing` | jsonb | no | missing field paths (empty when complete) |
| `reason` | text | no | |
| `evidence` | jsonb | no | |
| `recorded_by`, `recorded_at` | | no | |
| `state` | text | no | `current`, `superseded` |
| `revision` | bigint | no | |

Guards: `UNIQUE (offering_id, version_no)`; `UNIQUE (offering_id) WHERE state = 'current'`; plan content immutable (new version per change).

##### `ops_launch_decisions`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `launch_id` | text | no | PK `lch_` |
| `offering_id` | text | no | FK |
| `kind` | text | no | `launch`, `scope_expansion` |
| `audience_kind` | text | no | `all_active_tas`, `named_tas` |
| `declaration_id`, `baseline_id`, `binding_id` | text | no | head at approval |
| `release_id` | text | no | active release at approval |
| `plan_id` | text | no | FK; complete plan |
| `acknowledged_unavailable` | jsonb | no | `{ itemKey, code }[]`, equal to the action-scoped unresolved items of the head declaration |
| `readiness_evidence` | jsonb | no | `EvidenceRef[]` ≥ 1 (scoped readiness, B07) |
| `reason` | text | no | ≥ 10 chars |
| `approved_by`, `approved_at` | | no | |
| `state` | text | no | `current`, `superseded` |
| `supersedes_launch_id` | text | yes | FK |
| `revision` | bigint | no | |

Guards: `UNIQUE (offering_id) WHERE state = 'current'`.

##### `ops_launch_audience`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `launch_id` | text | no | PK part, FK |
| `ta_account_id` | text | no | PK part, FK account (role `ta`) |

##### `ops_suspensions`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `suspension_id` | text | no | PK `sus_` |
| `offering_id` | text | no | FK |
| `reason`, `evidence` | | no | |
| `suspended_by`, `suspended_at` | | no | |
| `restores_launch_id` | text | no | FK; current launch at suspension |
| `state` | text | no | `active`, `lifted` |
| `lifted_by`, `lifted_at`, `lift_reason`, `lift_evidence`, `lift_plan_id` | | yes | |
| `revision` | bigint | no | |

Guard: `UNIQUE (offering_id) WHERE state = 'active'`.

##### `ops_offering_withdrawals`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `withdrawal_id` | text | no | PK `owd_` |
| `offering_id` | text | no | FK |
| `effective_at` | timestamptz | no | commit time |
| `permits_unfiled_continuation` | boolean | no | explicit input; no default |
| `feasibility_evidence` | jsonb | no | `EvidenceRef[]`; ≥ 1 when permits (CHECK) |
| `reason`, `evidence`, `withdrawn_by` | | no | |
| `revision` | bigint | no | |

Guard: `UNIQUE (offering_id)` (terminal).

##### `ops_existing_work_treatments`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `treatment_id` | text | no | PK `ewt_` |
| `offering_id` | text | no | FK |
| `cause_kind` | text | no | `suspension`, `withdrawal` |
| `cause_ref` | text | no | `sus_…` or `owd_…` |
| `treatment` | text | no | `continue`, `hold`, `missing` |
| `reason`, `evidence` | | no | |
| `recorded_by`, `recorded_at` | | no | |
| `is_current` | boolean | no | |
| `supersedes_treatment_id` | text | yes | FK |

Guard: `UNIQUE (cause_ref) WHERE is_current`.

## 3. Commands

### 3.1 Behaviour common to every command in this record

| Topic | Rule |
|---|---|
| Runner | `runCommand` (contract §4.2) in one SERIALIZABLE transaction: admission and writer epoch, operation-key lookup, actor re-check with locks, `def.authorize` (calls `policy.authorize` for every touched resource), `def.handle`, operation record, commit. No email, worker, file or network effect inside a handler. |
| Actor kinds | SuperAdmin commands: `account` with role `superadmin`, status `active`, MFA verified. Engineering commands: `engineering` only (CCR-01). `support_view` never runs a command. The product owner's account is an ordinary SuperAdmin (B07). |
| Reason | Every command marked "reason" requires `_reason` ≥ 10 characters. The fact carries it. |
| Evidence | `EvidenceRef[]` (contract §2.23). An `attestation` never stands in for required evidence (B20, B33). |
| Revision | Every form shows the revisions of the aggregates it edits; the command fails with `stale_revision` on any difference. No latest-write-wins. |
| Nth retry | Same actor, same operation key, same content ⇒ the recorded result, re-authorized under current read access; the handler does not run; no new fact. |
| Same key, different content | `conflict_operation_key`; nothing written. |
| Lost acknowledgement | The client receives `outcome_unknown` and resubmits the same key or reads `GET /admin/operations/:operationKey`; at most one commit exists (unique `(actor_key, operation_key)`). |
| New key, same effect | Business guards decide (unique indexes, state conditions). A new key never bypasses a guard. |
| Competing mutator | Guard rows are locked in contract §4.1 order: `sys_installation` → actor account → `cat_offerings` → `ops_offering_controls` → `core_groups` → `core_applications` (ascending id) → `pay_*` → other rows (`cat_*` non-guard rows, `ops_*` launch rows). `40001`/`40P01` ⇒ bounded whole-command retry with the same operation identity; exhaustion ⇒ `conflict_retry_exhausted` with no rows. |
| Synthetic | In `production` configuration every command that names a synthetic country or offering fails with `unavailable_excluded` / `synthetic_not_permitted` (B37). |
| Facts | Every accepted command appends at least one fact (contract §4.2). Fact scope carries `offering_id` (and `application_id` for item decisions). `before`/`after` hold changed fields only. |
| Errors | Closed categories of contract §2.20; codes from contract §8.4 plus CCR-02. Object routes give `not_found_or_forbidden` for absent or out-of-scope ids. |

Policy actions used: existing `catalogue.edit_baseline`, `catalogue.preview`, `catalogue.publish`, `catalogue.record_owner_approval`, `catalogue.decide_impact`, `catalogue.approve_transition`, `launch.approve`, `launch.expand_scope`, `launch.suspend`, `launch.lift`, `launch.withdraw`, `launch.record_treatment`; new (CCR-04) `catalogue.manage_identity`, `catalogue.draft_declaration`, `catalogue.bind`, `catalogue.assign_impact_reviewer`, `catalogue.request_recheck`, `catalogue.register_release` (engineering only), `launch.record_plan`. All SuperAdmin-only; TA, operator, accounting grantee and support view get `not_found_or_forbidden`.

### 3.2 Catalogue commands (SuperAdmin)

#### C1 `cat.create_country`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.manage_identity` on `catalogue_admin`; reason. |
| Input | `{ code: /^[A-Z]{3}$/, name ≤ 80, publicSlug, listingState: 'listed' or 'unlisted' }` (no default; radio without preselection) |
| Checks | 1 kernel; 2 synthetic codes (`SYN`, `SYX`) only outside `production` and set `is_synthetic`; 3 code and slug unused. |
| Writes | `cat_countries` row. |
| Facts | `cat.country_created` (after: code, name, slug, listing, synthetic). |
| Tasks | none. |
| Errors | `validation_failed`; `conflict_duplicate` / `country_code_taken`, `slug_taken`. |
| Concurrency | Two creators of one code: unique index; loser `conflict_duplicate` with the existing ref. |

Listing a country approves no route (B02). A TA can create a group only in a listed country (contract §5.3); drafts still need launch admission.

#### C2 `cat.set_country_listing`

SuperAdmin; `catalogue.manage_identity`; reason. Input `{ countryId, listingState, expectedRevision }`. Checks: country exists; state differs (`validation_failed` / `listing_unchanged` otherwise). Writes `listing_state`, revision +1. Fact `cat.country_listing_changed` (CCR-03). Unlisting refuses new groups only; existing groups, drafts and applications are unchanged (B03). Concurrency: revision.

#### C3 `cat.create_offering`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.manage_identity`; reason. Engineering release registration MAY also create an offering (Section 3.3). |
| Input | `{ countryId, serviceCode, serviceMode, title }` |
| Checks | 1 kernel; 2 country exists; synthetic rule; 3 `(country, serviceCode, serviceMode)` unused. |
| Writes | `cat_offerings` (`availability = 'unpublished'`, no head); Operations writer `ensureOfferingControls` inserts `ops_offering_controls` (`not_launched`, `none`, `none`) in the same transaction (CCR-08). |
| Facts | `cat.offering_created`. |
| Errors | `conflict_duplicate` / `offering_identity_taken`; `not_found_or_forbidden` (country). |
| Concurrency | Unique index; one row. |

Creating an offering identity approves no route, provider, authority or launch (B04).

#### C4 `cat.draft_declaration`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.draft_declaration` on `offering`; reason. |
| Input | `{ offeringId, body: decl/1 JSON (≤ 64 KB), expectedOfferingRevision }` |
| Checks | 1 kernel; 2 offering exists, not `retired`; 3 parse `decl/1` (mode and type rules of Section 2.1 ⇒ `validation_failed` with item-key field errors); 4 `serviceMode` equals the offering; 5 no open draft for the offering (unique). |
| Writes | `cat_declarations` (`status = 'draft'`, `version_no = max + 1`, `items` computed, `release_id` = active release for audit). |
| Facts | `cat.declaration_registered` (after: version, body hash, item statuses). |
| Errors | `validation_failed`; `conflict_duplicate` / `declaration_draft_open`; `stale_revision`. |
| Concurrency | Two drafters: partial unique index on draft. Version numbers come from `max + 1` under the offering row lock (`FOR UPDATE`); the `UNIQUE (offering_id, version_no)` index is the guard. |

A draft has no support basis. A SuperAdmin discards a draft by `cat.retire_declaration_draft` (C4b: draft → `retired`, reason, fact `cat.declaration_status_changed`).

#### C5 `cat.record_owner_approval`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.record_owner_approval` on `offering`; reason. |
| Input | `{ declarationId, approvedBodySha256 (hex), approverRoleStatement, approvedOn: LocalDate, evidence: EvidenceRef[] ≥ 1, expectedRevision }` |
| Checks | 1 kernel; 2 declaration exists, `status = 'draft'` (`declaration_not_draft`); 3 `approvedBodySha256` equals `body_sha256` (`owner_approval_scope_mismatch`); 4 at least one evidence of kind `owner_approval`; 5 no item has declared status `unsupported`, and every `requires` capability exists in the active release (`item_unsupported_needs_release`: an outside-product approval cannot supply executable behaviour); 6 no existing approval (unique). |
| Writes | `cat_owner_approvals`; declaration `status = 'supported'`, `support_basis = 'owner_approval'`, `owner_approval_id`, `supported_at`. |
| Facts | `cat.owner_approval_recorded`, `cat.declaration_status_changed`. |
| Errors | `validation_failed`; `control_blocked` with the codes above; `conflict_duplicate`; `stale_revision`. |
| Concurrency | Unique `(declaration_id)` and the draft-state condition `WHERE status = 'draft' AND revision = $r`. |

Items that are `incomplete` or `unresolved` stay so after approval and keep blocking their dependent actions (B05). The approval covers the exact version and scope only; a later version needs its own approval or release.

#### C6 `cat.bind_declaration`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin (`catalogue.bind`) or engineering (inside Section 3.3). |
| Input | `{ declarationId }` |
| Checks | 1 declaration `supported`; 2 `requiredCapabilities` ⊆ active release `capability_set` (`binding_unavailable_in_release`). |
| Writes | `cat_bindings` row with `release_id` = active release, profile string from Section 2.4. |
| Facts | `cat.binding_registered`. |
| Errors | `control_blocked`; `not_found_or_forbidden`; `conflict_duplicate` / `binding_already_registered` (CCR-02) with the existing ref when an identical binding exists; nothing is written. |

A binding is supplied by a release; a SuperAdmin only asks the active release to supply it (B05).

#### C7 `cat.edit_baseline`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.edit_baseline` on `offering`. Reason optional. |
| Input | `{ offeringId, declarationId (target: head or a supported non-head declaration), values: bv/1 form fields, priceZeroConfirmed?: boolean, baselineId?, expectedRevision? }` |
| Checks | 1 kernel; 2 offering not `retired`; 3 target declaration `supported` and of this offering; 4 `zBaselineValues` strict parse (unknown keys such as gates, retries, security or behaviour fields ⇒ `validation_failed` / `baseline_field_not_business_value`); 5 `baselineCompatible(values, declaration)` (`baseline_incompatible`); 6 price ≤ `catalogue.priceMaxPaise`; price `0` requires `priceZeroConfirmed`; 7 create: no open draft (unique); edit: baseline status `draft` or `previewed`, revision matches. |
| Writes | Create `cat_baselines` (`draft`) or update values; a `previewed` baseline returns to `draft` and clears `preview_id`. |
| Facts | `cat.baseline_drafted` (before/after values). |
| Errors | `validation_failed`; `control_blocked` / `baseline_incompatible`; `conflict_duplicate` / `baseline_draft_exists`; `stale_revision`. |
| Concurrency | One open draft per offering (partial unique); revision on edit. |

#### C8 `cat.preview_baseline`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.preview`. |
| Input | `{ baselineId, expectedRevision }` |
| Checks | 1 baseline `draft` or `previewed`; 2 offering not retired; 3 target declaration is head, or the preview is requested through C10 for a declaration publication. |
| Computation | Read (no lock needed beyond SERIALIZABLE snapshot): head tuple, open applications of the offering through `core.openApplicationsForOffering` (CCR-07) with lifecycle, editor state, open acts, effective price, payment status. Classes: `drafts`, `submitted_unpaid`, `submitted_paid`, `submitted_filing_possible` (open act), `filed_historical`. Per class: count. Price: old head price, new price, delta; for `submitted_unpaid`: count and total paise of automatic reductions (new < effective) and count of increases that would need TA authority only under a mistaken-price correction; for `submitted_paid`: count of paid applications where new < effective (no automatic refund; adjustment decisions stay separate, B17). Estimate: old and new `maxDays`; count of submitted applications whose forecast end at new `maxDays` ≥ travel start. Documents wording diff and process overview diff. |
| Writes | `cat_previews` (summary, `scope_fingerprint`, `offering_revision`); baseline `status = 'previewed'`, `preview_id`. |
| Facts | `cat.preview_recorded` (after: preview id, counts; no personal data). |
| Errors | `control_blocked` / `baseline_not_editable`; `stale_revision`. |

The preview page lists the affected application ids with TA and class (SuperAdmin scope is all applications).

#### C9 `cat.publish_baseline`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.publish` on `offering`; reason; evidence optional. |
| Input | `{ baselineId, previewId, expectedBaselineRevision, expectedOfferingRevision, continuationPolicy: { drafts: 'continue_current' or 'continue_on_head' or 'hold', submitted: same }, priceCorrection: 'none' or 'mistaken_price' }` — every field required; the form preselects nothing. |
| Checks (order) | 1 kernel; 2 lock `cat_offerings` `FOR UPDATE`; offering exists, not `retired`, revision = expected; 3 baseline of this offering, `status = 'previewed'`, revision = expected; 4 `baseline.preview_id = previewId` (`preview_missing`); preview `values_sha256` = baseline hash, preview `offering_revision` = offering revision, preview `declaration_id` = head declaration (`preview_stale`); 5 head declaration `supported`; head binding derived `supported` (`binding_incompatible`); 6 `baselineCompatible` against head (`baseline_incompatible`); 7 recompute `scope_fingerprint`; differs from the preview ⇒ `preview_stale` (drafts count MAY differ; it is recorded); 8 `continuationPolicy` present for every class that has ≥ 1 application (`continuation_policy_missing`); 9 `priceCorrection = 'mistaken_price'` requires evidence ≥ 1 and a reason ≥ 20 chars (`mistaken_price_evidence_missing`). |
| Writes | Previous published baseline → `superseded`; this baseline → `published`, `effective_from = now`, `publication_id`; offering `head_baseline_id`, `publication_seq + 1`, `latest_assessment_no + 1`, `availability = 'published'` when the head tuple is complete, revision + 1; `cat_publications` (kind `baseline`, `publication_at = recorded_at`, `effective_condition = 'new_cases_from_publication'`, `accountable_reviewer_id` = actor, affected scope counts); `cat_impact_assessments` (`cause = 'baseline_publication'`, `change_class = 'baseline_only'`, policy, `accountable_superadmin_id` = actor, `state = 'rechecking'`). |
| Facts | `cat.baseline_published` (before/after head and values, reason, evidence, preview id), `cat.impact_assessment_opened`. |
| Tasks | `catalogue.impact_recheck` dedupe `catalogue.impact_recheck:<ima>:g1.b0`. |
| Errors | `control_blocked` (codes above); `stale_revision`; `conflict_duplicate` / `baseline_already_published` (existing publication ref). |
| Idempotency and concurrency | Nth retry replays the same publication id. A competing publication commits first ⇒ this command sees a changed offering revision ⇒ `stale_revision`/`preview_stale`; exactly one publication row per `publication_no`. A concurrent draft creation holds the offering `FOR SHARE`: it commits before (its application is on the old head and becomes `unknown` by derivation) or retries after (new head). A concurrent readiness or authorization reads the offering `FOR SHARE` through `impactFor`: before the publication it proceeds on the old head; after it is blocked with `catalogue_impact_unknown` (B06, B35). |

The accountable reviewer is the publishing SuperAdmin. This is not a second catalogue approver (B05).

#### C10 `cat.preview_declaration` and C11 `cat.publish_declaration` (owner-approved structure)

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.preview` / `catalogue.publish`; reason for publish. |
| Input | Preview: `{ declarationId, baselineId? }`. Publish: `{ declarationId, previewId, baselineId?, expectedOfferingRevision, continuationPolicy? }` |
| Checks | 1 declaration of this offering, `supported`, basis `owner_approval`, not head; 2 binding exists and is derived `supported` (`binding_missing` / `binding_incompatible`); 3 the published head baseline is compatible with the new declaration, or `baselineId` names a previewed baseline of this declaration (`baseline_incompatible`); 4 preview current as in C9; 5 offering launched ⇒ every L item of the new declaration `supported` (`launch_item_not_supported`), because new cases would otherwise become unavailable without a decision; 6 lock order and revisions as C9. |
| Writes | Head declaration, head binding and (optional) head baseline in one transaction; previous published baseline → `superseded` when replaced; `cat_publications` kind `declaration_owner_approved`; assessment `cause = 'declaration_change'`, `change_class = 'structural'`. |
| Facts | `cat.declaration_published` (CCR-03), `cat.baseline_published` when a baseline is included, `cat.impact_assessment_opened`. |
| Tasks | `catalogue.impact_recheck`. |
| Errors | as C9. |

A structural change to a launched, unsuspended offering takes effect for new cases at publication without a new launch approval (B06). Existing work is never migrated by this command; the recheck classifies it and the SuperAdmin decides (Sections 2.5, C13, C14).

#### C12 `cat.assign_impact_reviewer`

SuperAdmin; `catalogue.assign_impact_reviewer`; reason. Input `{ assessmentId, superAdminId, expectedRevision }`. Checks: assessment not `superseded`; target account is an active MFA-enrolled SuperAdmin. Writes `accountable_superadmin_id`. Fact `cat.impact_reviewer_assigned` (CCR-03). Release assessments start with no accountable SuperAdmin; until assignment the review belongs to the SuperAdmin queue (`pending_on_action.ownerKind = 'superadmin'`, `review_catalogue_impact`).

#### C13 `cat.decide_impact_items` (batch)

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.decide_impact` on each application (`application` resource); reason; evidence required for `unaffected`. |
| Input | `{ items: { itemId, expectedRevision }[] 1..200, decision: 'unaffected' or 'continue_current' or 'continue_on_head' or 'hold', holdOwnerId? }` |
| Checks (per item, all-or-nothing) | 1 kernel; 2 lock `cat_offerings` `FOR SHARE`; lock each application `FOR UPDATE` through `core.lockApplication` in ascending id order; 3 item `is_current`, revision matches, assessment not `superseded` (`impact_item_not_current`); 4 application open; 5 decision rules: `unaffected` only when `applicability = 'unknown'` and classification ∈ {`statement_missing`, `pending_recheck`, `country_rule_defect`} (`impact_decision_not_allowed`); `continue_current` per Section 2.5 (`continuation_unsupported`); `continue_on_head` per Section 2.5 (`continuation_unsupported`, `filing_possibly_occurred`); `hold` needs `holdOwnerId` = an active SuperAdmin (defaults are not inferred). 6 moving from `continue` or `hold` to another decision is allowed; moving from `transition` is refused while the Core transition is `awaiting_ta_authority` (`transition_pending`). |
| Writes | Item applicability (`affected` unless `unaffected`), treatment, `continuation_kind`, `hold_owner_id`, `decided_by_*`, `valid_through_assessment_no` = offering `latest_assessment_no`, revision + 1; `continue_on_head` ⇒ Core writer `core.recordContinuation(tx, { applicationId, impactItemId, from, to: head })` (CCR-07; Core bumps `material_revision` so readiness becomes `stale_basis`); assessment counts; assessment `state = 'reviewed'` when no item is `unknown` or `pending`. |
| Facts | `cat.impact_item_decided` per item; `core.continuation_recorded` (Core); `cat.impact_assessment_reviewed` when reviewed (CCR-03). |
| Errors | `control_blocked`; `stale_revision`; `not_found_or_forbidden`. |
| Concurrency | Competing recheck carry or another decision ⇒ item revision differs ⇒ `stale_revision` for the whole batch; nothing partial. Competing head change ⇒ the item is no longer valid (`valid_through` < latest) and the command fails with `impact_item_not_current`. |

#### C14 `cat.approve_transition` (one application)

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `catalogue.approve_transition` on `application`; reason. |
| Input | `{ itemId, expectedRevision, compatibilityEvidence: EvidenceRef[] ≥ 1, expectedApplicationRevision }` |
| Checks | 1 kernel; 2 offering `FOR SHARE`; application `FOR UPDATE`; 3 item current, `applicability ≠ 'unaffected'`; 4 target = head tuple; head declaration `supported`, head binding derived `supported`; 5 engineering compatibility evidence: the assessment statement classifies `from → head` as `requires_transition` or `compatible_continuation`, or the input carries a `release_manifest` evidence naming the target binding (`transition_evidence_missing`); 6 no external act in `authorized`, `filing_unknown`, `reconciliation_exhausted` (`filing_possibly_occurred`, B23); 7 no open Core transition (Core unique). |
| TA authority | `taAuthorityRequired = lifecycle = 'submitted' AND (statement flag OR any of promise, eligibility.*, authority, controls.*, documents, dependencies, financialConditions.*, outcomeEvidence differs between from and head)`. Drafts never need renewed authority (the TA has not submitted); the TA sees a notice. |
| Writes | Item `treatment = 'transition'`; Core writer `core.openStructuralTransition(tx, { applicationId, from, to, compatibilityEvidence, approvedBy, taAuthorityRequired })` (CCR-07): no TA authority ⇒ Core applies it now (governing ids, `material_revision + 1`); otherwise `awaiting_ta_authority` and a notice to the owning TA (`core.decide_transition` is Core's TA command). |
| Facts | `cat.impact_item_decided`; Core `core.structural_transition_proposed` or `core.structural_transition_applied` (CCR-03). |
| Errors | `control_blocked`; `stale_revision`; `conflict_duplicate` (open transition). |

A transition is per application; there is no batch form (B06). A declined transition returns the item to `affected_pending` by derivation (Section 2.5, step 11).

#### C15 `cat.request_impact_recheck`

SuperAdmin; `catalogue.request_recheck`; reason. Input `{ offeringId }`. Checks: offering exists. Writes: latest assessment `recheck_generation + 1`, `state = 'rechecking'`; or, when no assessment exists but open applications are on a non-head tuple, a new assessment with `cause = 'declaration_change'` is not invented — the command fails with `validation_failed` / `nothing_to_recheck`. Fact `cat.impact_recheck_requested` (CCR-03). Task `catalogue.impact_recheck` dedupe `…:<ima>:g<n>.b0`. Used after a terminal recheck failure or after a late-created application on an old tuple.

#### C16 `cat.retire_offering`

SuperAdmin; `catalogue.manage_identity`; reason. Input `{ offeringId, expectedRevision }`. Checks: `ops_offering_controls` `FOR SHARE`: `launch_state = 'not_launched'` or `withdrawal_state = 'effective'` (`retire_requires_not_launched`). Writes `availability = 'retired'`, `retired_*`. Fact `cat.offering_retired` (CCR-03). Effect: no new selection (already refused); open applications keep governing ids and continue under launch control; display of their governing values continues.

### 3.3 Catalogue release commands (engineering actor)

#### E1 `cat.register_release_catalogue`

| Field | Specification |
|---|---|
| Actor / authorization | `engineering` actor through `tm release register-catalogue --release <rel> --actor <label>`; `catalogue.register_release` (CCR-04). `tm cutover open` runs it as its first command after admission opens. |
| Input | `{ releaseId, catalogue: { countries[], offerings[], declarations: { offeringKey, versionNo, supported: boolean, body }[], heads: { offeringKey, versionNo }[] }, impactStatement: Statement or null }` read from the release manifest (`sys_releases.manifest.catalogue`, CCR-11). |
| Checks (order) | 1 kernel; 2 `releaseId = sys_installation.active_release_id` (`release_not_active`); 3 no `cat_release_registrations` row (`conflict_duplicate` / `release_catalogue_already_registered`); 4 synthetic entries only outside `production`; 5 per declaration: parse `decl/1`; an existing `(offering, version_no)` with a different `body_sha256` ⇒ whole command refused (`declaration_version_conflict`); identical ⇒ skipped; 6 every head declaration has its required capabilities in the release (`binding_unavailable_in_release`); 7 compute `capability_diff` against the release of the previous registration. |
| Writes | Countries and offerings named and absent (with `ensureOfferingControls`); declarations (`supported`, basis `engineering_release`, `release_id`) or (`unsupported`, planning record); bindings for every supported declaration whose profile the release satisfies (new head bindings use the highest versions); for each offering whose head tuple changes: offering head and `publication_seq`, `cat_publications` kind `declaration_release` or `binding_release` (`actor_kind = 'engineering'`, `recorded_at = now`, `publication_at = sys_releases.activated_at`, `effective_condition = 'new_cases_from_deployment'`); for each offering whose head changes or whose open applications are on a binding that this release no longer supports: one assessment (`cause = 'release'`, `change_class` per diff, `statement_state` = `supplied` or `missing`), `latest_assessment_no + 1`; `cat_release_registrations` row. |
| Facts | `cat.release_catalogue_registered` (CCR-03), `cat.declaration_registered`, `cat.binding_registered`, `cat.declaration_published`, `cat.release_impact_submitted`, `cat.impact_assessment_opened`. |
| Tasks | `catalogue.impact_recheck` per assessment. |
| Errors | `validation_failed`, `control_blocked`, `conflict_duplicate`, `maintenance` (admission closed: the command waits for open). |
| Idempotency and concurrency | Same key ⇒ replay. New key after success ⇒ `conflict_duplicate`. Crash before commit ⇒ nothing written; rerun is safe. Lost acknowledgement ⇒ `tm` retries the same key. While unregistered after open, a removed capability already makes every dependent binding derived `incompatible` (Section 2.4), so no action uses a binding the release does not support; new cases continue on the previous head only if its binding is still supported. |

A head change at deployment is not a launch and needs no second launch approval for a launched, unsuspended offering (B06). If the new head declaration is incompatible with the published baseline, new cases answer `baseline_incompatible` until a SuperAdmin publishes a compatible baseline; `tm release register` prints this before cutover (RI-12-03).

Engineering impact statement (`Statement`, B06):

```ts
interface Statement {
  readonly schema: 'rimp/1';
  readonly changes: readonly {
    readonly capabilityId: string; readonly fromVersion: string | null; readonly toVersion: string | null;
    readonly compatibility: 'compatible_continuation' | 'requires_transition' | 'incompatible_hold' | 'unaffected';
    readonly affectedOfferingKeys: readonly string[];        // MUST include every offering whose bindings require capabilityId
    readonly businessImpact: string;                          // ≤ 2000 chars, plain text, no personal data
    readonly taAuthorityRequired: boolean;
    readonly evidence: readonly EvidenceRef[];                // ≥ 1, kind release_manifest or external_reference (test report digest)
  }[];
}
```

A change entry whose `affectedOfferingKeys` omits an offering computed from bindings is refused (`statement_narrows_scope`). A changed capability without an entry gives `statement_state = 'missing'` for the affected assessments.

#### E2 `cat.submit_release_impact`

Engineering actor; `catalogue.register_release`. Input `{ releaseId, impactStatement }`. Checks: registration exists; statement covers at least the computed scope (`statement_narrows_scope`); an existing supplied statement can only be widened (more offerings, stricter compatibility) (`statement_narrows_scope`). Writes `cat_impact_assessments.statement`, `statement_state = 'supplied'`, `recheck_generation + 1`; `cat_release_registrations.statement_sha256`. Facts `cat.release_impact_submitted`. Task recheck. Business impact goes to the accountable SuperAdmin through the assessment page (B06).

### 3.4 Launch control commands (Operations, SuperAdmin)

#### L1 `ops.record_launch_plan`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `launch.record_plan` (CCR-04) on `offering`; reason. |
| Input | `{ offeringId, measures[], monitors[], operating{}, evidence[], expectedControlsRevision }` (Section 2.8) |
| Checks | 1 kernel; 2 offering exists, not retired; 3 schema parse (field errors); 4 measure owners are active staff accounts; 5 timezone names valid. Incompleteness is not an error. |
| Writes | `ops_launch_plans` new version (`completeness`, `missing`); previous current → `superseded`; `ops_offering_controls.current_plan_id`, revision + 1. |
| Facts | `ops.launch_plan_recorded` (CCR-03; after: version, completeness, missing paths). |
| Errors | `validation_failed`; `stale_revision`. |

#### L2 `ops.approve_launch`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `launch.approve` on `offering`; reason; `readinessEvidence` ≥ 1. |
| Input | `{ offeringId, audience: { kind: 'all_active_tas' } or { kind: 'named_tas', taAccountIds: AccountId[] 1..500 }, planId, acknowledgedUnavailable: { itemKey, code }[], readinessEvidence, expectedControlsRevision }` |
| Checks (order) | 1 kernel; 2 lock `cat_offerings` `FOR SHARE`, `ops_offering_controls` `FOR UPDATE`, revision = expected; 3 `launch_state = 'not_launched'` (`launch_already_current`), `withdrawal_state = 'none'` (`offering_withdrawn`); 4 synthetic rule; 5 `availability = 'published'` (`catalogue_not_published`); 6 `catalogue.currentGoverning` ok: head declaration supported, every L item supported (`launch_item_not_supported` with item refs), head binding derived supported, head baseline compatible; 7 `acknowledgedUnavailable` equals the set of A items of the head declaration that are not `supported` (`launch_acknowledgement_mismatch`); 8 plan is `current_plan_id`, `completeness = 'complete'`, built for the head declaration's `requiredMeasures`/`requiredMonitors` (`launch_plan_incomplete`, `launch_plan_not_current`); 9 named TAs: each an existing TA account in `active` or `approved` status (`launch_audience_invalid`). |
| Writes | `ops_launch_decisions` (`launch`, `current`, head tuple, release, plan, acknowledgements, evidence); `ops_launch_audience` rows; controls `launch_state = 'launched'`, `current_launch_id`, revision + 1. |
| Facts | `ops.launch_approved` (before/after controls, audience size, plan id, acknowledgements, reason, evidence). |
| Errors | `control_blocked` (codes above); `conflict_duplicate` / `launch_already_current`; `stale_revision`. |
| Concurrency | Two approvers: controls row lock + partial unique current decision; the second sees `launched` ⇒ `launch_already_current`. A concurrent publication: the offering row lock (`FOR SHARE` here, `FOR UPDATE` there) serializes; the loser retries and re-evaluates. |

A published entry, a release or a completed plan is not launch approval (B07). Launch approval does not change any declaration or baseline.

#### L3 `ops.expand_launch_scope`

As L2 with: controls `launch_state = 'launched'`; `suspension_state = 'none'` (`suspension_active`, so lifting can only restore approved scope); `withdrawal_state = 'none'`; new audience is a strict superset of the current audience (`launch_audience_not_wider`; `all_active_tas` ⊃ any named list); complete current plan and readiness evidence for the added scope; acknowledgement equality re-checked against the current head. Writes a new `current` decision (`scope_expansion`, `supersedes_launch_id`), previous → `superseded`, controls `current_launch_id`. Fact `ops.launch_scope_expanded`. Applications keep their `admitted_launch_id`.

#### L4 `ops.suspend_offering`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `launch.suspend`; reason; evidence ≥ 1. Available while the audit projection is degraded (containment, B33): `privilegedElevation = false`. |
| Input | `{ offeringId, existingWorkTreatment: 'continue' or 'hold' or 'not_recorded', expectedControlsRevision }` — no preselected value. |
| Checks | 1 kernel; 2 controls `FOR UPDATE`; `launch_state = 'launched'`; `suspension_state = 'none'` (`suspension_active`). |
| Writes | `ops_suspensions` (`active`, `restores_launch_id = current_launch_id`); `ops_existing_work_treatments` (`cause_kind = 'suspension'`, treatment `continue`, `hold` or `missing` for `not_recorded`, `is_current`); controls `suspension_state = 'active'`, `current_suspension_id`. |
| Facts | `ops.offering_suspended`, `ops.existing_work_treatment_recorded`. |
| Effects | Section 2.7: new selection, intake and drafts refused; existing commitments, attempts, payment facts and duties survive; `missing` pauses unfiled preparation, packet release and filing (B07). |
| Errors | `control_blocked`; `stale_revision`. |
| Concurrency | Admission readers hold controls `FOR SHARE`: a draft committed before the suspension stands (and is existing work); a draft attempted after sees `offering_suspended` on retry. |

#### L5 `ops.record_existing_work_treatment`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `launch.record_treatment`; reason; evidence. |
| Input | `{ causeRef: sus_ or owd_, treatment: 'continue' or 'hold', expectedTreatmentId }` |
| Checks | 1 controls `FOR UPDATE`; 2 suspension cause: suspension `active`; 3 withdrawal cause: only `continue → hold` (narrowing) is allowed (`withdrawal_treatment_widening_unavailable`); 4 current treatment id = expected (`stale_revision`); 5 new treatment differs (`treatment_unchanged`). |
| Writes | New treatment row `is_current`, previous `is_current = false`, `supersedes_treatment_id`; controls revision + 1. |
| Facts | `ops.existing_work_treatment_recorded`. |

#### L6 `ops.lift_suspension`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `launch.lift`; reason; evidence ≥ 1 (scoped readiness, B07). |
| Input | `{ suspensionId, planId, acknowledgedUnavailable, expectedControlsRevision }` |
| Checks | 1 controls `FOR UPDATE`; suspension `active` (`suspension_not_active`); 2 `current_launch_id = restores_launch_id` (invariant; a difference is `internal`); 3 head checks as L2 steps 5–8 against the current head (the structure MAY have changed during suspension). |
| Writes | Suspension `lifted`, lift fields; controls `suspension_state = 'none'`, `current_suspension_id = NULL`; suspension treatment row `is_current = false`. |
| Facts | `ops.suspension_lifted` (after: restored launch id and audience size). |
| Effect | Restores exactly the previously approved scope; it never widens it (B07). |

#### L7 `ops.withdraw_offering`

| Field | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `launch.withdraw`; reason; evidence ≥ 1. |
| Input | `{ offeringId, permitsUnfiledContinuation: boolean (required, no default), feasibilityEvidence: EvidenceRef[], expectedControlsRevision }` |
| Checks | 1 controls `FOR UPDATE`; `launch_state = 'launched'`; `withdrawal_state = 'none'` (`offering_already_withdrawn`); 2 permits ⇒ feasibility evidence ≥ 1 (`withdrawal_permission_required`). |
| Writes | `ops_offering_withdrawals`; treatment row (`cause_kind = 'withdrawal'`, `continue` if permits else `hold`); controls `withdrawal_state = 'effective'`. |
| Facts | `ops.offering_withdrawn`, `ops.existing_work_treatment_recorded`. |
| Effects | Stops new selection, intake and submission; submitted unfiled work continues only if permitted, otherwise held; payment never forces it (payment status is not an input of `launchDecision`). Terminal: no relaunch command exists (RI-12-06). |

## 4. Queries, pages and routes

### 4.1 Exported queries

Catalogue (`src/modules/catalogue/api.ts`; signatures of contract §6.3 kept; additions in CCR-06):

| Query | Returns | Notes |
|---|---|---|
| `getOffering(tx, id, lock?)` | identity, mode, availability, head, `publicationSeq` | contract |
| `currentGoverning(tx, offeringId, releaseId, lock?)` | head tuple or code `catalogue_not_published`, `declaration_unsupported`, `declaration_incomplete`, `binding_missing`, `binding_incompatible`, `baseline_incompatible` (CCR-06), `synthetic_not_permitted` | used for new cases only; checks L items |
| `getDeclaration`, `getBaseline` | parsed bodies | immutable rows; MAY be cached in process by id |
| `bindingStatus(tx, id, releaseId)` | derived (Section 2.4) | |
| `declarationSupportFor(tx, governing, action, releaseId)` | `ControlBlocker[]` with `ref` = item key | stage 5/6/9 input |
| `itemStatuses(tx, declarationId, releaseId)` | per item status, code, class, dependent actions | admin and TA pages |
| `impactFor(tx, applicationId, lock?)` | Section 2.5 | stage 11 and 5 input |
| `snapshotForIntake(tx, countryId, releaseId)` | head tuples of offerings in the country | contract |
| `selectableOfferings(tx, actor, countryId?)` | offerings visible to a TA: published, launched, TA in audience; each with `selectable` and blocking codes from `launchDecision` | TA discovery; joins policy scope |
| `offeringDisplay(tx, governing)` | cost, government-fee statement, estimate, documents (declared flags + baseline wording), process overview, boundary statements | used by Core application pages with the application's governing tuple, and by discovery with the head tuple |
| `evaluateTravelDateRules(decl, baseline, input)` | Section 2.6 | pure |
| `noteGoverningBehindHead(tx, applicationId)` | void | called by Core when it creates an application on a non-head tuple: creates a current `unknown` item on the latest assessment and enqueues a recheck (liveness only; safety comes from Section 2.5 step 3) |

Operations launch (`src/modules/operations/api.ts`): `launchDecision` (contract §6.7; algorithm Section 2.7), `launchSummary(tx, offeringId)` (controls, current decision, audience size, suspension and treatment, withdrawal, current plan completeness), `ensureOfferingControls(tx, offeringId)` (writer, CCR-08).

All list queries over applications use `policy.scope` (contract §5.4). No query reads a `view_` table for a guard (B35).

### 4.2 Authenticated routes

All routes register an `Action` and a resource resolver (T-F02). All `POST` routes carry `_op`, `_csrf`, `_rev` and `_reason` where required, pass the origin check and answer `303` (contract §12.2). Authenticated pages carry `noindex` and `Cache-Control: no-store`.

TA surface:

| Path | Method | Action / resource | Shown |
|---|---|---|---|
| `/ta/catalogue` | GET | `catalogue.read_selectable` / list | Countries with ≥ 1 offering visible to this TA. Per offering: title, mode label ("TravelMudra files", "Preparation only — you file", "Filed by a declared provider"), state badge: `Available`, or `Unavailable` with the closed reason (`offering_suspended`, `offering_withdrawn`). Not-launched and out-of-audience offerings are absent. |
| `/ta/catalogue/offerings/:offeringId` | GET | `catalogue.read_selectable` / `offering` | From the head tuple: cost (service price in rupees, "fixed when you submit"); government fee statement: `tm_funded` ⇒ "TravelMudra pays the government fee and recovers the exact government amount from you, separately from the service price" (B27); boundary line "How the service price relates to the government fee is not decided yet" (`unselected_price_fee_formula`); other modes ⇒ "TravelMudra does not handle government or provider fees for this service" or the boundary `unselected_other_mode_fee`. Processing estimate ("estimate, not a guarantee", B17). Required documents: label, mandatory/optional, formats, size limit, description. Process overview. Boundary lines for every A item not supported: withdrawal unavailable (`withdrawal_cutoff_undeclared`), cancellation unavailable (`cancellation_undeclared`), original return unavailable (`parked_custody_route_policy`). Action: "Start an application" (link to Core's group selection) only when `canSelectOffering` allows; otherwise the blocking codes. Out-of-scope or not-launched id ⇒ 404. |

Operator surface:

| Path | Method | Action | Shown |
|---|---|---|---|
| `/ops/catalogue/offerings/:offeringId` | GET | `catalogue.read_selectable` | Read-only head display of published offerings. Operators read an application's governing values on Core's application page through `offeringDisplay(governing)`. |

SuperAdmin surface (`/admin/…`, all `catalogue.read_admin` for GET):

| Path | Method | Action | Shown or done |
|---|---|---|---|
| `/admin/catalogue` | GET | `catalogue.read_admin` | Countries (listing, synthetic flag) and offerings: availability, head versions, binding support, launch state, suspension, withdrawal, open impact items count, plan completeness. Synthetic rows labelled "SYNTHETIC". |
| `/admin/catalogue/countries` | POST | C1 | |
| `/admin/catalogue/countries/:countryId/listing` | POST | C2 | |
| `/admin/catalogue/offerings` | POST | C3 | |
| `/admin/catalogue/offerings/:offeringId` | GET | read | Head tuple; declaration versions with status and basis; item table (status, class, code, dependent actions, unresolved reason); bindings with derived support against the active release and the missing capabilities; baselines (draft, previewed, published, superseded); publication history; assessments; launch summary. |
| `/admin/catalogue/offerings/:offeringId/declarations` | POST | C4 | JSON body form; field errors per item key. |
| `/admin/catalogue/declarations/:declarationId` | GET | read | Body (escaped JSON), hash, items, approval record, bindings. |
| `/admin/catalogue/declarations/:declarationId/retire-draft` | POST | C4b | |
| `/admin/catalogue/declarations/:declarationId/owner-approval` | POST | C5 | The page shows the exact body hash to copy. |
| `/admin/catalogue/declarations/:declarationId/bind` | POST | C6 | |
| `/admin/catalogue/declarations/:declarationId/preview` | POST | C10 | |
| `/admin/catalogue/declarations/:declarationId/publish` | POST | C11 | |
| `/admin/catalogue/offerings/:offeringId/baselines` | POST | C7 create | |
| `/admin/catalogue/baselines/:baselineId` | GET, POST | read, C7 edit | Editor with declared document types pre-listed (wording fields empty for a new type). |
| `/admin/catalogue/baselines/:baselineId/preview` | POST | C8 | |
| `/admin/catalogue/previews/:previewId` | GET | read | Field diff, class counts, price deltas, reductions, paid-not-refunded note, estimate change, timing-threat count, affected application list. |
| `/admin/catalogue/baselines/:baselineId/publish` | POST | C9 | Form shows the preview and requires every continuation choice and the price-correction choice. |
| `/admin/catalogue/publications/:publicationId` | GET | read | Full B06 record. |
| `/admin/catalogue/impact` | GET | read | Assessments in `rechecking`, `review_required`; items `unknown`/`pending`/`hold` count; accountable SuperAdmin or "queue"; recheck task failures. |
| `/admin/catalogue/impact/:assessmentId` | GET | read | Cause, before/after, engineering statement and business impact, statement state, items with classification, application, TA, lifecycle, decision controls. |
| `/admin/catalogue/impact/:assessmentId/reviewer` | POST | C12 | |
| `/admin/catalogue/impact-items/decide` | POST | C13 | |
| `/admin/catalogue/impact-items/:itemId/transition` | POST | C14 | |
| `/admin/catalogue/offerings/:offeringId/recheck` | POST | C15 | |
| `/admin/catalogue/offerings/:offeringId/retire` | POST | C16 | |
| `/admin/launch` | GET | `catalogue.read_admin` | Launch state per offering with reasons it cannot launch (unpublished, items, binding, plan, acknowledgements). |
| `/admin/launch/offerings/:offeringId` | GET | read | Controls, decision history with audiences, suspensions and treatments, withdrawal, plan versions and missing fields, the per-action effect table for this offering (Section 2.7). |
| `/admin/launch/offerings/:offeringId/plans` | POST | L1 | |
| `/admin/launch/offerings/:offeringId/approve` | POST | L2 | Shows the A items to acknowledge; none pre-ticked. |
| `/admin/launch/offerings/:offeringId/expand` | POST | L3 | |
| `/admin/launch/offerings/:offeringId/suspend` | POST | L4 | |
| `/admin/launch/treatments` | POST | L5 | |
| `/admin/launch/suspensions/:suspensionId/lift` | POST | L6 | |
| `/admin/launch/offerings/:offeringId/withdraw` | POST | L7 | |
| `/admin/public-site` | GET | `catalogue.read_admin` | Public content version and digest of the running release, the release blockers computed from content (Section 4.4), and the last recorded SEO check summary if the release manifest carries one. |

Every boundary is shown as a labelled "Unavailable" line with its closed reason message (`src/web/messages.ts`); no route performs a boundary action.

### 4.3 Public site (B01)

#### 4.3.1 Isolation

- Public routes are registered by `src/web/public/routes.ts`. They read only the in-memory site built at startup from `content/public/`. They receive no database pool, no policy and no session. A static test (T-C52) refuses any import of `src/modules/**`, `src/kernel/db.ts` or `src/platform/{db,blobs}*` under `src/web/public/`. Therefore no private case data and no live catalogue data (prices, offerings, launch states) can reach a public page (B01).
- Public responses set no cookie. Anonymous sign-in forms are on `/sign-in`, outside the public renderer.
- Content is public-fit: no internal identifiers, no personal data, no synthetic markers in the `production` content set.

#### 4.3.2 Content model (`content/public/`)

| File | Schema (zod, strict) |
|---|---|
| `site.json` | `{ contentVersion: 'YYYY-MM-DD.n', businessName: 'TravelMudra', canonicalOrigin: 'https://b2b.travelmudra.co', defaultLocale: 'en-IN', locality: { status: 'unverified' } or { status: 'verified', verifiedOn: LocalDate, streetAddress, addressLocality, addressRegion, postalCode, addressCountry: 'IN' }, contact: { status: 'unverified' } or { status: 'verified', email, telephone? } }` |
| `pages.json` | `{ path, title (10–65 chars), description (50–160 chars), h1, sections: { heading, paragraphs[] }[], updatedOn: LocalDate, indexable: boolean }[]` |
| `countries.json` | `{ slug, name, summary (≤ 300), purposes: ('tourism' or 'business')[], updatedOn }[]` — only countries whose offerings are launched in production; the content author adds a country only with the owner's launch confirmation (RI-12-08) |

Locality and contact `verified` values are set only through a reviewed content change that carries the owner's supplied evidence in the internal record. Agents MUST NOT set them without that evidence. The public file holds no evidence identifier.

#### 4.3.3 Pages

| Path | Title rule | Content | Indexable | JSON-LD |
|---|---|---|---|---|
| `/` | from `pages.json` | business summary, supported countries list (links), how it works summary, sign-in link (`rel="nofollow"`) | yes | `Organization` (`@type` `["Organization","TravelAgency"]`, `name`, `url`, `logo`; `address` only when locality verified), `WebSite` (`name`, `url`) |
| `/countries` | from `pages.json` | list of `countries.json`; when empty: "No destination is open for applications yet." | yes | `BreadcrumbList` |
| `/countries/:slug` | "<name> visa services for travel agents — TravelMudra" (unique) | static summary and purposes; "Sign in to see current prices, processing estimates and required documents." No price, estimate or document list (live catalogue data) | yes | `BreadcrumbList` |
| `/about` | from `pages.json` | business details from `site.json`; locality and contact only when verified, otherwise the section is omitted | yes | `Organization` as on `/` |
| `/how-it-works` | from `pages.json` | static process description (TA-managed, applicant has no account) | yes | `BreadcrumbList` |
| `/search` | "Search — TravelMudra" | results over static content | no (`noindex,follow`) | none |
| `/robots.txt`, `/sitemap.xml` | — | generated | — | — |
| unknown path | "Page not found — TravelMudra" | 404 page | no | none |

Rendering rules: server-rendered complete HTML, no client script (`script-src 'none'`), `<html lang="en-IN">`, `<meta charset="utf-8">`, viewport meta, exactly one `h1`, `<title>` and `<meta name="description">` unique per indexable page (build fails on duplicates), `<link rel="canonical" href="https://b2b.travelmudra.co<path>">`, Open Graph `og:title`, `og:description`, `og:url` (canonical), `og:type`. Assets: one stylesheet and a favicon under `/assets/public/`, same origin. JSON-LD is serialized with `<` escaped as `<`.

URL rules: lowercase paths, no trailing slash except `/`, no `.html`, no query string on indexable pages. In `production` configuration: a request for a non-canonical form of a known path (trailing slash, uppercase, `/index.html`) answers `301` to the canonical path; a request with a `Host` other than `b2b.travelmudra.co` answers `301` to the canonical origin; HTTP answers `301` to HTTPS when the server terminates TLS. Hostname activation and TLS hosting are not selected (B37).

Headers: CSP of contract §12.4 with `script-src 'none'`; `Cache-Control: public, max-age=300`; HSTS in production over HTTPS. In every configuration except `production` (and the check's production-public mode): `X-Robots-Tag: noindex, nofollow`, robots `Disallow: /`, and `<meta name="robots" content="noindex,nofollow">`, so a local test server is never indexed.

`robots.txt` (production): `User-agent: *`, `Allow: /`, `Disallow:` lines for `/ta/`, `/ops/`, `/admin/`, `/accounts/`, `/sign-in`, `/staff/`, `/search`, then `Sitemap: https://b2b.travelmudra.co/sitemap.xml`.

`sitemap.xml`: `urlset` (sitemaps.org 0.9 namespace) with every indexable page, `loc` canonical, `lastmod` = page `updatedOn` (content date, not build time).

#### 4.3.4 Public search

`GET /search?q=` searches only the static pages and country entries. The index is built at startup: NFC, lowercase, tokens of letters and digits (Unicode), title weight 3, h1 weight 2, body weight 1. Query: NFC, trimmed, ≤ 100 characters (longer ⇒ a message "Search terms are too long", HTTP 200, no search), ≤ 8 tokens. Result: up to 20 pages with title, description and link. The query is escaped on output and never logged (route diagnostics carry `routeId` only). Rate limit: in-process `RateLimiterMemory` 60 requests per minute per client address (no database). No private data can be searched because the index holds only public content.

### 4.4 Crawl and search-readiness check (`tm seo check`)

Purpose: record the public-page crawl/SEO check before first release (B01, B41).

Invocation: `tm seo check [--content content/public] [--report <path>] [--strict]`. The tool:

1. Builds the public site from the content directory with the `production` public configuration.
2. Starts a public-only HTTP server on an ephemeral `127.0.0.1` port (no database, no other routes). Canonical URLs are mapped to this origin for fetching; asserted URLs stay canonical.
3. Crawls from `/` and from `sitemap.xml` with Playwright Chromium twice: JavaScript disabled (raw server HTML) and enabled (rendered DOM). Parses HTML with `cheerio`.
4. Evaluates the assertions below.
5. Writes a JSON report and a text summary: tool version, content version and SHA-256 of the content directory, source commit, configuration digest, time, pages, assertion results, release blockers. Exit code 0 when no assertion fails; `--strict` also fails on blockers. The orchestrator stores the report as release evidence in internal records.

| ID | Assertion | Result on failure |
|---|---|---|
| A01 | Every sitemap URL and every crawled internal link answers 200 `text/html; charset=utf-8`; no internal link answers 404 | fail |
| A02 | Raw HTML (JS disabled) contains the same `h1`, title, description and main text as the rendered DOM (crawlable server-rendered HTML) | fail |
| A03 | Exactly one `<title>` and one meta description per indexable page; lengths within bounds; unique across indexable pages | fail |
| A04 | Canonical link present, absolute, `https://b2b.travelmudra.co`, clean path rules, equals the page's sitemap `loc` | fail |
| A05 | Non-canonical variants (`/about/`, `/About`, `/index.html`, other host) answer 301 to the canonical URL | fail |
| A06 | `robots.txt`: 200 `text/plain`; disallows private prefixes and `/search`; disallows no sitemap URL; contains the `Sitemap:` line | fail |
| A07 | Indexable pages carry no `noindex` (meta or header); `/search` and the 404 page carry `noindex` | fail |
| A08 | `sitemap.xml` is valid XML in the 0.9 namespace; no duplicates; equals the set of indexable pages reached by crawl (no orphans, no extras) | fail |
| A09 | JSON-LD parses; `@context` is `https://schema.org`; home and about carry `Organization`; country pages carry `BreadcrumbList` | fail |
| A10 | Locality verified ⇒ `address` with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry = "IN"`; locality unverified ⇒ no `address`, `geo` or `areaServed` locality in any JSON-LD | fail when violated; unverified locality is reported as release blocker `public_locality_unverified` |
| A11 | No live or private data: no currency amounts, no `Offer`/`price` JSON-LD, no entity id pattern `[a-z]{3}_[0-7][0-9A-HJKMNP-TV-Z]{25}`, no email address except a verified contact, no `/ta/`, `/ops/`, `/admin/` links, no synthetic marker (`Synthetica`, `@synthetic.test`, `SYN` country) | fail |
| A12 | Every network request made by the browser goes to the same origin (no third-party request) | fail |
| A13 | Security and privacy headers: CSP with `script-src 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, no `Set-Cookie` | fail |
| A14 | Basic structure: `lang`, `charset`, viewport, one `h1`, every `img` has `alt`; page weight ≤ 200 KB | fail |
| A15 | Search: a term from a page finds that page; a nonsense term finds nothing; a 101-character query returns the "too long" message; `<script>` in `q` is escaped | fail |
| A16 | Countries list is empty ⇒ release blocker `public_no_supported_country` | blocker |
| A17 | Contact unverified ⇒ release blocker `public_contact_unverified` | blocker |
| A18 | No privacy or terms page in content ⇒ release blocker `public_legal_pages_unsupplied` (OD-12-03) | blocker |

The check runs locally only. It does not prove indexing by a real search engine, DNS activation or production hosting (B37). Its blocker codes are a closed list in `src/cli/seo/codes.ts`; they are tool results, not runtime reason codes.

## 5. Internal tasks and timers

### 5.1 `catalogue.impact_recheck` (contract §2.21: owner catalogue, effect class `none`, system, max attempts 5, failure owner accountable SuperAdmin)

| Aspect | Specification |
|---|---|
| Dedupe key | `catalogue.impact_recheck:<ima id>:g<generation>.b<batch>`; one task per batch; the record step enqueues the next batch in the same transaction. |
| Payload | `{ assessmentId, generation, batch, afterApplicationId or null }` (ids only). |
| Prepare | Assessment exists; `generation = recheck_generation`; assessment is the latest of its offering (`assessment_no = latest_assessment_no`), otherwise `skip: obsolete` (the newer assessment's recheck covers the applications) and the assessment becomes `superseded` in the record step of the newer task. |
| Effect | none (database only). |
| Record (one SERIALIZABLE transaction per batch of ≤ `catalogue.recheckBatchSize` = 100) | Lock offering `FOR SHARE`; read open applications of the offering after the cursor via `core.openApplicationsForOffering` (ascending id); for each application with governing ≠ head or a binding whose support changed: classify (table below) under `core.lockApplication(…, 'update')`; write or carry items with conditional updates; apply explicit continuation policy (baseline cause) through Core writers; apply automatic price reduction through `core.applyBaselinePriceReduction` for submitted unpaid applications when the new price is lower (B17); apply a mistaken-price increase proposal through `core.proposePriceIncrease` (CCR-07) when the publication says `mistaken_price` and the new price is higher; update counts; enqueue the next batch or set the assessment `review_required` (items `unknown`/`pending` remain) or `reviewed`. |
| Facts | `cat.impact_item_recorded` (new item or carry), `cat.impact_item_decided` (policy application, actor `system_task`, decision basis = publication id and policy), Core facts from Core writers (`core.price_reduced`, `core.price_increase_proposed`, `core.continuation_recorded`). |
| Nth run / crash | Re-lease after a crash re-runs the batch. Items use `UNIQUE (impact_assessment_id, application_id)` and conditional updates `WHERE applicability = 'unknown' AND revision = $r`; carries are idempotent (`valid_through` set to the same number); Core writers are idempotent (`not_lower` after a reduction, open-increase unique index, notice dedupe keys). No duplicate item, reduction or notice. |
| Permission re-check | System task without `onBehalfOf`. The accountable SuperAdmin's status is not a permission input; a suspended or inactive accountable SuperAdmin makes the hold owner and review owner the SuperAdmin queue (`accountable_superadmin_inactive`), never an automatic decision. |
| Failure | Retryable failures back off; terminal failure ⇒ `onTerminalFailure` sets the assessment `review_required` with `last_recheck_failed`, visible on `/admin/catalogue/impact`; unclassified applications stay `unknown` (fail closed). C15 starts a new generation. |
| Country containment | Classification calls country validity checks only through `evaluateTravelDateRules` inside the adapter boundary (time limit `catalogue.countryRuleTimeoutMs` = 200 ms per call). An exception or timeout for country X classifies the item `country_rule_defect` (`unknown`), opens an Operations `country_defect` incident once per assessment and country (`openIncident` dedupe `country_defect:<ima>:<cty>`), and continues with other applications. In-process runaway work MAY still interrupt the shared process (B36 OWNER_DECISION); recovery is the re-lease. |

Classification (first match):

| # | Condition | Applicability | Classification | Treatment |
|---|---|---|---|---|
| 1 | application closed | `unaffected` | `closed_historical` | — |
| 2 | external act in `authorized`, `filing_unknown` or `reconciliation_exhausted` | `affected` | `held_while_filing_possible` | `pending` (impacts held separately while filing may have occurred, B23) |
| 3 | a government submission or provider handoff is `filed_evidenced` and no act is open | `unaffected` | `filed_historical` | — (filed facts remain historical, B06) |
| 4 | application untouched by this change and has a decided current item | carry | — | unchanged |
| 5 | baseline cause, application on the old head | `affected` | `left_behind_baseline_only` | policy for its class (`drafts` or `submitted`): `continue_current`, `continue_on_head` (Core continuation) or `hold` (owner = accountable SuperAdmin) |
| 6 | release or declaration cause, binding of `G` no longer supported | `affected` | `binding_support_withdrawn` | `pending` |
| 7 | release cause, statement entry covers `G` with `unaffected` | `unaffected` | `statement_unaffected` | — |
| 8 | statement `compatible_continuation` | `affected` | `statement_compatible_continuation` | `pending` (SuperAdmin decides, B06) |
| 9 | statement `requires_transition` | `affected` | `statement_requires_transition` | `pending` |
| 10 | statement `incompatible_hold` | `affected` | `statement_incompatible_hold` | `hold` (owner = accountable SuperAdmin or queue) |
| 11 | statement missing for a changed capability | `unknown` | `statement_missing` | `pending` |
| 12 | declaration change (owner-approved), application on the old head | `affected` | `left_behind_structural` | policy when supplied and the policy is `continue_current` or `hold`; otherwise `pending` |

### 5.2 Timers

This scope owns no periodic job and no date-triggered behaviour. Publications, launches, suspensions and withdrawals take effect at commit (`effective_from`, `effective_at` = transaction time). Future-dated publication is not built (RI-12-12). Clock skew therefore affects no catalogue or launch decision; the order of effects is the commit order of guard-row locks and the fact log `(tx_id, seq)`.

## 6. Deliberate boundaries in this scope

| Boundary | Source | Visible as | Code |
|---|---|---|---|
| Candidate countries are planning inputs | B02 | Not shown publicly or to TAs; no "coming soon" list; an offering exists only as `unpublished` or not launched | — |
| Student, diplomatic and work visas; non-Indian or non-ordinary passports; non-resident applicants | B02 | `eligibility.population` outside scope ⇒ item `unsupported` on the admin item table; offering cannot launch | `population_out_of_scope` |
| Historical and in-flight imports, other-tool integration | B02, B42 EXCLUDED | No catalogue import route; release registration loads declarations only | — |
| Price versus government-fee formula | B29, B43 unselected | Item `financialConditions.priceFeeRelation` unresolved; TA offering page boundary line; admin item table | `unselected_price_fee_formula` |
| Other-mode fee policy | B27, B29 unselected | Item `financialConditions.governmentFee` unresolved for non-TravelMudra-filed offerings that do not declare `not_handled_by_travelmudra`; offering cannot launch | `unselected_other_mode_fee` |
| Preparation-only withdrawal cut-off | B44 PARKED | Item `controls.withdrawalCutoff` unresolved; TA page boundary line; withdrawal refused | `withdrawal_cutoff_undeclared` (item reason `parked_prep_only_cutoff`) |
| Generic erroneous-case cancellation | B44 PARKED | `cancellation: 'undeclared'`; TA page boundary line | `cancellation_undeclared` |
| Provider route and customer-data sharing | B15, B42, B44 | Real `third_party_filed` offerings hold `provider` unresolved ⇒ cannot launch; admin launch page lists the reason | `provider_route_unapproved` |
| Shared-original return policy | B30 PARKED | Item `originals.returnPolicy` unresolved for physical offerings; TA page boundary line | `parked_custody_route_policy` |
| Launch scope dimension | contract OD-03 | Audience only; admin launch page states "scope = offering × TA audience" | — |
| Launch with action-scoped unavailable items | OD-12-02 | Explicit acknowledgement list on the launch record and admin page | `launch_acknowledgement_mismatch` |
| Scope narrowing, relaunch after withdrawal | not in spec | Not offered; suspension is the narrowing tool; a withdrawn offering shows "Withdrawn" | `offering_withdrawn` |
| Estimate as SLA | B17 | Estimate labelled "estimate, not a guarantee" | — |
| 5× ambition | B32 | Not offered as a target; every target is entered | — |
| Business locality, contact, legal pages | B01, OD-12-03 | Omitted from public pages; SEO check release blockers | `public_locality_unverified`, `public_contact_unverified`, `public_legal_pages_unsupplied` |
| Production hosting, DNS, TLS for `b2b.travelmudra.co` | B37 | Not deployed; the SEO check runs locally; local servers are `noindex` | — |
| Synthetic data in production | B37 | Seed, synthetic offerings and synthetic provider route refused | `synthetic_not_permitted` |

### 6.1 Synthetic offerings for local testing (B04, B37, B41)

Synthetic data lives in `catalogue/synthetic/` and is loaded by `tm seed synthetic` in `test` and `local_test` only, through E1 with a synthetic manifest section and engineering label `synthetic-seed`, then C7–C9 and L1–L2 as the synthetic SuperAdmin `SYN Admin One <admin1@synthetic.test>` with evidence kind `synthetic_label`. `--no-launch` leaves offerings unlaunched. Every name is prefixed `SYN`; prices are labelled synthetic on admin pages.

| Offering key | Country | Mode | Custody | Notable declared items | Launchable |
|---|---|---|---|---|---|
| `SYN/syn_tourist_evisa/travelmudra_filed` | `SYN` Synthetica | `travelmudra_filed` | electronic | Gate 2 applicable; fee `tm_funded`; withdrawal cut-off `evidenced_government_portal_submission`; price-fee relation unresolved (acknowledged) | yes |
| `SYN/syn_business_paper/travelmudra_filed` | `SYN` | `travelmudra_filed` | physical + electronic | originals held; return policy unresolved (acknowledged) | yes |
| `SYN/syn_tourist_prep/preparation_only` | `SYN` | `preparation_only` | electronic | fee `not_handled_by_travelmudra`; withdrawal cut-off unresolved `parked_prep_only_cutoff` (acknowledged); outcome `prepared_and_handed_over` only | yes |
| `SYN/syn_tourist_provider/third_party_filed` | `SYN` | `third_party_filed` | electronic | provider `{ routeRef: 'synthetic:provider-1', ownerApprovalRef: 'synthetic' }`; capability `provider.synthetic` (present only in test and local-test releases, CCR-10) | yes (test/local_test only) |
| `SYN/syn_tourist_provider_unapproved/third_party_filed` | `SYN` | `third_party_filed` | electronic | provider unresolved `parked_provider_route` | no — shows the boundary |
| `SYN/syn_transit_dependent/travelmudra_filed` | `SYN` | `travelmudra_filed` | electronic | dependency on `syn_tourist_evisa` outcome `issued` with artifact `evisa_grant` | yes |
| `SYX/syx_tourist_evisa/travelmudra_filed` | `SYX` Synthetica Beta | `travelmudra_filed` | electronic | second country for country-isolation tests; its country adapter has a test-only fault hook | yes |

## 7. Test plan

Levels: **U** unit (pure functions, no database); **I** integration over a real persisted PostgreSQL per-file database (contract §10.1; the task text says SQLite, see Section 0.2); **M** multi-process (concurrent `tm_app` clients or separate OS processes, fault points, process kill, Playwright). "Persisted" lists rows and facts read back from the database after the action. "Forbidden" lists effects that MUST be absent, verified by reading tables, the fact log, the task table or the response bodies. Every I/M test runs with the synthetic seed of Section 6.1 unless stated.

### 7.1 Unit

| ID | Test | Rules | Lvl | Persisted / observed | Forbidden |
|---|---|---|---|---|---|
| T-C01 | `decl/1` parser and `itemStatus` matrix: for every item key, absent ⇒ `incomplete`; `{unresolved}` ⇒ `unresolved`; capability missing ⇒ `unsupported`; valid ⇒ `supported`; mode rules refuse invalid bodies | B05, B04 | U | statuses and codes per key | no default value appears in the parsed body; absent never becomes `supported` |
| T-C02 | Population scope: purposes `student`, `work`, `diplomatic`; nationality ≠ `IND`; passport ≠ `ordinary`; residence ≠ `IND` | B02 | U | `unsupported` / `population_out_of_scope` | none of these launchable (`currentGoverning` not ok) |
| T-C03 | `bv/1` strict schema: keys `gates`, `retries`, `security`, `controls`, `behaviour` refused; float price refused; price string → `bigint`; document types must equal declared types | B05 | U | field error codes | no baseline value outside the closed field list is accepted |
| T-C04 | Capability profile and derived binding support with one and two versions of a capability in the release | B05, B39 | U | profile strings; support answers | an unreleased capability version never answers `supported` |
| T-C05 | `launchDecision` full matrix: not launched / out of audience / suspension (continue, hold, missing) / withdrawal (permits, not) × draft / submitted × every controlled action of contract §2.14 | B07 | U | effect and codes per cell; most restrictive wins; codes include every contributor | no cell yields `allow` for `select_offering`, `start_intake`, `create_draft` unless launched, in audience, unsuspended, not withdrawn; payment status is not an input |
| T-C06 | `impactFor` derivation table (Section 2.5), including late-created application without item, carried item, superseded assessment, declined transition | B06 | U | result per row | a non-head application without a valid current item never answers `none` |
| T-C07 | `evaluateTravelDateRules`: valid, invalid (each rule), unknown (rules unresolved, missing passport expiry), forecast threatens travel | B06, B17 | U | outputs | `unknown` never maps to `valid` |
| T-C08 | Public renderer: duplicate title or description fails the build; canonical path normalization; JSON-LD omits `address` when locality unverified; `<` escaped in JSON-LD; non-production config adds `noindex` | B01 | U | rendered strings | no price, id pattern or synthetic marker in production render |
| T-C09 | Launch plan completeness: each missing field path listed; `not_applicable` without reason incomplete; preparation-only plan without `packet_handover_duration` incomplete; target without a number incomplete | B32 | U | `missing` lists | no default target or owner is filled |

### 7.2 Integration (real PostgreSQL)

| ID | Test | Rules | Lvl | Persisted | Forbidden |
|---|---|---|---|---|---|
| T-C10 | C1/C3: offering creation inserts `cat_offerings` and `ops_offering_controls` in one transaction; fault `command.before_commit` ⇒ neither row; synthetic country refused under `production` config | B34, B37, B35 | I | rows, `cat.offering_created` fact with actor and reason | no controls row without offering and vice versa; no row for refused synthetic |
| T-C11 | Owner-approval path: C4 draft → C5 with wrong hash (refused) → C5 with right hash → `supported`, basis `owner_approval`; second C5 refused; declaration with an `unsupported` item refused | B05 | I | approval row with exact hash, scope, evidence; status change fact | no approval row or status change on refusal; incomplete items still block dependent actions after approval |
| T-C12 | E1 release registration: declarations `supported` with `release_id`; bindings with release; launched offering head changes; publication `kind = declaration_release`, `publication_at = activated_at`; ops launch decisions count unchanged; new drafts get new governing ids; existing applications keep theirs; rerun same key replays; new key ⇒ `release_catalogue_already_registered`; changed body for an existing version ⇒ whole command refused | B05, B06, B39 | I | rows, facts, assessment `cause = 'release'` | no new launch decision; no change to any `core_applications.governing_*`; no partial registration |
| T-C13 | Unreleased structure: a manifest naming a capability absent from the active release ⇒ refused; a SuperAdmin C6 for such a declaration ⇒ `binding_unavailable_in_release`; removing a capability in a later release makes the old binding derived `incompatible` before any registration | B05, B39 | I | derived statuses | no `supported` answer from stored columns alone |
| T-C14 | Baseline lifecycle: publish without preview ⇒ `preview_missing`; edit after preview ⇒ back to draft, publish ⇒ `preview_missing`; preview, another publication, publish ⇒ `preview_stale`; successful publish writes every B06 field (actor, before/after, reason, recorded and publication time, effective condition, affected scope, accountable reviewer, assessment, preview) | B06 | I | `cat_publications` row, `cat.baseline_published` fact | no publication row on any refusal; no head change |
| T-C15 | Preview content with seeded applications (2 drafts, 2 submitted unpaid, 1 submitted paid, 1 with open authorized act, 1 filed): counts, price deltas and reduction totals equal hand-computed values | B06, B17 | I | `cat_previews.summary` | no application data in the fact (`after` holds ids and counts only) |
| T-C16 | Business values cannot alter controls: C7 with extra keys refused; existing published baseline unchanged; declaration unchanged | B05 | I | refusal, unchanged rows | no `cat_baselines` change; no fact |
| T-C17 | Recheck after baseline publication: between commit and recheck, `ops.record_readiness` and `core.authorize_external_act` refuse with `catalogue_impact_unknown`; after recheck the explicit policy is applied (`continue_on_head` moves drafts to the head tuple through Core; `continue_current` keeps tuple); unpaid submitted application with higher quoted price gets one automatic reduction and one notice; paid application unchanged; filed application `filed_historical` | B06, B17, B23 | I | items, Core price records, notices, continuation facts | no reduction for paid; no second reduction or notice on re-run; filed facts and governing ids of filed application unchanged |
| T-C18 | Price increase: routine publication with a higher price leaves every quoted price unchanged; `mistaken_price` publication creates one Core `increase_proposed` per affected submitted application; TA declines ⇒ communicated price honoured | B17 | I | price records and states | no automatic increase; no second open proposal |
| T-C19 | Filing possibly occurred: application with `filing_unknown` act ⇒ item `held_while_filing_possible`; C13 `continue_on_head` and C14 refused with `filing_possibly_occurred`; `continue_current` and `hold` allowed | B06, B23 | I | item treatment | governing ids unchanged; no transition row |
| T-C20 | C13 decisions: `continue_current` refused when the governing binding is derived incompatible; `hold` requires an owner and sets `pending_on_action` to SuperAdmin with `review_catalogue_impact`; stale item revision ⇒ whole batch refused | B06, B35 | I | item rows, facts | no partial batch |
| T-C21 | C14 transition for a submitted application with material diff ⇒ Core transition `awaiting_ta_authority` and TA notice; TA accepts ⇒ governing ids change, `material_revision` +1, readiness `stale_basis`; TA declines ⇒ `impactFor = affected_pending`; draft transition applies immediately | B06, B19 | I | `core_transitions`, governing ids, facts | no governing change before TA authority when required; no batch transition route |
| T-C22 | Release impact statement missing ⇒ items `unknown` (`statement_missing`), filing readiness blocked; E2 with a narrower scope refused; E2 covering scope ⇒ recheck classifies per statement | B06 | I | assessment `statement_state`, items | no item becomes `unaffected` without statement or SuperAdmin evidence |
| T-C23 | Group travel-date edit (with Core): affected unfiled applications get Core recheck using `evaluateTravelDateRules`; application whose governing declaration has unresolved travel rules keeps `travel_date_recheck_pending`; filed application facts unchanged | B06 | I | Core recheck facts, blockers | no change to filed facts or original estimated window |
| T-C24 | L2 preconditions, one at a time: unpublished, L item unsupported, binding missing, plan incomplete, plan not current, acknowledgement mismatch, named TA not a TA ⇒ refused with blockers; success writes decision, audience, controls, fact with actor, reason, evidence, plan id, acknowledgements | B07, B32 | I | rows and fact on success | no decision or controls change on any refusal |
| T-C25 | Admission refusal: not launched, out of audience, suspended, withdrawn ⇒ `select_offering`, `core.create_draft`, `intake.start_*` refused (individual and bulk), including drafts; TA catalogue page hides not-launched offerings (404 on direct link) and shows suspended/withdrawn with reason | B07, B10 | I | refusal responses; page content | no `core_applications`, `intake_attempts` or task row created |
| T-C26 | Scope expansion and lifting: expand named list {TA1} → {TA1, TA2}; expansion while suspended refused; lift restores {TA1, TA2} exactly; TA3 still refused; expansion to a non-superset refused | B07 | I | decisions chain, audience rows | lifting never widens; no decision row on refusal |
| T-C27 | Suspension treatments: `missing` ⇒ `start_operator_work`, `record_readiness`, `authorize_*`, `release_packet` held with `existing_work_treatment_missing`; `record_outcome`, reconciliation, custody return, incident work and valid delivery allowed; recording `continue` releases the hold; existing assignments, payment entries and acts unchanged | B07 | I | treatment rows, blockers | no change to Core, Payment or Operations facts of existing applications by the suspension |
| T-C28 | Withdrawal: permits=false ⇒ submitted unfiled work held, drafts refused submission, recorded `payment_received` does not change the effect; permits=true ⇒ continues; widening treatment refused; narrowing allowed; second withdrawal refused | B07 | I | withdrawal and treatment rows | payment state never alters the launch effect; no relaunch path |
| T-C29 | Conflict rule: suspension `continue` + withdrawal not permitted ⇒ hold; suspension `hold` + withdrawal permitted ⇒ hold; suspension `continue` + withdrawal permitted ⇒ allow; blocker codes list both controls | B07 | I | evaluator results under real rows | none less restrictive than the most restrictive single control |
| T-C30 | Nth retry, changed content, lost acknowledgement for C9, L2, L4, E1: same key ⇒ replay with same ids and no new fact; same key with different content ⇒ `conflict_operation_key` and no rows; fault `command.lose_ack` ⇒ `outcome_unknown`, then lookup and resubmit return the accepted result; exactly one publication / decision / suspension | B35, B41 | I | operation rows, single effect | no duplicate rows or facts |
| T-C31 | Access: TA, operator, accounting grantee, support view, suspended SuperAdmin and anonymous on every `/admin/catalogue/*` and `/admin/launch/*` route (GET and POST) ⇒ `not_found_or_forbidden` (or sign-in); operation lookup by a SuperAdmin suspended after the command ⇒ denied; TA sees only offerings in its audience in list, direct link and search | B10, B11, B41 | I | responses | no operation row, fact or task for refused POSTs |
| T-C32 | Audit shape and append-only: every catalogue and launch fact carries actor, role, command, operation, subject, before/after, reason, evidence, release; `tm_app` UPDATE/DELETE on `cat_publications`, `cat_owner_approvals`, `cat_previews` fails | B06, B33 | I | facts | no mutation of history rows |
| T-C33 | Synthetic seed: each offering of Section 6.1 present with declared items; preparation-only declares no originals; TravelMudra-filed electronic cut-off is portal submission; unapproved provider offering refused at L2 with `provider_route_unapproved`; synthetic provider offering launches under `local_test`; `tm seed synthetic` refused under `production` | B04, B37, B41 | I | seed rows, launch decisions | no synthetic row in a `production` database; no launch of the unapproved provider offering |
| T-C34 | Display truth: TA offering page shows cost, fee statement, estimate label, documents with flags, process overview and boundary lines from the head; an application page (Core) shows the application's governing baseline values after a later publication | B01, B06, B17 | I | rendered HTML via cheerio | no head value on the application page; no SLA wording |
| T-C35 | Shape smoke per synthetic offering (with Core milestone): draft and submission admitted under launch; provider handoff available only for the synthetic provider offering; preparation-only has no government outcome option | B04, B41 | I | Core rows | no handoff authorization for the unapproved provider offering |

### 7.3 Multi-process

| ID | Test | Rules | Lvl | Persisted | Forbidden |
|---|---|---|---|---|---|
| T-C40 | Publication versus readiness/authorization race: 50 iterations of concurrent C9 and `core.authorize_external_act` on one application | B06, B35, B41 | M | each authorization's governing tuple and the publication's commit order (`tx_id`); when the authorization commits first, its item is `held_while_filing_possible` | no authorization committed after the publication on the old tuple without a current item |
| T-C41 | Suspension versus draft creation and intake start: 50 concurrent `core.create_draft` / `intake.start_bulk` against one L4 | B07, B35, B41 | M | every created draft and attempt has a fact `tx_id` before the suspension's | no draft or attempt accepted after the suspension commit |
| T-C42 | Two SuperAdmins publish two baselines from separate previews concurrently | B06, B35 | M | exactly one `published` baseline, one publication row, offering revision +1; loser `preview_stale`/`stale_revision` | no second head change; no orphan assessment |
| T-C43 | Two SuperAdmins approve launch with different keys concurrently | B07, B35 | M | one `current` decision; loser `launch_already_current` | no second decision row |
| T-C44 | C13 decision racing the recheck carry on the same item | B06, B35 | M | one committed outcome; the other `stale_revision` or skip | no lost decision; no item with two current rows |
| T-C45 | Recheck crash: kill the server process after the record commit of batch 1 and before batch 2 lease; also fault `task.before_record` | B35 | M | items once; one reduction and one notice per application; next batch runs from the stored cursor | no duplicate items, reductions, notices or continuation facts |
| T-C46 | Release interruption: kill `tm release register-catalogue` before commit and after commit before acknowledgement; between open and registration, an application on a removed capability is blocked by `binding_incompatible` | B39, B06, B41 | M | after rerun: one registration, one set of declarations and assessments | no application governing change; no use of an unsupported binding in the gap |
| T-C47 | Accountable SuperAdmin suspended during recheck | B10, B35 | M | items recorded by the system task; hold owner shown as SuperAdmin queue (`accountable_superadmin_inactive`) | no automatic decision beyond the recorded policy |
| T-C48 | Country containment: the `SYX` adapter throws and then exceeds its time limit during recheck of an assessment that covers `SYX` and `SYN` applications | B36, B41 | M | `SYX` items `country_rule_defect`, one Operations `country_defect` incident; `SYN` items classified | no `SYN` item left unclassified by the `SYX` error; no data access outside the adapter's inputs |

### 7.4 Public site and crawl check

| ID | Test | Rules | Lvl | Persisted / observed | Forbidden |
|---|---|---|---|---|---|
| T-C50 | `tm seo check` over the repository content: assertions A01–A15 pass; blockers listed as A16–A18 and A10 locality; report written with content digest and source commit | B01, B41 | M | report file, exit code | no third-party request; no assertion skipped silently |
| T-C51 | Negative fixtures, one per assertion: duplicate title, missing canonical, `noindex` on an indexable page, orphan sitemap URL, `address` in JSON-LD while unverified, price string, entity id, synthetic marker, external script, cookie, unescaped search query | B01 | M | each fixture fails its named assertion id | none passes |
| T-C52 | Public isolation: static import test for `src/web/public/**`; crawl of a running `local_test` server with seeded synthetic applications finds no id, email or synthetic applicant data; public responses set no cookie; `local_test` answers `Disallow: /` and `X-Robots-Tag: noindex` | B01, B10, B37 | I | crawl transcript | no private or live catalogue value in any public response |
| T-C53 | Public search: static-only results; 101-character query message; `<script>` escaped; diagnostics capture shows `routeId` and no query text; rate limit answers 429 after 60 requests per minute | B01, B33, B38 | I | responses, captured diagnostics | no query string in logs; no database query issued (instrumented pool count = 0) |

### 7.5 B41 coverage in this scope

| B41 item | Tests |
|---|---|
| Foundation invariants used here (guards, operation shape, version bindings) | T-C04, T-C10, T-C12, T-C30, T-C32 |
| Record the public-page crawl/SEO check before first release | T-C50 (report is release evidence), T-C51, T-C52 |
| Real persisted Nth retries, changed-content conflict, lost acknowledgement | T-C30, T-C45, T-C46 |
| Concurrent rule cases | T-C40, T-C42, T-C44 |
| Launch/suspension admission | T-C25, T-C27, T-C28, T-C29, T-C41, T-C43 |
| Wrong-scope and revoked access | T-C31, T-C47 |
| Electronic, physical and preparation-only shapes | T-C33, T-C35 |
| Release interruption | T-C46 |
| Local country errors | T-C48 |

## 8. Contract change requests

Each request names the contract section, the exact change and the reason. None changes a business rule.

| # | Section | Proposed change | Reason |
|---|---|---|---|
| CCR-01 | §2.24 actor kinds, `engineering` row | Append to "May write": "catalogue release registration through `cat.register_release_catalogue`, `cat.submit_release_impact` and `cat.bind_declaration` (declarations, bindings, release publications, release impact assessments)." | B05: a release supplies its binding; B06: engineering supplies release impact through Catalogue. Contract §6.3 already lists these as CLI commands. |
| CCR-02 | §8.4 reason codes | Add: `listing_unchanged`, `binding_already_registered`, `country_code_taken`, `slug_taken`, `offering_identity_taken`, `offering_retired`, `declaration_version_conflict`, `declaration_not_draft`, `declaration_draft_open`, `owner_approval_scope_mismatch`, `item_unsupported_needs_release`, `binding_unavailable_in_release`, `baseline_field_not_business_value`, `baseline_incompatible`, `baseline_not_editable`, `baseline_draft_exists`, `baseline_already_published`, `preview_missing`, `preview_stale`, `continuation_policy_missing`, `mistaken_price_evidence_missing`, `impact_item_not_current`, `impact_decision_not_allowed`, `continuation_unsupported`, `transition_evidence_missing`, `statement_narrows_scope`, `release_not_active`, `release_catalogue_already_registered`, `nothing_to_recheck`, `retire_requires_not_launched`, `accountable_superadmin_inactive`, `synthetic_not_permitted`, `unselected_price_fee_formula`, `unselected_other_mode_fee`, `parked_prep_only_cutoff`, `travel_rule_passport_validity`, `travel_rule_too_late_to_submit`, `travel_rule_too_early_to_submit`, `travel_rule_unknown`, `launch_plan_incomplete`, `launch_plan_not_current`, `launch_already_current`, `launch_audience_not_wider`, `launch_audience_invalid`, `launch_acknowledgement_mismatch`, `launch_item_not_supported`, `suspension_active`, `suspension_not_active`, `offering_already_withdrawn`, `withdrawal_permission_required`, `withdrawal_treatment_widening_unavailable`, `treatment_unchanged`. | Closed codes for every refusal in Section 3 and every boundary in Section 6. |
| CCR-03 | §2.22 fact types; §1.2 prefixes; §2.23 subject types | Add fact types `cat.country_listing_changed`, `cat.offering_retired`, `cat.declaration_published`, `cat.impact_reviewer_assigned`, `cat.impact_assessment_reviewed`, `cat.impact_recheck_requested`, `cat.release_catalogue_registered`, `ops.launch_plan_recorded`, `core.structural_transition_proposed`, `core.structural_transition_declined`. Add prefix `lpl` → `ops_launch_plans` (Operations) and subject type `launch_plan`. | Every accepted command appends a fact of its own module; Core transitions need a proposed/declined fact beside `core.structural_transition_applied`. |
| CCR-04 | §5.2 actions; §5.3 rule table | Add actions `catalogue.manage_identity`, `catalogue.draft_declaration`, `catalogue.bind`, `catalogue.assign_impact_reviewer`, `catalogue.request_recheck`, `launch.record_plan` (SuperAdmin only, reason required), and `catalogue.register_release` (actor kind `engineering` only; every account actor ⇒ `not_found_or_forbidden`). | Commands in Section 3 need policy actions; the engineering actor needs one explicit rule instead of an implicit bypass. |
| CCR-05 | §3.4 `cat_bindings` | Replace `status (supported, incompatible, retired)` by `registration_state (registered, retired)` and add `requires jsonb`, `release_id NOT NULL`; state that support is derived by `bindingStatus` against the active release at each use. | Removes a second source of truth (K-02); prevents a window where a stored `supported` survives a release that removed the capability. |
| CCR-06 | §6.3 `CatalogueApi` | Add `declarationSupportFor`, `itemStatuses`, `selectableOfferings`, `offeringDisplay`, `evaluateTravelDateRules`, `noteGoverningBehindHead`; add codes `baseline_incompatible` and `synthetic_not_permitted` to `currentGoverning`'s failure union. Commands list: replace `cat.register_declaration`/`cat.register_binding` by `cat.register_release_catalogue`, `cat.bind_declaration`, `cat.draft_declaration`, `cat.record_owner_approval`, and add the commands of Section 3.2. | Interfaces used by the control evaluator (stage 5/6/9), Core (travel-date recheck, intake), web pages. |
| CCR-07 | §6.4 `CoreApi` | Add writers: `recordContinuation(tx, { applicationId, impactItemId, from: GoverningIds, to: GoverningIds })` (conditional on governing = `from`, app open, no open act; bumps `material_revision`; fact `core.continuation_recorded`); `openStructuralTransition(tx, { applicationId, from, to, compatibilityEvidence, approvedBy, taAuthorityRequired })` (applies now or `awaiting_ta_authority` + TA notice); `proposePriceIncrease(tx, { applicationId, baselineId, newPricePaise, cause: 'mistaken_price' })`. Add query `openApplicationsForOffering(tx, offeringId, afterId, limit)` returning ids, governing tuple, lifecycle, open act states, filed flags, effective price and payment status. | B06 continuation and transition write governing ids, which only Core may write; B17 mistaken-price increase; the recheck must enumerate open applications without reading Core tables directly. |
| CCR-08 | §6.7 `OperationsApi` | Add writer `ensureOfferingControls(tx, offeringId)` (insert-if-absent of the `ops_offering_controls` guard row, called by Catalogue in C3 and E1) and query `launchSummary`. | The guard row MUST exist before any admission reader locks it; Catalogue cannot write `ops_` tables. |
| CCR-09 | §5.3 row `catalogue.read_selectable` | Replace the TA extra condition by: "published, `launch_state = 'launched'` and the TA in the current audience; suspended or withdrawn offerings remain visible with their unavailable state". | B07 truthful display (K-04). |
| CCR-10 | §2.13 `third_party_filed` row and I-05 | Append: "In `test` and `local_test` only, a synthetic offering MAY declare `provider: { routeRef: 'synthetic:…' }`, which requires capability `provider.synthetic`. Only test and local-test release manifests carry that capability; configuration refuses synthetic offerings in `production`." | B41 requires tests of every shape; B37 permits labelled synthetic external outcomes; no real provider route or data sharing is approved (K-03). |
| CCR-11 | §9.1 release manifest; §9.4 | `capability_set` entries become `{ id, version, sourceDigest }`; `tm release register` refuses a manifest whose capability keeps a version of the previous active release with a different `sourceDigest`. Manifest gains section `catalogue` (countries, offerings, declarations, heads) and `catalogueImpact` (`rimp/1` statement, Section 3.3). | A behaviour change without a version change would bypass the binding and impact rules (B05, B06, B39). |
| CCR-12 | §4.8 `ControlBlocker` | Add optional `ref: string` (declaration item key or boundary detail, closed format `^[a-zA-Z.]{1,60}$`). | The UI and tests must show which declared item blocks an action (B05). |
| CCR-13 | §3.1 privileges; §3.4 `cat_publications` | `cat_publications`, `cat_owner_approvals`, `cat_previews` become append-only by trigger (`TM001`) and `tm_app` holds `INSERT, SELECT` only on them. | B06 publication records MUST keep their original entries; "by writer convention" is weaker than the fact log. |
| CCR-14 | §3.4 `cat_impact_assessments`, `cat_impact_items`, `cat_offerings`, `cat_declarations`, `cat_baselines`; §3.8 launch tables | Adopt the column sets and guards of Section 2.9, notably: assessment states `rechecking`, `review_required`, `reviewed`, `superseded`; item columns `is_current`, `valid_through_assessment_no`, `from_*`, `classification_code`, `continuation_kind`, `transition_id`, `hold_owner_id`; offering `latest_assessment_no`, `is_synthetic`; one open baseline draft per offering; new tables `cat_release_registrations`, `ops_launch_plans`, `ops_launch_audience`; `ops_launch_decisions` columns `plan_id`, `acknowledged_unavailable`, `baseline_id`, `release_id`, `supersedes_launch_id`; `ops_suspensions.revision` and lift fields; `ops_existing_work_treatments.cause_kind` (`suspension`, `withdrawal`; impact assessments do not use this table). | The fail-closed impact derivation (Section 2.5) and the B07/B32 launch records need these columns. |
| CCR-15 | §10.9 configuration | Add `catalogue.priceMaxPaise` (default 100 000 000 = ₹10 lakh, a sanity bound, not a business price), `catalogue.recheckBatchSize` (100), `catalogue.countryRuleTimeoutMs` (200), `public.canonicalOrigin` (`https://b2b.travelmudra.co`), `public.indexable` (true only in `production`). | Bounded work (B38) and public-site behaviour per environment. |
| CCR-16 | §8.3 stage applicability | Stage 11 for `submit` and the operator-work rows: state that `impactFor` answers are read with `cat_offerings` locked `FOR SHARE` in the command transaction. | Guarantees the serialization in C9 (publication `FOR UPDATE`) without relying on SERIALIZABLE detection alone. |

## 9. Owner-decision candidates and recorded interpretations

### 9.1 Genuine owner-decision candidates (B47)

None blocks this milestone. Each has a safe interim behaviour that this design implements.

**OD-12-01 — Does a routine baseline price increase reach submitted, unpaid applications?** (money correctness)
- Spec: B17 "Formal TA submission fixes that application's one-time quoted price … Unpaid price reduction applies automatically; increase requires renewed TA authority, and a declined mistaken-price increase honors the communicated price."
- Why unknowable: "increase requires renewed TA authority" can mean that every catalogue increase is proposed to submitted unpaid applications, or only corrections of a mistaken price, because the quoted price is "one-time" and fixed at submission.
- Safe interim: a routine publication never changes a quoted price; only a publication marked `mistaken_price` with evidence proposes an increase to submitted applications, which needs TA authority and honours the communicated price on decline. Reductions apply automatically to unpaid submitted applications.
- Independent work: everything else.

**OD-12-02 — May an offering launch while an action-scoped item is unresolved by a deliberate boundary?** (business semantics, TA rights)
- Spec: B02 "A country/service can be offered only after its current route, eligibility, authority, pricing, evidence, operating readiness and launch requirements are met." B24 "each other offering must declare its own evidenced cut-off". B44 parks "preparation-only post-handover/cut-off". B30 parks shared-original return policy. B29 leaves the price-versus-fee formula unselected.
- Why a contradiction risk: a preparation-only offering can never declare a withdrawal cut-off in this build, and a physical offering can never record an original return, yet the spec supports both shapes. Launching them means TA withdrawal or original return stays unavailable for live cases.
- Safe interim: launch is allowed only when the launching SuperAdmin acknowledges, item by item, every action-scoped item that is not supported; the acknowledgement is recorded on the launch decision and shown on the admin page; each affected action stays visibly unavailable. Every launch-required item still MUST be supported. If the owner prefers, the interim can be tightened to "no non-synthetic launch with any unresolved action-scoped item" by one rule in L2.
- Independent work: all; synthetic offerings exercise both paths.

**OD-12-03 — Public legal and contact content.** (legal duty, privacy)
- Spec: B01 requires static TravelMudra details on the public page. B13 "Applicant, regulator and legal notice requirements need separately authorized compliance work; do not invent or send them."
- Why unknowable: a public business site usually needs a privacy notice, terms and verified contact details. The spec supplies none, and inventing legal text is forbidden.
- Safe interim: no privacy or terms page and no contact details are published; the SEO check reports `public_legal_pages_unsupplied` and `public_contact_unverified` as release blockers beside `public_locality_unverified`.
- Independent work: the whole public site and check.

Related existing candidate: contract OD-03 (dimension of launch scope) applies unchanged; this design implements its interim (audience only).

### 9.2 Recorded interpretations (not escalated; promote if the owner disagrees)

| ID | Topic | Interpretation | Basis |
|---|---|---|---|
| RI-12-01 | Existing work after a baseline publication | The publishing SuperAdmin chooses the treatment per class (drafts, submitted) explicitly; the form has no default; the recheck applies it. | B06 "explicit supported continuation" |
| RI-12-02 | Meaning of "supported continuation" | Either continuing on the application's own still-supported governing tuple, or adopting the head where the difference is baseline-only or engineering-classified compatible. | B06, contract §9.3 |
| RI-12-03 | Release head change with an incompatible baseline | The head changes at deployment; new cases are unavailable with `baseline_incompatible` until a compatible baseline is published; `tm release register` warns before cutover. | B06 "takes effect for new cases at deployment" |
| RI-12-04 | Lifting | Lifting requires scoped readiness evidence and a complete current plan for the current head, because the structure MAY have changed during the suspension. | B07 "with actor, reason, evidence and scoped readiness" |
| RI-12-05 | Expansion during suspension | Refused, so that lifting restores only previously approved scope. | B07 |
| RI-12-06 | Withdrawal | Immutable and terminal; its existing-work treatment MAY be narrowed (continue → hold), never widened; no relaunch path. | B07 "expressly permits" |
| RI-12-07 | Visibility of offerings to TAs | Not-launched and out-of-audience offerings are invisible to TAs; suspended and withdrawn offerings stay visible to their audience with the reason. | B07 truthful display; B02 candidate countries are not routes |
| RI-12-08 | Public country list | Lists only countries with a launched production offering, added by a reviewed content change; no prices, estimates, documents or offerings on public pages. | B01 no live catalogue data |
| RI-12-09 | Estimate day basis | Calendar days only; no working-day calendar is declared. | B17 estimate is guidance |
| RI-12-10 | Accountable review | The publishing SuperAdmin is the accountable reviewer of a baseline or declaration publication; release assessments get a reviewer by C12 or stay in the SuperAdmin queue. Not a second approver. | B05, B06 |
| RI-12-11 | Zero price | Allowed only with an explicit confirmation field; never a default. | B05 business values |
| RI-12-12 | Future-dated publication | Not built; publications take effect at commit. Recorded time and publication time differ only for release publications (registration versus activation). | B06 effective condition |
| RI-12-13 | Owner approval and executable behaviour | An outside-product approval approves structure only; it cannot make an item supported when the release lacks the capability. | B05 |
