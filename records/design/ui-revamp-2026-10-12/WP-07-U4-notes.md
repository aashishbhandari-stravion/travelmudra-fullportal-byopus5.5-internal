# WP-07 U4 notes: OP-04 external action (authorization review and act record)

Unit U4 of WP-07. Author: the U4 engineer, 13 October 2026. Input for the architect's integration and for U7. U4 commits
nothing; the architect integrates. Base: lane commit 101eff1 with the uncommitted U0 files. Binding inputs: `WP-07-design.md`
§2.0, §2.7, §2.8, §2.11 to §2.13, §4, §7.1 (U4 row); `WP-07.md` §3 (Q-W07-06, Q-W07-07) and §4.1 to §4.12 (F-01 to F-06,
F-10, F-20 to F-28, F-33); `WP-07-U0-notes.md` (D-U0-04); PLAN LD-14, LD-17.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/work/acts-pages.ts` (new) | OP-04a `authorizationPage`, OP-04b `actRecordPage`, state function `authorizationState`, receipt expectations `actReceiptExpectations`, closed words. |
| `src/apps/staff/work/acts-routes.ts` (new) | `opsActRoutes({ memory? })`: 2 GET, 3 POST routes; the session memory (`authorizationMemory`, `INSTANCE_AUTHORIZATION_MEMORY`); `inputRefusal`. |
| `src/apps/shared/evidence-form.ts` | New `evidenceRowsOf(fields, max)`; `evidenceRowOf` unchanged (type named `EvidenceRowInput`). |
| `scripts/dev/gallery/acts.ts` (new) | 10 gallery pages, `actsGalleryPages()`, shared fixtures. Not registered. |
| `test/unit/web/external-action.test.ts` (new) | 36 tests (pages, F-33 replays, evidence rows). |
| `test/unit/bff-acts.test.ts` (new) | 16 tests (routes over a scripted core, memory bounds). |

## 2. Routes (exported by `opsActRoutes`; U7 wires them)

| Id | Method, path | Action | Notes |
|---|---|---|---|
| `ops.applications.acts` | GET `/ops/applications/:applicationId/acts?act=&pending=&from=` | `operator.authorize_external_act` (O45 as declared) | No valid `act` and no valid `pending`: 303 to `?tab=acts`. |
| `ops.applications.act` | GET `/ops/applications/:applicationId/acts/:authorizationId?record=&from=&done=&op=` | `application.read` | `zWireId('aut')`; an act not in the case: uniform 404. |
| `ops.applications.authorize_act` | POST `…/acts` (`?from=applications` kept in the address) | `operator.authorize_external_act` | Body limit 16 KiB. Replaces the copy in `core/ops.ts`. |
| `ops.case_work.act_evidence` | POST `…/acts/:authorizationId/evidence` | `operator.record_act_evidence` | Body limit 64 KiB. Replaces the copy in `operations/case-work.ts`. |
| `ops.case_work.reconciliation` | POST `…/acts/:authorizationId/reconciliation` | `operator.record_reconciliation` | Body limit 64 KiB. Replaces the copy in `operations/case-work.ts`. |

Results: ACC authorize 303 `…/acts/<aut>?done=authorized&op=<key>` (`<aut>` pattern-checked; else `?tab=acts`); evidence
and reconciliation 303 `…/acts/<aut>?done=evidence|reconciliation&op=<key>`. UNR authorize 303 `…/acts?act=<kind>&pending=<key>`
(D-W07-06); UNR of the other two: the operation page (default). REJ: the host page again at the POST path, status of the
category, `restorePath` = the GET page (`?act=`, `?record=`). Access, session, maintenance and dependency refusals: shell.

Receipt codes (all on OP-04b; the pending mode shows the `authorized` receipt on OP-04a): `authorized` ("Authorization
recorded"), `evidence` ("Filing evidence recorded" / "Non-filing evidence recorded" / "Execution recorded as uncertain";
handoff: "Handoff evidence recorded" / "Evidence of no handoff recorded" / "Handoff recorded as uncertain"; by the summary's
`result`), `reconciliation` ("Reconciliation attempt recorded", with "Filing concluded" or "Handoff concluded" from the
concluded evidence). Recorded facts come from the summary and the records its ids select; the act state and the
reconciliation owner are "Current" facts. An unmet expectation gives the unchecked receipt.

## 3. Pages and states

OP-04a order: pending banner or receipt (first in `main`), header (h1 "Request authorization for the [act]: [applicant]",
staff meta), earlier-request banner, refusal block, protected-state banner, status facts, then the sections Scope,
Governing facts (full passport number), Authority, Payment and fee controls (gate rows of the checklist for this act,
fee text, money panel), External action (by shape), Reconciliation owner, Your request. States (first match):
`read_only` (not assigned, or a support view), `no_act`, `not_offered`, `open_act` (an act of this kind authorized or
uncertain), `exhausted` (blocker `reconciliation_exhausted_no_refiling` or any act exhausted; F-23: "No exception exists for
this control", no owner, no route), `fee_hidden` (F-02, D-U0-04), `blocked` (Core's blockers, one notice per checklist
group with reason, owner, route), `evidence_unavailable` (F-04), `allowed`. Every state without a form shows the action as
`unavailableButton` described by `#authorize-state`. `data-authorize-state` carries the state (`unresolved` while F-03
removes the form).

OP-04b: header (h1 "[Act]: [applicant]"), read-grant line (reader not assigned; `iam.own_grants` optional read), the act's
banner by state and shape, the other protected items, status facts, the act's facts, mode links, the mode's form (or why
none), evidence records, reconciliation attempts. Modes: `evidence` and `reconciliation` from `authorized` or
`filing_unknown`; `uncertain` from `authorized` only; otherwise "This act is “[state]”: [mode] does not apply.".

## 4. The F-03 mechanism

- On `outcome_unknown` the authorize handler remembers `{ applicationId, actKind, operationKey }` under the session id and
  answers 303 to the pending address.
- Memory bounds: 8 requests per session (the oldest gives way), 2000 sessions (least recently used gives way), 30 minutes
  age. In-process, one per staff instance.
- Every entry to OP-04a (GET with or without `pending`, and the refusal re-render) first reads `core.operation` for the
  address's request and for each remembered request of this session and application (`optionalView`), then reads the case.
  `accepted` or `not_recorded` forgets the request; `in_progress`, `no_record_yet` or an unavailable read keeps it and
  removes the form, with the banner "Authorization result unknown. Do not perform the external act." and a link to the
  request's pending address. Reading the case after Core's answer means a request recorded meanwhile shows as an
  authorized act (no form), never as a form beside a receipt.
- The POST does not block a new command: Core's business guard (`act_already_open`) refuses a second authorization once
  the first commits.

## 5. Decisions made in U4 (deviations for the record)

| ID | Decision | Reason |
|---|---|---|
| D-U4-01 | OP-04 pages use `pageHeader` with the staff meta (application reference, masked passport, service, kind, group, travel agent, operator), not `identityBand`. | The design's h1 is the task ("Request authorization for …", "[Act]: …"); the band's h1 is the name. One h1 per page. |
| D-U4-02 | OP-04a documents: a table with document, status words and accepted version, not CMP-02 `evidenceRows`. | CMP-02's owner column reads "You" for the travel agent's steps on a staff page. |
| D-U4-03 | F-33 applied to the design copy that named performing: scope ("permission for the act, which is done by hand"), External action ("TravelMudra does not file for you. The [act] is a manual step …"), checkbox ("… cannot be undone once it has happened, and that it is done by hand, not by TravelMudra."), review ("What happened to the act is recorded afterwards on its act record …"), the `authorized` banner and receipt (F-33 words; "Authorization is permission, not evidence that the act happened."). | No page, status read or receipt instructs anyone to perform an act; prohibitions stay ("Do not perform …"). |
| D-U4-04 | The origin `from=applications` travels in the form's action address, not in a hidden field. | No hidden-field name changes. |
| D-U4-05 | After a stale authorization the form is read again (digests and revisions) beside the comparison, the fee kept and the checkbox unchecked; on the evidence form `fromState` keeps the sent value except after a stale refusal. | Design §2.0 and §2.12; nothing is sent without a new confirmation. |
| D-U4-06 | State order: an open act of the same kind, then exhaustion, then the hidden fee act. | Each removes the form; the first gives the most specific route. |
| D-U4-07 | A reconciliation owner is a "Current" fact of the `authorized` receipt. | It follows a reassignment. |
| D-U4-08 | `evidenceRowsOf` refuses a filled row at index ≥ 5 (`too_many`) and a row number the form never writes, such as `evidence.01.id` (`invalid`); a partly filled row is refused at its field. | LD-17: no row dropped or renumbered; a refused form must show every value back. |
| D-U4-09 | Provider handoff words: "Handed over / Not handed over / Handoff uncertain", "Handed to the provider: evidence recorded …; the provider files …; recorded under Outcome and result file" (F-06, F-20). The service kind label "Filed through a provider" stays (it names who files). | A handoff never claims a filing. |

## 6. Items for U7 and the architect

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| Wiring | — | Routes not registered; the old copies share the ids. | `instance.ts`: `...opsActRoutes()`. Remove `ops.applications.authorize_act` and `actForms` from `core/ops.ts`; remove `ops.case_work.act_evidence`, `ops.case_work.reconciliation` and the act-evidence forms from `caseWorkPanels` in `operations/case-work.ts`. |
| Inventory | — | O45 has no id; the act record has no entry. | O45 id `ops.applications.acts`; new GET entry `/ops/applications/:applicationId/acts/:authorizationId` id `ops.applications.act`, action `application.read`. |
| System tests (§7.3) | — | `case-work.test.ts:180-186, 445-450` read the authorize form from the case page; `:217` the evidence form; `document-decisions.test.ts:221-225`. | GET OP-04a `?act=<kind>` (form `action` `…/acts`); GET OP-04b `?record=evidence`; locations `…/acts/<aut>?done=authorized&op=`, `?done=evidence&op=`; before work OP-04a shows "Start work first." and no form. |
| Gallery | — | `actsGalleryPages()` not registered. | Register in `scripts/dev/gallery-pages.ts`. No browser or axe run was made by U4 (no CSS change; existing components only). |
| Duplicate helpers | P2 | `inputRefusal` now exists in four places (decisions, assignment, return-flag, acts); the OP-04 frame parts (meta, protected banner, status facts) repeat U2's and U3's. | One `inputRefusal` in `shared/core/shared.ts`; one frame module for OP-02, OP-03, OP-04 at integration. |
| External actions tab | P2 | The OP-02 tab (U2) may show "Can be requested now" while this session's earlier request is unresolved; OP-04a then shows no form. | U2 may consult `INSTANCE_AUTHORIZATION_MEMORY` for its line; OP-04a stays the protection. |
| Memory lost on a staff restart | P2 | The staff instance restarts seconds after a lost answer; the plain review shows the form while Core may still be committing. | Accept: the pending address still protects; Core refuses a second authorization (`act_already_open`) once the first commits. |
| U0 handoff banner word | P2 | `protectedStateItems` for a handoff in `filing_unknown` says "If the attempts cannot establish the filing, …" (OP-02 and OP-04a banners). | U0 wording by shape ("establish it"); OP-04b already uses its own words. |
| Fallback receipt | P2 | Core returns no `authorizationId` (never today): the authorize receipt goes to `?tab=acts&done=authorized&op=`, which U2's tab does not expect (unchecked receipt). | Accept. |
| CRLF in the note | P2 | As WP-06 U4: a 2000-character note with line breaks reaches the BFF over 2000 and is refused at its field, values kept. | As WP-06. |

## 7. Checks run

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (whole tree at the time of the run). |
| `npx eslint --max-warnings=0` on the six U4 files | Clean. |
| `node --test test/unit/web/external-action.test.ts test/unit/bff-acts.test.ts` | 52 pass (36 + 16). |
| `node --test test/unit/evidence-refs.test.ts` | 7 pass (`evidenceRowOf` unchanged). |
| `node --test "test/static/**/*.test.ts"` | 74 pass. |
| `node --test "test/unit/**/*.test.ts"` | 1700 pass, 4 fail, 2 todo; the failures are in other engineers' files (U2 workspace routes, the crawl record), none in U4 files. |
| Gallery pages (scratch render) | No duplicate id, one h1, every control labelled, every `aria-describedby` resolves. |

Not run: system tests (routes not wired), browser and axe.
