# WP-15 acceptance checklist: Accounts, access and email change

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-15 Accounts, access and email change (UI-PLAN §12.2: SA-06 full, TA-12, OP-10; SA-10 by register CC-03; done when V21 and V22 pass; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-15-design.md`, the architect's decisions (`WP-15.md` §3, with Q-W15-13 **B**: the four access actions on task pages) and amendments N-01 to N-12 (`WP-15.md` §4.1), F-38 (`WP-07.md` §4.11), E-23 and E-24 (`WP-08.md` §4.7, §4.8), which bind. See the corrections below. Not run. Where the design names a page, a path or a word differently from an unchanged row, the design governs the name and this checklist keeps the observable result; where an amendment or a decision differs from the design, the amendment or the decision governs. |
| Product base | Lane branch `ui-revamp-2026-10-12`: the first version read 34e875b; the design and the review read b2a6341 (the identity and Core files are the same at both). Internal records at b387681 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin and operator pages under test; every support view); edge http://127.0.0.1:4650 (TA-12a and TA-12e under test; travel-agent observation) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-15-design.md`), the architect's decisions (`WP-15.md` §3) and the independent design review (lane
`research/reviews/WP-15-design-review.md`, R-01 to R-12, with amendments N-01 to N-12 in `WP-15.md` §4.1, which bind)
changed the rows below. F-38 (WP-07) and E-23, E-24 (WP-08) apply too. Rows not listed changed only their page ids,
step references and draft words to the design's. Item numbers A01 to A148 keep their subject; A149 to A154 are new.
Page ids follow the design (§1.3) with decision B: the first version's OP-10 list is **OP-10n**, its OP-10n notice is
**OP-10i** (SA-10 likewise), the account pages are **TA-12a**, **OP-10a**, **SA-10a**; the grant page **SA-06h** is new;
the task pages SA-06q, SA-06k, SA-06t and SA-06v keep this checklist's names (B; the build names their paths). The
first version's proof accounts Y, E, G and D are replaced by the design's TAx, OPe, OPg and G1 (§0.3).

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1 | Design; `WP-15.md` §3, §4.1; review R-01 to R-12; F-38, E-23, E-24 | Inputs add the design, the record, the review and the three amendments. Verified facts add: a suspended viewed account denies reads but does not end the support view (N-04); a support view omits the Accounts area of an accounting holder (N-01); a support view cannot read `/admin/operations/<key>` (N-09); the refusal order for an elevation target (N-10); staff notices are read 200 at a time (N-06) |
| §0.2 "Personas", "Data hygiene"; §0.3; §0.4; §3 | Q-W15-05; design §6 | One ordered recipe: the design's §6 (TAx, OPe, OPg, G1 of `syn-ta-1`, the declined `wp15-sa`) with lettered additions; design step ids in run order. The run-owned travel agent's own group and application, the payment and the assignment of the first version go (not in the approved writes) |
| §0.2 "Sign-in codes"; §0.4 first checks; Q-09; A151 (new) | N-11; Q-W15-06 | The harness extension U7 keeps a run-owned account registry, refuses seeded and unrelated accounts for enrolment and address-change helpers, and takes no persisted browser capture in a secret-bearing step; A151 holds its guard tests |
| §0.2 "Paths"; §1.1; §1.2; every page name in §2 | Q-W15-13 B; Q-W15-01; design §1.3, §1.4, AM-W15-01 | The design's hosts with B: SA-06q, SA-06k, SA-06t, SA-06v task pages (refusals re-render the task page); SA-09s; SA-06h (new, receipts of both grant kinds and of a revocation); SA-06n at `/admin/grants/new` in two steps; OP-10n, OP-10i, SA-10n, SA-10i; TA-12a, OP-10a, SA-10a; the rail member "Elevation requests"; TA-12e `h1` "Change your email address" |
| §0.2 "Receipts"; A92 | Design §2.14; N-10 (R-10) | Titles and hosts of design §2.14; a non-accepted lookup on a receipt address gives the unchecked receipt, and only the operation status page reads "Nothing is recorded …" |
| §0.2 "Pass rule"; §5 | N-01, N-03, N-08; Q-W15-06 | The A49 exception goes (N-03); "V22 scope completeness: Partly met" is added (N-01, A150); A73 part (3) keeps the Core gap only (STOP-W15-01); the harness fallback follows Q-W15-06 |
| A01, A47, A49, Q-01 | N-03 (R-03); `WP-15.md` §3 PM Q-01 | A travel agent or operator account in any status is eligible: the task page keeps the form and states before the button that the view will show nothing while the account is [status]; the proof shows the reads deny and the exit stays |
| A47, A59 | N-04 (R-04) | "Reads denied while the account is not active" differs from "view ended"; the restoration before exit is proven (live and test); no end-time message at expiry |
| A54, A150 (new); V22 proof | N-01 (R-01) | The accounting surface of the person and of their support view are compared; V22 scope completeness reads "Partly met" (STOP-W15-03, PLAN S-15) |
| A62, A89; §3 V22-0b, V22-9; Q-07 | N-02 (R-02); F-38; E-24 | An eligible grant reader sees a download control and downloads in the browser (no harness download); a support view shows no download control; after revocation the same control is refused |
| A81 | N-05 (R-05) | Acknowledgement-only words: no "I deleted it"; the review says that acknowledging records reading only |
| A79, A86 | N-06 (R-06); WP-08 E-10 | The 200-row cap with qualified counts and no-match wording on both staff surfaces |
| A84 | N-07 (R-07); E-23 | A `reassigned_away` notice shows the application reference unlinked; the old application URL is tested separately |
| A68, A73 | N-08 (R-08) | Waiting guidance when no change is visible; finish or cancel only for a visible change; no time the evidence does not return |
| A94 | N-09 (R-09) | Lost support-start acknowledgement: the banner confirms the started view; the original operation is checked after exit; tests for both outcomes without starting another view |
| A18, A37, A77, A92, A103 | N-10 (R-10) | A18 follows the actual refusal order (no session or no SuperAdmin surface before the handler); A37 takes counts from the returned active grants with the limits disclosed; A92 separates the receipt from the status page; A77 and A103 read every field whole and refuse over-limit input locally with no command sent |
| A33, A35, A36, A88 | Q-W15-02; design §2.6; F-W15-15; I-15 | SA-06n shows the group from `core.admin_group` before the form; `groupId` is hidden; an unknown group reaches the shell; the grant starts from SA-04g or from SA-06n step 1 |
| A149 (new) | Design §2.5 | SA-06h Grant page: facts, state words, receipts, action panel |
| A12, A13, A15 to A24 | Design §2.2, §2.3 (states 1 to 9) | SA-06e and SA-09s anatomy, states and words; an expired open request has no link |
| A30, A31 | Design §2.4; Q-W15-11 | Paging of 50, kind filter, rule line and words |
| A65 to A76 | Design §2.9, §2.10 | TA-12a and TA-12e words, states a to d and results |
| A79, A80, A85 | Design §2.11, §2.12.4 | Staff notice words; "Application [reference]"; delivery link only for result and disclosure notices |
| A97, A98 | Design §2.13, §2.16 | Closed sentence table |
| A118 to A148; A152 to A154 (new) | Design §6.3, §6.4 axe lists | axe rows mapped to the new steps; three rows added (SA-06h, SA-06n step 1, the Accounts comparison) |
| §6 | `WP-15.md` §3, §4.1 | Answered rows reduced to their answers; Q-12 added (P2: the lettered writes beyond design §6.2) |

## Lessons applied from the WP-01 to WP-14 corrections and the WP-15 review

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; A10, A23, A29, A38, A42, A51, A76; the matrix A95 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A94; every refusal item checks "nothing is recorded" by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral receipt with facts labelled "Current"; no accepted time; nothing from the address | WP-01 A-04, P-02; WP-02 B-02; WP-06 D-02; WP-11 I-09; WP-14 K-07 | §0.2 "Receipts"; A92; the two grant commands share one summary, so SA-06h reads the grant's kind (A34, A44, A149) |
| The receipt address and the operation status page answer differently for a key that was not accepted | WP-15 N-10 (R-10) | A92 |
| An accepted command whose recorded result is not the requested effect never shows as a success | WP-01 A-04 class | A22 (`expired`), A70 (`invalid`), A72 (`invalid_address`), A73 (`ended: expired`) |
| No page, status read or receipt instructs anyone to perform an act; a historical receipt keeps the historical fact | WP-07 F-01, F-33; WP-09 G-10; WP-11 I-02 | A93 |
| Another person's receipt address opens as the unchecked receipt with current authorized facts | WP-12 J-09 | A92 |
| Every rendered form action is a registered route; one host page per command use; carried forms leave | CC-12 to CC-18, CC-20; WP-02 design §1.5, §8.2 | A05, A90, A105 |
| A page MUST NOT block a command that Core accepts and MUST NOT offer one that Core refuses; a fact mapping that withholds a form carries a parity test | WP-07 D-W07-16; WP-10 H-02; Q-W15-04 | A08, A15 to A17, A21; design §7.2 (e) |
| A served command whose effect is empty is shown with a truthful warning before the button, not hidden | WP-15 PM Q-01 decision; N-03 | A01, A47, A49 |
| A state that denies reads is not the state that ends the mode; copy names the one that holds | WP-15 N-04 | A47, A59 |
| A proof compares the whole read scope; a missing surface is recorded, not described away | WP-15 N-01 | A150; §3 V22 proof |
| A permitted byte release has a visible control; a proof uses it in the browser | WP-15 N-02; F-38; E-24 | A62, A89 |
| An acknowledgement records reading only | WP-15 N-05; WP-08 E-20 | A81 |
| An outage of the evidence or control that a consequential record needs removes the form with a notice; access refusals are a separate test | WP-07 F-04; WP-10 H-05; WP-14 K-02 | A11, A32, A35, A50, A104 |
| Optional reads never hide an access change | LD-14 | A59, A61, A65, A84, A104 |
| No handler truncates a field; over-limit input is refused at its field with the values kept and no command sent | LD-17; WP-02 R-02; WP-15 N-10 | A77, A103 |
| The refusal summary and the submitted values render independently of current eligibility | WP-02 R-01, R-03 | A09, A21, A35, A41 |
| A page shows only facts that a read returns; a missing fact is qualified or "Partly met" | WP-02 B-06; WP-14 K-14 | §0.1; A04, A24 |
| A list at its read's cap says so; counts are qualified | WP-02 B-14; WP-08 E-10; WP-15 N-06 | A12, A30, A31, A37, A79, A86 |
| A state is labelled for the fact it establishes; an item past its end that Core still lists as open is labelled by its end against the read time | WP-06 D-05; WP-14 K-11 | A02, A03, A13, A31, A64, A149 |
| A refusal offers only a step the reader can take | WP-15 N-08 | A68, A73 |
| A lost answer of a mode-changing command is reconciled by the mode's own evidence | WP-15 N-09 | A94 |
| A secret value is never rendered back, printed, stored or captured | WP-01 A-12; WP-15 N-11 | A70, A76, A101, A151 |
| Copy states no configuration value that the page does not read | WP-01 Q-13; WP-07 F-22 | A06, A47, A66, A100 |
| A boundary of a parked policy names the product owner and no date | LD-04, LD-05 | A27, A65, A99 |
| UI acceptance is separate from Core behaviour: a Core gap is "Unmet" or "Partly met" with its owner | WP-10 H-01; WP-14 K-01 | §0.2 "Pass rule"; §6 |
| Proofs follow one ordered recipe (the design's, with lettered additions), with a run tag and deltas | WP-12 J-13; WP-14 K-13 | §0.4; §3 |
| Real refusal shapes from the code, in Core's order | WP-06 D-11; WP-15 N-10 | §0.5 |
| Kind 1 notes record whether criterion point 2 is demonstrated | WP-09 G-11; WP-15 N-12 | §6 Q-06 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.3, §3.3, §4.2 (Account), §4.4, §5.2, §6.1, §6.2 (Accounts & access), §6.3 (Account changes, Support view), §7.4, §7.5, §8.2, §8.3, §12 V21, V22, V24 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B08 to B12, B28 (ceiling part, referenced), B33, B35, B44 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §1.1 to §1.4; §2.2; §2.3 (SH-R01 to SH-R12); §3.2 TA-12; §3.3 OP-10; §3.4 SA-06, SA-09, SA-10; §5.2 to §5.4; §6.1, §6.2, §6.4; §7 (K-STD, K-2P, K-OTP, K-BYTE); §8; §10; §11; §12.2 WP-15; §13.2 B-01, B-02 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1, AD-05, AD-07, AD-12, AD-13 |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 0cab0de1f44eca96… | §3 rows of the 11 WP-15 commands and `dlv.acknowledge_notice`; §5.1; §6 CC-03, CC-11, CC-20 |
| LP | `PLAN.md` (this folder) | internal b387681 | §3, §4 (LD-02, LD-03, LD-06, LD-08, LD-11, LD-13, LD-14, LD-17), §8 (S-08, S-15), §9 |
| W15 | `WP-15-design.md`; `WP-15.md`; lane `research/reviews/WP-15-design-review.md` | SHA-256 7a75f79b678336c0…; d16761c7a8511e1f…; 9a62ebb0121f9b32… | design §0 to §9 (§1.2 facts, §1.3 pages, §1.4 shell, §1.5 commands, §1.8 AM-W15-01 to -06, §2.0 to §2.16, §4 hostile states, §6 proofs, §7.1 U7, §7.2, §9.4 STOP items); record §3 (Q-W15-01 to -13, PM Q-01), §4.1 (N-01 to N-12); review R-01 to R-12 |
| W7, W8 | `WP-07.md`; `WP-08.md` | SHA-256 eb7ecefe91d4e083…; bce49cd881f37b4b… | WP-07 §4.10 (AM-W15-05), §4.11 F-38; WP-08 §4.7 E-23, §4.8 E-24, E-10 |
| W1 | `WP-01.md`; `WP-01-acceptance.md` | SHA-256 1246143f54f52fa7…; 18659ab8bc74e51a… | A-01, A-02, A-04, A-07, A-08, A-12; WP01-A06, A07, A09, A13, A21, A31, A55, A56, A58, A67, A70 to A72, A76, A99, A131 |
| W2 | `WP-02.md`; `WP-02-design.md`; `WP-02-acceptance.md` | SHA-256 7fe4a07271c809fb…; e8eacaabf622cb83…; bfac75d7e75d34ef… | Q-W02-03; B-02, B-06, B-14; R-01 to R-03; design §1.2, §1.5, §4.1 to §4.5, §8.2; WP02-A83, A84, A88 to A102 |
| W6 | `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 327f580c1820bf40…; 7a1d82e48fde6e93… | §2.1 SA-01 group 7; the decision-kind table; WP06-A04, A103 |
| W7a, W8a, W11, W14 | `WP-07-acceptance.md`; `WP-08-acceptance.md`; `WP-11-design.md`; `WP-14-acceptance.md` | SHA-256 647c7b1d6af0887c…; 4d6504be7f20ebe7…; c4be246b11d299eb…; 341d2c25c392b88d… | WP07-A08, A35, A83 to A89; WP08-A89 to A99, A111; SA-04g (I-15); WP14-A89; format |
| Code | lane repository | 34e875b and b2a6341 (identity and Core identical) | As the first version: `src/modules/identity/**`, `src/modules/delivery/commands/notices.ts`, `src/kernel/command.ts`, `src/kernel/guard-constraints.ts`, `src/contracts/identity.ts`, `src/contracts/queries.ts`, `src/core-api/bindings/identity-admin.ts`, `src/platform/config.ts`, `src/apps/staff/identity.ts`, `src/apps/staff/accounts/pages.ts`, `src/apps/edge/account.ts`, `src/apps/shared/{identity-routes,server}.ts`, `src/apps/shared/delivery/routes.ts`, `src/web/pages/chrome.ts`, `src/web/route-inventory.ts`, `test/uat/signin-harness.ts` |

Verified facts of the code that the items rely on (the author's reading at 34e875b; the design §1.2 and the review at
b2a6341 agree unless stated):

- **Elevation.** Request: the target MUST be an active operator with an authenticator at the revision the form showed
  (`stale_revision`), with no assigned application, owned reconciliation, open hold on an assigned application or owned
  incident (`elevation_target_has_duties`); never the requester (`second_superadmin_required`); one open request per
  target (`conflict_duplicate` / `elevation_open`, also for a request past its end not yet closed). Approve: a second,
  distinct, active SuperAdmin, never the requester or the target (`second_superadmin_required`); the requester still an
  active SuperAdmin (`elevation_requester_inactive`); the target still in the state of its kind (`stale_revision`);
  duties checked again for an operator. Effects: `create_superadmin` → "Approved"; `elevate_operator` → role SuperAdmin,
  every session of the target ends, every grant ends (`grantee_elevated`); `restore_superadmin` → "Active", an
  enrolment code when no authenticator is set. An approval at or after the end is **accepted** as `expired` (it records
  the expiry and approves nothing), checked before the second-SuperAdmin rule. A decided request answers
  `stale_revision`. Decline: not privileged; the requester's decline records `withdrawn`; no expiry check; a declined
  `create_superadmin` also declines the pending account. With fewer than two active SuperAdmins no request can be
  approved.
- **Refusal order for an elevation target (N-10).** An operator target has no SuperAdmin surface: the BFF answers its
  GET or POST of an `/admin` route with the uniform 404 before Core. A pending or suspended target has no usable
  session: any request goes to sign-in (`unauthenticated`). So `second_superadmin_required` for the target is not
  reachable through a page; the requester gets it.
- **Reset.** SuperAdmin only; never the own account (`self_action_not_allowed`); a travel agent answers
  `unavailable_parked` / `parked_lost_mailbox_recovery`; staff active or suspended. It removes the authenticator, ends
  every session, revokes an open enrolment and supersedes live codes; an active account gets a new enrolment code at
  its own address. No duplicate guard.
- **Grants.** Group read: grantee an active operator with an authenticator (`grantee_not_operator`; an unknown account
  answers `access_denied` from the policy); the group MUST exist (`access_denied`); the end an instant after now and at
  most `groupReadMaxMs` ahead (`grant_duration_exceeded`); healthy clock (`clock_degraded`); one active grant per
  operator and group (`grant_exists` with `existing`; a same-group grant past its end is recorded `expired` first); at
  most `groupReadMaxActive` unexpired active grants per operator (`grant_limit_reached`); purpose 10 to 500; no
  revision. Accounting: an active operator (no authenticator rule); one active (`grant_exists`); reason 10 to 500.
  Revoke: either kind, the grant's revision, only an active grant; not privileged. Defaults: 14 days, 5 per operator
  (read by the grants pages).
- **Support view.** Start: a travel agent or operator other than the reader (`support_view_target_not_eligible`);
  healthy clock; one per session (`support_view_active`); reason 10 to 500; **no status check of the viewed account**.
  In the view: reads are actions marked `sv`, evaluated as the viewed account while it is active; **a suspended viewed
  account denies every read, but the view stays open** and reads again when the account is restored before the view's
  end (N-04); the view ends at exit, at `supportViewMaxMs`, at session revocation, or when the SuperAdmin is suspended;
  at its end the next request is the SuperAdmin's own session (the viewed paths answer the uniform 404 without the
  banner; the page cannot say why). The BFF answers every POST except exit and sign-out with the uniform 404 and every
  `/admin` page or POST with the 409 page; **`/admin/operations/<key>` is therefore unreachable in a view, and Core
  refuses an operation lookup by a support-view actor** (N-09). The viewed surfaces are `ta` or `ops` only: **the
  Accounts area of an operator who holds the accounting grant is absent from the view** (`sessions.ts:111`;
  `accounts.surface_read` has no `sv`; N-01, STOP-W15-03, PLAN S-15). No byte release has `sv`.
- **Read grant scope.** The grantee reads applications, history, document details and group of that group and releases
  their bytes (document and selection retrieval); never incidents, payments, notices or intake; validity is checked at
  every use and fails closed while the clock is unhealthy. F-38 and E-24: the case pages and the result and delivery
  pages show the grantee the download control for each file Core permits; a support view shows none.
- **Address change.** As the first version: start at the account revision; `email_unchanged`; `email_change_open` (also
  for a change past its end that the cleanup task has not closed, while the read hides it: STOP-W15-01); no uniqueness
  check at start; confirm only from the starting session; a wrong code and an expired change are **accepted** as
  `invalid` (with `ended`); a dead code is refused `otp_invalid_or_expired`; the new proof switches sign-in and
  document address together and ends every session, or ends the change as `invalid_address`; cancel from any session.
  No command sends a code again.
- **Notice acknowledgement (operator and SuperAdmin routes).** Recipient only; `ack_not_required`;
  `already_acknowledged` (before the revision); `stale_revision`. Staff notices posted on `lane-ui` need no
  acknowledgement except a disclosure deletion request to a staff recipient. `dlv.notices` returns the newest 200 (the
  default limit; N-06).
- **Kernel.** The input schema runs first: a blank or short reason answers `input_invalid` at `reason`; every
  `privilegedElevation` command (request, approve, reset, both grants, support view) answers `audit_degraded` while the
  audit record is behind, before the policy; a same-key replay resolves before that check. Decline, revoke, suspension
  and the address change are not privileged.
- **Reads.** As design §1.2 "Lists": `iam.admin_elevations` (every open request, wire ≤ 500; the 50 most recent
  decided); `iam.admin_grants` (every active grant, no SQL limit, wire ≤ 2000; the 50 most recent ended; active
  operators with an authenticator: id and name only; the two limits; `auditOk`); `iam.admin_account` (the account's
  active grants and open request); `iam.email_change_page` (hides a change past its end); `iam.account_page` (no
  address-change fact); `core.admin_group` (label, travel dates, state, applications; no owning travel agent); no
  single-elevation and no single-grant read.
- **Facts no read returns.** The decider of a request older than the 50 most recent decided (STOP-W15-02); who revoked
  a grant (STOP-W15-06); applicant names on staff notices (STOP-W15-07); the role-change time of an elevated operator;
  who opened a support view of an account (audit only).

### 0.2 Conventions

- **Personas.** SuperAdmins: `superadmin-1` (SA1: requester, support views, set-up) and `superadmin-2` (SA2: second
  approver, grant giver and revoker, the suspension and restoration of TAx, second tabs). Run-created accounts (design
  §6.2): OPe `wp15-ope-[stamp]` (operator: accounting grant, reset, elevation, emergency suspension, restoration
  requests); OPg `wp15-opg-[stamp]` (operator: the grantee of the read grant on G1); TAx `wp15-ta-[stamp]` (travel
  agent: the address change; suspended and restored during a support view); `wp15-sa-[stamp]` (a new SuperAdmin
  account, declined). Seeded, unchanged: `syn-ta-1` (the support-view scope comparison; G1 is one of its groups),
  `syn-ta-2` (isolation), `operator-1` (OP1: holds duties from earlier runs; its notices are read), `operator-2` (OP2:
  isolation). They stand for `syn-superadmin-1`, `-2` and `syn-operator-1`, `-2`. Keyboard-only user. Screen-reader
  user. Phone user (390 px wide).
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test (design §7.1: `identity-words.test.ts`,
  `accounts-pages.test.ts`, `bff-account-access.test.ts`, `elevation-pages.test.ts`, `bff-elevations.test.ts`,
  `grant-pages.test.ts`, `bff-grants.test.ts`, `email-change-pages.test.ts`, `bff-email-change.test.ts`,
  `staff-notices.test.ts`, `identity-host-pages.test.ts`, `signin-harness-rules.test.ts`, and the system tests of design
  §7.3). `L+T`: both are required. "Gallery" is the design's gallery state.
- **Sign-in codes and capture (rule C; Q-W15-06; N-11).** As WP-01 §0.2. The harness signs in, enrols run-created staff
  accounts and types emailed codes into the page (U7 `enrol`, `enterMailedCode`); it keeps keys in process memory for
  the run only and never returns, prints, logs or stores a code or a key. Its enrolment and address-change helpers serve
  only accounts in its run-owned registry and refuse seeded and unrelated accounts. No screenshot, trace or video is
  taken during a secret-bearing step (enrolment, a sign-in code, an address-change code); page screenshots elsewhere are
  allowed (no page shows a code). The address change never runs on a seeded account.
- **Copy.** Quoted text is draft copy (CR-09); the design's §2.12 and §2.13 tables govern the words. Draft copy passes
  when the page states the same facts. The §11.3 boundary form is mandatory for an unavailable action. Core's reasons
  show in words; a code shows only as the UAT-13 fallback (A97). No page shows a package or record id. No page states a
  configured duration or count that its read does not return.
- **Account and access words (design §2.12).** Elevation kinds: "New SuperAdmin account", "Operator to SuperAdmin",
  "Restore a suspended SuperAdmin". Request states: "Waiting for a second SuperAdmin"; open past its end "Expired at
  [time] IST: it closes by itself"; "Approved by [name]"; "Declined by [name]"; "Withdrawn by the requester"; "Expired".
  Grant kinds: "Group read" ("Group read grant"), "Accounting" ("Accounting grant"). Grant states: "Active"; "Active in
  the record, but its time passed at [time] IST: no access now"; "Revoked on [time] IST"; "Expired on [time] IST". End
  reasons: "Revoked by a SuperAdmin", "Its time passed", "Ended: the operator was suspended", "Ended: the operator became
  a SuperAdmin". Banner (AM-W15-01, SH-R09): "Read-only view for [name]"; "You see what this [travel agent / operator]
  account can read now. You cannot act as them, change anything or download documents."; "Reason: [reason]"; "Ends at
  [time] IST."; "Account [reference]"; button "Exit support view". Read grant (SH-R10): "Read-only access: [purpose],
  until [time] IST". Address change: steps "New address", "Code from your current address", "Code from your new
  address"; pending line "Your sign-in and document email remain [current address] until both addresses are verified."
  (UX §4.4, exact); mail states (design §2.12.5): "Being sent"; "Handed to the mail service. This does not show that it
  reached your inbox."; "Stored in the test mailbox. No real email was sent."; "Could not be sent. Cancel the change and
  start again."; "Sending may have failed. If no email arrives, cancel the change and start again." Forbidden on WP-15
  pages: "Override", "Impersonate", "Sign in as", "Log in as", "Recover", "Reset password", "Something went wrong",
  "Mark as read", "I deleted it", "Nothing changed" before a proven refusal.
- **Dates and times.** Every time carries "IST".
- **Freshness (LD-08).** Every WP-15 read is authoritative: "Read at [time] IST". SA-01 group 7 (observation) follows
  WP06-A09.
- **Facts.** A page shows only facts that a named read returns. A fact read after an operation is "Current". A count
  that cannot be read is "Unavailable", never "0". A list at its cap says so and qualifies its counts.
- **Receipts (design §2.14).** CMP-08 as WP06-A103: the request reference links to the operation status page; no
  accepted time, no actor (P-02, S-08); nothing from the address; never an instruction to act; announced politely.

| Command | Host of the receipt | Named when | Title (draft) | Otherwise |
|---|---|---|---|---|
| `iam.request_elevation` | SA-06c | resource `account` = path id; `result` `requested`; `elevationId` `elv_…` | "Elevation requested"; Current "Waiting for a second, different SuperAdmin. Ends [time] IST." (or "This request is no longer open.") | Unchecked receipt |
| `iam.approve_elevation` | SA-09s | `result` `approved`, `elevationId` = path id | "Request approved" | `result` `expired`: "Request recorded as expired" with "Nothing changed for [target]."; else unchecked |
| `iam.decline_elevation` | SA-09s | `result` `declined` / `withdrawn`, id = path id | "Request declined" / "Request withdrawn" | Unchecked |
| `iam.reset_credentials` | SA-06c | resource = path id; `result` `credentials_reset` | "Second factor reset" | Unchecked |
| `iam.create_group_read_grant` | SA-06h | `result` `created`, `grantId` = path id, and the page's row with that id has kind `group_read` | "Read access given" | Unchecked (the accounting grant returns the same summary) |
| `iam.set_accounting_grant` | SA-06h | as above with kind `accounting` | "Accounting grant given" | Unchecked |
| `iam.revoke_grant` | SA-06h | `result` `revoked`, resource = path id | "Grant revoked" | Unchecked |
| `iam.start_support_view` | — | — | No receipt: the banner, read from the session, states who, why and until when (D-W15-11); a lost answer follows A94 (N-09) | — |
| `iam.end_support_view` (WP-01) | SA-06c of the viewed account | `result` `ended` | "Read-only view ended" | Unchecked |
| `iam.start_email_change` | TA-12e | `result` `started`, `emailChangeId` `emc_…` | "Address change started" | Unchecked |
| `iam.confirm_email_change` | TA-12e | `result` `current_verified` | "Current address confirmed" | `invalid`, `invalid_address`: no receipt, the re-rendered step (A70, A72, A73); `completed`: the sign-in page (WP01-A56) |
| `iam.cancel_email_change` | TA-12e | `result` `cancelled` | "Address change cancelled" with "Your address did not change." | Unchecked |
| `dlv.acknowledge_notice` (operator and SuperAdmin routes) | OP-10i, SA-10i | `noticeId` = path id | "Notice acknowledged" | Unchecked |

  The unchecked receipt reads "Request reference [key]. The receipt cannot be checked now." Only the operation status
  page reads "Nothing is recorded for request [reference] so far" for a key with no record (N-10). Another person who
  opens a receipt address gets the unchecked receipt with current authorized facts (J-09).
- **Replay terms.** As WP-13 §0.2 (1 identical replay; 2 changed-content conflict; 3 Browser Back; 4 rejected-form
  refresh; 5 lost acknowledgement); a business duplicate and a raw stale envelope belong to the matrix (A95).
- **Refused sends leave no record.** Every refusal item checks by delta: open elevation requests, the account revision,
  role, status and authenticator, the enrolment row, grants (active and ended), support views (audit), the address and
  its open change, notice acknowledgements, releases.
- **Paths (LD-03; design §1.3; Q-W15-13 B).** Kept: SA-06a `/admin/accounts` (tab "User accounts"), SA-06c
  `/admin/accounts/:accountId`, SA-06d `…/duties` (WP-02); SA-06e `/admin/elevations` (tab "Elevation requests",
  AM-W15-01); SA-06g `/admin/grants?kind=&page=` (tab "Grants"); TA-12a, OP-10a, SA-10a `/account`; TA-12e
  `/ta/account/email` (edge); OP-10n `/ops/notices?view=`, OP-10i `/ops/notices/:noticeId`; SA-10n `/admin/notices?view=`,
  SA-10i `/admin/notices/:noticeId`. New (design): SA-09s `/admin/elevations/:elevationId/decide/:kind`, `kind` ∈
  {`approve`, `decline`}; SA-06h `/admin/grants/:grantId`; SA-06n `/admin/grants/new?group=&grantee=` (form → POST
  `/admin/grants`); SA-06x `/admin/grants/:grantId/revoke`. New task pages (B; this checklist's names, the build names the
  paths): SA-06q "Request elevation" (POST `/admin/accounts/:accountId/elevation`), SA-06k "Reset the second factor"
  (POST `…/reset-credentials`), SA-06t "Give the accounting grant" (POST `…/accounting-grant`), SA-06v "Open a read-only
  view" (POST `/admin/support-view`). Every POST path stays. Pages of other packages: SA-01 (WP-06), SA-04g (WP-11, I-15),
  OP-01a, OP-02 (WP-07), TA-10 and the result and delivery pages (WP-08), SA-07 and SA-09c (WP-07, ceiling), SA-08a and
  SA-08s (WP-14), PUB-02, SH-02, the enrolment pages (WP-01).
- **Pass rule.** WP-15 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred items of
  §5. Recorded, not failed: **"V22 scope completeness: Partly met"** (A150: the read-only view of an accounting holder
  omits the Accounts area; STOP-W15-03, PLAN S-15, N-01); A04 and A24 "Partly met" (the decider of an older request:
  STOP-W15-02, criterion point 2 unproven, N-12); A73 part (3) "Unmet: waits for STOP-W15-01" (Core counts a change past
  its end as open; the UI words pass); A81 live part "Deferred" (§6 Q-04). Without U7 (Q-W15-06), the steps marked "L
  (U7)" run as tests and the run record says so. A failed item becomes a finding ranked P0, P1 or P2 with its scenario.
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-06, WP-07 (with F-38), WP-08 (with E-23, E-24), WP-11 phase 2 (SA-04g
  with I-15) and WP-14 are integrated. The processing instance runs (mail tasks, the cleanup task). Where a package is
  not integrated, the step runs on the existing page and the run record says so.
- **Data hygiene (Q-W15-05; design §6.2).** WP-15 writes: OPe, OPg and TAx (created, approved, activated; OPe and OPg
  enrolled); OPe elevated, then suspended; restoration requests of OPe (one declined, one withdrawn); `wp15-sa` created
  and declined; TAx's address changed once; one group read grant of OPg on G1 given and revoked; one download by OPg of a
  file of G1; SA1's support views of `syn-ta-1`, OPe, OPg and TAx with their ends. Lettered additions beyond design
  §6.2 (§6 Q-12): OPe's accounting grant given and revoked, OPe's reset and re-enrolment, the support view of OPe, the
  withdrawn restoration request, TAx's second change started and cancelled, TAx's suspension and restoration. WP-15
  MUST NOT change the status, role, address, authenticator or grants of a seeded account; a support view of `syn-ta-1`
  records only its start and end. OPe ends as a suspended SuperAdmin with the run's tag. Identifiers stay in the
  internal run record only.

### 0.3 Synthetic data used by WP-15 (design §6.2)

| Item | Value | Use |
|---|---|---|
| OPe | Operator `wp15-ope-[stamp]@synthetic.test`, display name "WP15 operator E [stamp]" | Accounting grant, Accounts comparison, reset, elevation, emergency suspension, restoration requests (V21) |
| OPg | Operator `wp15-opg-[stamp]@synthetic.test`, display name "WP15 operator G [stamp]" | The grantee on G1; its support view (V22) |
| TAx | Travel agent `wp15-ta-[stamp]@synthetic.test`; new address `wp15-ta-[stamp]-new@synthetic.test`; the cancelled second change `wp15-ta-[stamp]-c@synthetic.test` | The address change (V21-14); suspension and restoration in a support view (V22-11) |
| `wp15-sa` | SuperAdmin `wp15-sa-[stamp]@synthetic.test` | Created and declined (V21-9) |
| G1 | A group of `syn-ta-1` with at least one application; a released result file if an earlier package released one, otherwise an evidence document Core permits under the grant | The read grant; the downloads of V22-0b and V22-9 |
| Read grant | OPg on G1; purpose "WP15 [stamp] check the documents of a synthetic support case"; last day: tomorrow (SA-06n default) | V22-0 to V22-9 |
| Reasons | "WP15 [stamp] …", at least 10 characters | Every decision |
| Fixtures (tests and gallery) | Requests of each kind and state (past their end; requester suspended; target with a duty; target changed); one active SuperAdmin; 50 decided; grants past their end, ended by suspension and by elevation; an operator at the limit; 2000 active grants; audit record behind; clock unhealthy; a view at its end time; a view of a suspended account restored before exit; a lost answer of the view start, committed and not committed; address changes expired, exhausted, in the cleanup window, from another session, to an address in use; a staff deletion-request notice; 200 staff notices; a `reassigned_away` notice; a lost acknowledgement per command; harness registry fixtures (seeded, unrelated and run-owned accounts) | T items and the gallery |

### 0.4 Run recipe (rerunnable)

- Run tag `wp15-[yyyymmddhhmm]`. First checks: (1) U7 is present (`enrol`, run-created sign-in, `enterMailedCode`) and
  its guard tests pass (A151); otherwise the "L (U7)" steps run as tests; (2) SA1, SA2, OP1, OP2, `syn-ta-1` and
  `syn-ta-2` sign in; (3) G1 exists; record whether a released file exists; (4) OP1 holds at least one duty (SA-06d) and
  at least one notice (OP-10n); otherwise V21-0g and N-1 run as tests; (5) SA1's session holds no support view.
- Baseline (step P-0): SA-06a "Active SuperAdmins" and "Open elevation requests"; SA-01 group 7 of SA1 and SA2; SA-06e
  rows; SA-06g active and ended rows; OP-10n of OP1; SA-10n of SA1; the group and application ids `syn-ta-1` reads on
  edge. Every later check is a delta from it.
- Setup 0 (design §6.2, labelled): SA1 creates, approves and activates OPe, OPg and TAx on SA-06b and SA-06c (WP-02); U7
  enrols OPe and OPg; the harness signs TAx in.
- Order (§3): P-0, Setup 0, Part V21 (V21-0a to V21-0g, then the design's V21-1 to V21-15 with lettered additions),
  Part V22 (the design's V22-0 to V22-13 with lettered additions), Part N, the test steps, Part X. V21-14 is split at
  the code to the new address: V21-14a and V21-14b run between its two proofs; V21-14c completes it. Every harness send
  uses the fields of a freshly loaded page unless the step says "raw".

### 0.5 Refusal shapes in the code (category / code)

Every WP-15 command also answers `validation_failed` / `input_invalid` on its schema (field `reason` or `purpose`, code
`custom`, for a text under its minimum or over its maximum after trimming; a blank reason is refused here, before the
kernel's `reason_required`; field `expectedRevision` `too_small` when the `_rev` value is missing),
`not_found_or_forbidden` / `access_denied` for a caller without the policy action or an unknown subject, and
`conflict_operation_key` / `operation_key_reused` for a reused key with other content. The privileged commands answer
`unavailable_dependency` / `audit_degraded` while the audit record is behind, before the policy. The BFF refuses
over-limit input locally before any command (design §2.16).

| Command | Refusals the items assert (in Core's order) |
|---|---|
| `iam.request_elevation` | `audit_degraded`; `access_denied`; `control_blocked` / `second_superadmin_required` (own account); `stale_revision` (revision; not an active operator with an authenticator); `control_blocked` / `elevation_target_has_duties`; `conflict_duplicate` / `elevation_open` |
| `iam.approve_elevation` | `audit_degraded`; `access_denied`; `stale_revision` (not `requested`; other revision); **accepted** `expired` at or after the end; `control_blocked` / `second_superadmin_required` (the requester; the target is refused earlier, §0.1); `control_blocked` / `elevation_requester_inactive`; `stale_revision` (target changed); `control_blocked` / `elevation_target_has_duties` |
| `iam.decline_elevation` | Not privileged. `access_denied`; `stale_revision`. Accepted `withdrawn` (requester) or `declined`; no expiry check |
| `iam.reset_credentials` | `audit_degraded`; `access_denied`; `validation_failed` / `self_action_not_allowed`; `stale_revision` (revision; status); `unavailable_parked` / `parked_lost_mailbox_recovery` (travel agent) |
| `iam.create_group_read_grant` | `audit_degraded`; `access_denied` (unknown grantee; not a SuperAdmin); `validation_failed` / `grantee_not_operator`; `access_denied` (unknown group → the shell); `validation_failed` / `grant_duration_exceeded`, `input_invalid` `validUntil`; `unavailable_dependency` / `clock_degraded`; `conflict_duplicate` / `grant_exists` (`existing`); `control_blocked` / `grant_limit_reached` |
| `iam.set_accounting_grant` | `audit_degraded`; `access_denied`; `validation_failed` / `grantee_not_operator`; `conflict_duplicate` / `grant_exists` |
| `iam.revoke_grant` | Not privileged. `access_denied`; `stale_revision` |
| `iam.start_support_view` | `audit_degraded`; `access_denied`; `validation_failed` / `support_view_target_not_eligible`; `unavailable_dependency` / `clock_degraded`; `conflict_duplicate` / `support_view_active`. No status check of the viewed account |
| `iam.start_email_change` | `validation_failed` / `email_invalid`; `rate_limited`; `access_denied`; `stale_revision`; `validation_failed` / `email_unchanged`; `conflict_duplicate` / `email_change_open` |
| `iam.confirm_email_change` | `unauthenticated`; `rate_limited`; `input_invalid` (`code`, `proof`); `access_denied` (another session); `stale_revision`; `validation_failed` / `otp_invalid_or_expired`. Accepted, not a success: `invalid` (`ended` null, `attempts_exhausted` or `expired`), `invalid_address` |
| `iam.cancel_email_change` | `access_denied`; `stale_revision` |
| `dlv.acknowledge_notice` (staff routes) | `access_denied`; `validation_failed` / `ack_not_required`; `conflict_duplicate` / `already_acknowledged`; `stale_revision` |
| BFF answers (no Core call) | In a support view: every POST except exit and sign-out → uniform 404; every `/admin` page or POST (also `/admin/operations/<key>`) → the 409 page. An operator on an `/admin` route → uniform 404. A route id that does not parse, or an unknown `kind` → uniform 404. Over-limit or malformed form input → a local refusal at its field (§2.16), no command. No route changes a travel agent's address from a staff page |

## 1. Scope

### 1.1 Pages (design §1.3 with Q-W15-13 B)

| Page | Host and path | Part in WP-15 |
|---|---|---|
| SA-06c Account (WP-02 page) | 4652 `/admin/accounts/:accountId` | "Access and support" holds facts and links to the four task pages; "Grants"; receipts `elevation_requested`, `credentials_reset`, `support_view_ended`; AM-W15-06 next actions |
| SA-06q, SA-06k, SA-06t, SA-06v (task pages, B) | 4652, paths named by the build | Hosts of `iam.request_elevation`, `iam.reset_credentials`, `iam.set_accounting_grant`, `iam.start_support_view` |
| SA-06e Elevation requests | 4652 `/admin/elevations` (kept, rebuilt) | Open and decided requests; links to SA-09s; no form |
| SA-09s Elevation decision | 4652 `/admin/elevations/:elevationId/decide/:kind` (new) | Hosts of `iam.approve_elevation` (`approve`) and `iam.decline_elevation` (`decline`; the requester withdraws) |
| SA-06g Grants | 4652 `/admin/grants?kind=&page=` (kept, rebuilt) | Active and ended grants; paging 50; kind filter; no form |
| SA-06h Grant | 4652 `/admin/grants/:grantId` (new) | Facts of one grant; receipts `granted`, `accounting_granted`, `revoked` |
| SA-06n Give read access to a group | 4652 `/admin/grants/new?group=&grantee=` (new); POST `/admin/grants` | Host of `iam.create_group_read_grant`; the group shown from Core before the form |
| SA-06x Revoke a grant | 4652 `/admin/grants/:grantId/revoke` (new GET beside the POST) | Host of `iam.revoke_grant` |
| Support-view mode (SH-R09) | 4652, every travel-agent or operator page in a view; the banner | Words (AM-W15-01), scope, no action, exit, access changes |
| TA-12a, OP-10a, SA-10a Your account (WP-01 page) | `/account` on 4650 and 4652 | Address section, pending line, staff copy |
| TA-12e Change your email address | 4650 `/ta/account/email` (kept, rebuilt) | Hosts of the three address-change commands |
| OP-10n, SA-10n Notices; OP-10i, SA-10i Notice | 4652 `/{ops,admin}/notices`, `/{ops,admin}/notices/:noticeId` (kept, rebuilt) | Staff words; host of `dlv.acknowledge_notice` on the staff routes (CC-03) |
| SA-06a, SA-06d (WP-02); SA-01 (WP-06); SA-04g (WP-11); OP-01a, OP-02 (WP-07); result and delivery pages (WP-08); SA-08a, SA-08s (WP-14) | 4652 / 4650 | Links to the WP-15 pages; the grantee's download control (F-38, E-24); observation |

### 1.2 Command coverage (CC §5.1: 11 WP-15 commands; CC-03; CC-20)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `iam.request_elevation` | `admin.accounts.elevation` (`/admin/accounts/:accountId/elevation`) | SA-06q | A06 to A11 |
| 2 | `iam.approve_elevation` | `admin.elevations.approve` (`/admin/elevations/:elevationId/approve`) | SA-09s `approve` | A15 to A18, A21 to A24 |
| 3 | `iam.decline_elevation` | `admin.elevations.decline` (`…/decline`) | SA-09s `decline` | A19 to A21, A23, A24 |
| 4 | `iam.reset_credentials` | `admin.accounts.reset_credentials` (`…/reset-credentials`) | SA-06k | A25 to A29 |
| 5 | `iam.create_group_read_grant` | `admin.grants.create` (`/admin/grants`) | SA-06n | A33 to A38 |
| 6 | `iam.revoke_grant` | `admin.grants.revoke` (`/admin/grants/:grantId/revoke`) | SA-06x | A39 to A42, A46 |
| 7 | `iam.set_accounting_grant` | `admin.accounts.accounting_grant` (`…/accounting-grant`) | SA-06t | A43 to A45 |
| 8 | `iam.start_support_view` | `admin.support_view.start` (`/admin/support-view`) | SA-06v | A47 to A51 |
| 9 | `iam.start_email_change` | `ta.account.email.start` (`/ta/account/email`) | TA-12e state a | A66 to A68 |
| 10 | `iam.confirm_email_change` | `ta.account.email.confirm` (`…/confirm`) | TA-12e states c, d | A69 to A73, A75, A76 |
| 11 | `iam.cancel_email_change` | `ta.account.email.cancel` (`…/cancel`) | TA-12e (open change, any session) | A74, A75 |
| CC-03 | `dlv.acknowledge_notice` | `ops.notices.acknowledge`, `admin.notices.acknowledge` | OP-10i; SA-10i | A80, A81 |
| ref | `iam.end_support_view` (WP-01) | `admin.support_view.end` | SH-01 banner | A52, A58 |
| ref | `iam.sign_out` (WP-01) | `sign_in.sign_out` | `/account` | A65, A83 |

All of them also: A91 to A105, A151. Commands outside WP-15 touched as set-up or observation: `iam.create_account`,
`iam.approve_account`, `iam.activate_account`, `iam.suspend_account`, `iam.restore_account` (WP-02); `iam.staff_enrol`
and the sign-in commands (WP-01, through U7); `dlv.retrieve_document` (byte release, V22-0b, V22-9); the ceiling
commands (WP-07, observed in V21-11).

### 1.3 State coverage

S1 does not apply: every page is server-rendered.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| SA-06c | Per role and status; elevate withheld (duties); audit behind; open request (also past its end); grants A01 to A04 | — | A27 (parked reset callout) | A07, A26 (receipts), A58 | — | — |
| SA-06q | Form; duties; no authenticator; open request; not eligible A06, A08; audit behind A11 | A09 | A08, A09 | A07 | A94 | A09 |
| SA-06e | Open; past its end; decided; cap; audit line A12, A13 | — | — | — | — | — |
| SA-09s | States 1 to 9 (design §2.3) A15, A17, A18, A21, A22 | A21 | A17, A21 | A16, A19, A20, A22 | A94 | A21, A23 |
| SA-06k | Staff active or suspended; travel agent and own account not offered A25, A27 | A28 | A27, A28 | A26 | A94 | A28 |
| SA-06g | Active, past its end, ended, cap, filter, paging, audit behind A30 to A32 | — | — | — | — | — |
| SA-06h | Active; past its end; ended; not listed; receipts A149 | — | — | A34, A40, A44 | — | — |
| SA-06n | Step 1; step 2; read unavailable; audit behind; no operator; at the limit A33, A35, A37 | A35 | A35, A36, A37 | A34 | A94 | — |
| SA-06x | Active; ended; time passed A39, A41 | A41 | A41 | A40 | A94 | A41 |
| SA-06t | Operator without the grant; holds it; not eligible A43, A45 | A45 | A45 | A44 | A94 | — |
| SA-06v | Active account; account not active (warning, form stays) A47, A49; view open; audit, clock A50 | A50 | A49, A50 | A48 | A94 (N-09) | — |
| Support-view mode | Banner; travel agent and operator scope; Accounts omitted A150; access changes; restoration; expiry A52 to A59 | — | A56, A57 | — | — | — |
| TA-12a, TA-12e | States a to d; other session; ended results; support view A65 to A75 | A68, A70 | A68, A70, A72, A73 | A67, A69, A71, A74 | A94 | A76 |
| OP-10n, OP-10i, SA-10n, SA-10i | Views, cap 200, S2, S3, S7; acknowledgement needed, not needed, done A79 to A86 | — | A80, A81 | A81 | A94 | A81 |

### 1.4 Specification scenarios

| Scenario | What WP-15 shows | Items |
|---|---|---|
| V21 clause 1: "One SA can suspend in emergency/lower exposure" | SA1 suspends OPe (a SuperAdmin) alone (WP-02, observed V21-7); decline, revoke and suspension stay available while the audit record is behind; the ceiling decrease is WP-07's (V21-11) | A11, A32, A41; §3 V21-7, V21-10, V21-11 |
| V21 clause 2: "distinct second SA is required for ordinary SA elevation/ceiling increase" | SA1 requests OPe's elevation; neither SA1 nor OPe can approve; SA2 approves; restorations are declined and withdrawn; a new SuperAdmin account is declined; an approval after the end records the expiry only; with one active SuperAdmin nobody can approve; privileged elevation waits for the audit record | A06 to A24; §3 V21-1 to V21-10 |
| V21 clause 3: "TA email has no admin override" | No staff page, route or support view changes a travel agent's address; TAx changes it with two proofs | A65 to A78; §3 V21-12 to V21-15 |
| V22 clause 1: "Support view matches selected user's current read scope" | The view of `syn-ta-1` reads the same group and application ids as `syn-ta-1`; the view of OPg reads G1 while the grant is active and not after; a suspended viewed account reads nothing until restored; **the view of an accounting holder omits the Accounts area: Partly met** | A47 to A54, A59, A150; §3 V21-0c, V22-1 to V22-2a, V22-7, V22-8, V22-11 to V22-11b |
| V22 clause 2: "offers no impersonation/action" | No form, download or acknowledge control in a view; a hand-made POST is not found; admin pages answer the 409 page; the exit stays | A52, A55 to A58; §3 V22-2 to V22-6 |
| V22 clause 3: "revoked old links/background results deny metadata/bytes" | After the revocation OPg's open page, links and visible download control deny; the view of OPg denies too; background results deny | A59, A61 to A64; §3 V22-8, V22-9, V22-10 |
| UX §2.3, §6.3; BS B08 to B11, B44 | Support view and read grant rows; account changes; credential recovery resets; boundaries | A25 to A29, A33, A43, A53 to A56, A61, A99 |
| UX §4.2, §5.2; AD-07; CC-03 | TA-12 and the two-proof change; staff notices with acknowledgement facts (LD-06); the accounting grant never makes OP-10 an Accounts product | A44, A46, A65 to A87 |
| UX §8.3; BS B33, B35 | Revoked access; lost acknowledgement; stale revision; containment during audit lag; replay | A11, A21, A41, A59, A61 to A63, A71, A94, A95 |
| UX §12 V24 | Task pages, the banner and TA-12e by keyboard and at 390 px | A106 to A117 |

## 2. Acceptance checklist

WP-02 items stay WP-02's (WP02-A83 to A102); WP-01 items stay WP-01's (WP01-A55, A56, A58, A67, A70 to A72, A131);
WP-07 owns the grantee's read-only views and the ceiling part of V21 (WP07-A08, A35, A83 to A89); WP-08 owns TA-10 and
the result and delivery pages (WP08-A89 to A99). WP-15 items extend them where the WP-15 states change those pages.

### 2.1 SA-06c Account: "Access and support" and "Grants"

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A01 | SuperAdmin (SA1); test | SA-06c of OPe, OP1, TAx, a suspended TAx (V22-11a), SA2 and SA1's own account (§3 V21-0a, V21-0f, V21-0g, V22-11a); test: every role × status × authenticator × open request × accounting grant × duties | Read "Access and support" (lead "Each action needs a reason and is recorded with your name."). | Facts and links only; no form (B). Links by the design §2.1 rows: an active operator with an authenticator, no open request and no duty (or duties not readable): "Request that [name] becomes a SuperAdmin" (SA-06q); with a duty: the CMP-10 "Requesting elevation is unavailable while [name] holds duties: … Hand them over first. Owner: SuperAdmin." with "Open duties and hand-off"; an active operator without the accounting grant: "Give [name] the accounting grant" (SA-06t); a travel agent or operator other than the reader, **in any status** (N-03): "Open a read-only view for [name]" (SA-06v); an operator or SuperAdmin other than the reader, active or suspended: "Reset [name]'s second factor" (SA-06k). A travel agent: no reset; the "Sign-in address" section states the lost-mailbox boundary. Own account: no reset, elevation or support link. A SuperAdmin: reset only. Audit behind: the privileged links show the reason "Approving, activating, restoring, the elevation request, the accounting grant, the read-only view and the second-factor reset are unavailable until it catches up. Declining, suspending and revoking stay available." | L+T | Design §2.1; Q-W15-13 B; N-03 |
| WP15-A02 | SuperAdmin (SA1); test | SA-06c of OPe with the open request (§3 V21-1); test: past its end | Read the request callout and the next action. | "Requested by [name] on [time] IST. Expires [time] IST." (or "Expired at [time] IST: it closes by itself."); links of AM-W15-06: "Decide the request" (another SuperAdmin) or "Withdraw your request" (the requester) to SA-09s. No approve form on SA-06c. | L+T | Design §2.1 item 2, AM-W15-06 |
| WP15-A03 | SuperAdmin (SA1); test | SA-06c "Grants" of OPe (§3 V21-0a) and of OPg (V22-0); test: past its end | Read the section. | Lead "Grants of this account. Each one is read-only access or the accounting grant; none adds an action on applications."; columns Grant (group reference as `identifier`), Purpose, Valid until ("Until revoked" for accounting; "Its time passed at [time] IST: no access now"), Granted ("[name], [time] IST"), Action ("Open" → SA-06h; "Revoke" → SA-06x); "Give read access to a group" → SA-06n `?grantee=` for an active operator with an authenticator; empty "No active grant." | L+T | Design §2.1 item 4 |
| WP15-A04 | SuperAdmin (SA1); test | SA-06c "History" of OPe after V21-0e and V21-7, and of TAx after V21-15 | Read the history. | Rows only from facts on the account subject with actor, recorded time and reason: OPe "Second factor reset", "Suspended"; TAx "Email change completed" by TAx, no admin step. No row for the elevation decision, a grant or a support view (other subjects); the role reads "SuperAdmin" (Current). Who decided an older request: "Partly met" (STOP-W15-02, N-12). | L+T | B-06; WP-11 I-10 |
| WP15-A05 | Test (`accounts-pages.test.ts`, `carried-forms-admin.test.ts`, the system tests of design §7.3) | SA-06c | Run the tests. | The four account entries leave the carried-form test (the WP-13 entries stay); SA-06c renders no WP-15 form; every link targets a registered GET route; the system tests that posted `/admin/support-view` from `/admin/accounts/:id` now load SA-06v first (B). | T | CC-20; design §1.6, §7.3 |

### 2.2 Request elevation: SA-06q (`iam.request_elevation`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A06 | SuperAdmin (SA1) | SA-06q of OPe (§3 V21-1) | Read the page. | CMP-25 frame; `h1` "Request that [OPe] becomes a SuperAdmin"; body "A second, different SuperAdmin decides the request. You cannot approve it yourself."; consequences "A request opens. Nothing changes for [OPe] until a different SuperAdmin approves it." · "On approval [OPe] becomes a SuperAdmin at once: every session of [OPe] ends, and every grant of [OPe] ends and is not restored." · "The request expires if nobody decides it in time; its end time shows once it is open."; duties line "Duties now: none." (or "Duties cannot be read now. TravelMudra refuses the request if [OPe] still holds any duty."); "Reason for requesting" (required); button; "Cancel" → SA-06c. No "72 hours". | L (U7) | Design §2.1 `elevate`; B |
| WP15-A07 | SuperAdmin (SA1, SA2) | SA-06q (§3 V21-1, V21-1a) | Give a reason; send. Read SA-06c, SA-06e, SA-01 and SA-06a. | 303 to SA-06c with "Elevation requested" and Current "Waiting for a second, different SuperAdmin. Ends [time] IST."; SA-06e lists it; SA-01 group 7 +1 for SA1 and SA2 ("1 of them requested by you" for SA1); SA-06a +1 (deltas). | L (U7) | Design §2.14; WP06-A04 |
| WP15-A08 | SuperAdmin (SA1); harness; test | SA-06c and SA-06q of OP1 (§3 V21-0g); tests | Live: read; harness posts the request for OP1. Tests: no authenticator; open request; not an operator; own account; suspended; duties read unavailable. | OP1: SA-06c shows the withholding CMP-10 with OP1's counts; SA-06q shows no form; the post → "[OP1] still holds duties. Hand them over first, then request again. Nothing was requested." (`elevation_target_has_duties`); open requests delta 0. Tests: no form with the reason per state; duties unavailable: the form with the duties line of A06 (Core checks). Parity test (design §7.2 (e)). | L+T | Design §2.1, §2.13, §7.2 (e) |
| WP15-A09 | SuperAdmin; test | SA-06q refusals | (1) Live (§3 V21-1): send with an empty reason. (2) Test: stale revision; `elevation_open`; own account (raw); unknown account (raw). | (1) "Give a reason of 10 to 1,000 characters." at the reason; values kept; nothing sent. (2) CMP-14 rows "Status; Open elevation request; Authenticator" with the reason kept; "An elevation request for [name] is already open. Nothing new was requested." + link; "You cannot request this for your own account."; the uniform 404. SA-06q re-renders (not SA-06c). Nothing recorded. | L (1) + T | Design §2.13, §2.15; B |
| WP15-A10 | SuperAdmin (SA1); harness | Nth time on SA-06q (§3 V21-1a) | Replay terms 1 to 5. | (1) Same 303 and receipt; one request. (2) Used form, values kept. (3) Back to SA-06q: no form, link to the open request. (4), (5) as the terms. A new key: `elevation_open`. | L+T | BS B35 |
| WP15-A11 | Test (V21-10) | SA-06c, SA-06q, the audit record behind | Render; send raw. | The reason on SA-06c (A01); SA-06q no form; raw → "The audit record is behind, so this is unavailable now. Nothing was recorded. Declining, suspending and revoking still work." | T | BS B33; design §2.13 |

### 2.3 Elevation requests: SA-06e

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A12 | SuperAdmin (SA1, SA2) | SA-06e (§3 V21-2, V21-4, V21-8, V21-9) | Read at each step. | Tab "Elevation requests"; `h1` "Elevation requests"; lead of design §2.2; "Read at". "Waiting for a decision" "[n] requests": Request (kind words), Account (→ SA-06c), Requested by ("You" or name), Requested, Ends; Action: requester "Withdraw your request" + "A different SuperAdmin decides."; others "Decide" and "Decline"; no reason column. "Decided": state words with the decider, When; at 50 rows "This list shows the 50 most recent decided requests." No form. Audit line when behind: "The audit record is behind. Approving is unavailable until it catches up. Declining and withdrawing stay available." | L (U7) | Design §2.2 |
| WP15-A13 | Test | SA-06e with a request past its end not yet closed; one active SuperAdmin | Render. | The row "Expired at [time] IST: it closes by itself" with **no link**; the section count, SA-06a and SA-01 group 7 count Core's open list, which includes it until the cleanup task closes it (§6 Q-03); no line claims it can be decided. | T | Design §2.2 item 3, D-W15-06 |
| WP15-A14 | SuperAdmin (SA1) | SA-01 group 7; SA-06a; SA-06c (§3 V21-1a, V21-4) | Follow the links. | Each opens SA-06e (or SA-09s); counts +1 after V21-1 and back to P-0 after V21-4. | L | WP06-A04; WP02-A83 |

### 2.4 Elevation decision: SA-09s (`iam.approve_elevation`, `iam.decline_elevation`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A15 | SuperAdmin (SA2) | SA-09s `approve` of OPe's request (§3 V21-4) | Read the page. | `h1` "Approve: [OPe] becomes a SuperAdmin"; scope "One request: Operator to SuperAdmin for [OPe] (account [reference]). Requested by [SA1] on [time] IST. Ends [time] IST."; evidence: the reason whole, target now (role, status, authenticator), duties now, requester now ("Active SuperAdmin"), "Active SuperAdmins now: [n]" (a failed read: "… cannot be read now. TravelMudra checks it when you approve."); effects of design §2.3 item 5; hard stops including CMP-10 "Creating or recovering a SuperAdmin without a second active SuperAdmin is unavailable until the product owner selects a recovery policy. Owner: product owner."; "Reason for approving" (hint "10 to 1,000 characters. It is kept in the audit record."); review; button "Approve: make [OPe] a SuperAdmin"; "Cancel" → SA-06e. | L (U7) | Design §2.3 |
| WP15-A16 | SuperAdmin (SA2); OPe; harness | SA-09s `approve` (§3 V21-4, V21-5) | Approve with a reason. OPe reloads; signs in again. | Receipt "Request approved" with the decided row (kind, target, requested by, approved by); Current: OPe SuperAdmin; SA-06e "Approved by [SA2]"; OPe's next request → sign-in; after sign-in the SuperAdmin home. | L (U7) | Design §2.14 |
| WP15-A17 | SuperAdmin (SA1, requester); harness; test | SA-09s `approve` (§3 V21-2, V21-2a, V21-3) | Read; harness posts the approval as SA1. | State 4: "You requested this. A different SuperAdmin approves it." with "Withdraw your request"; no form, no submit button. The post: "You requested this, or it is about your own account. A second, different SuperAdmin approves it. Nothing was approved." (`second_superadmin_required`); nothing recorded. | L (U7) + T | Design §2.3 state 4, §2.13 |
| WP15-A18 | OPe (operator); test | SA-06e and SA-09s as the target (§3 V21-2b); test: a pending or suspended target | OPe opens the addresses and posts the approval. Test: a request in the name of a pending or suspended target. | Actual refusal order (N-10): OPe has no SuperAdmin surface: the uniform 404 for the GET and the POST, before Core; nothing recorded. A pending or suspended target has no usable session: the request goes to sign-in. No page shows the target the second-SuperAdmin sentence. | L (U7) + T | N-10 (R-10); §0.1 |
| WP15-A19 | SuperAdmin (SA2) | SA-09s `decline` of OPe's restoration (§3 V21-8) and of `wp15-sa` (V21-9) | Read; decline with a reason. | `h1` "Decline the request: [kind words] for [target]"; effect "The request closes as declined. Nothing else changes for [target]." and, for the pending new account, "[target]'s account becomes Declined. Its address is free for a new account."; "Reason for declining"; "Decline the request" (destructive); receipt "Request declined"; OPe stays suspended; `wp15-sa` Declined. Works while the audit record is behind (A21). | L (U7) | Design §2.3 decline |
| WP15-A20 | SuperAdmin (SA1, requester) | SA-09s `decline` of the second restoration request (§3 V21-8a) | Read; withdraw with a reason. | `h1` "Withdraw your request: Restore a suspended SuperAdmin for [OPe]"; "Reason for withdrawing"; "Withdraw the request"; receipt "Request withdrawn"; SA-06e "Withdrawn by the requester". | L (U7) | Design §2.3 |
| WP15-A21 | SuperAdmin (SA2, two tabs); test | SA-09s races and states 5 to 8 (§3 V21-6); tests | Live: tab 2 `decline` loaded in V21-4, sent after the approval; a new-key approval with the old revision. Tests: requester suspended (state 6); target gained a duty (state 7); target changed (state 8); audit behind (state 5; decline accepted); one active SuperAdmin. | Live: CMP-14 "Approved by [SA2] on [time] IST", the reason in the unsent block; one decision. Tests: the state copy of design §2.3 with its link; Core's sentences of §2.13 for a raw send; one active SuperAdmin: "No other active SuperAdmin exists now, so nobody can approve it before it ends." Nothing recorded for a refusal. | L (U7) + T | Design §2.3, §2.15 |
| WP15-A22 | Test | SA-09s at and after the end | (1) Render after the end. (2) An approval sent after the end. | (1) State 3: "This request expired at [time] IST. TravelMudra records it as expired by itself; nothing changes for [target]. A new request is needed." No form. (2) Receipt "Request recorded as expired" with "Nothing changed for [target]."; never "approved". | T | Design §2.3 state 3, §2.14 |
| WP15-A23 | SuperAdmin (SA2); harness | Nth time on SA-09s (§3 V21-6) | Replay terms 1 to 5. | (1) Same 303 and receipt. (2) Used form. (3) Back: state 2 "This request was approved by [SA2] on [time] IST" with the reason recorded; no form. (4), (5) as the terms. | L (U7) + T | BS B35 |
| WP15-A24 | SuperAdmin (SA1, SA2); test | WP-02 pages that open requests (§3 V21-8, V21-9) | Read the WP-02 receipts and SA-06c next actions; test: a restoration without an authenticator. | AM-W15-06 links to SA-09s; WP02-A88 and A98 complete on SA-09s; no old elevation page remains. Restoration without an authenticator: the effect line "An enrolment code is sent to [target]'s own address." The decider of a request older than the 50 most recent: "Partly met" (STOP-W15-02). | L+T | AM-W15-06; WP02-A88, A98 |

### 2.5 Reset the second factor: SA-06k (`iam.reset_credentials`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A25 | SuperAdmin (SA1) | SA-06k of OPe (§3 V21-0e) | Read. | `h1` "Reset [OPe]'s second factor"; body "For a lost or compromised authenticator. Nobody sees or chooses a credential, you included."; consequences "The authenticator is removed and every session of [OPe] ends at once." · "An enrolment code is sent to [OPe]'s own address. [OPe] sets up a new authenticator with it." · "Open sign-in codes and an open set-up stop working."; the latest enrolment shown when one exists; reason; destructive button; "Cancel". | L (U7) | Design §2.1 `reset`; B |
| WP15-A26 | SuperAdmin (SA1); OPe; harness | SA-06k (§3 V21-0e) | Reset with a reason; OPe reloads; U7 enrols OPe again. | 303 to SA-06c, receipt "Second factor reset" ("Every session of the account ended and its authenticator was removed."); Current: authenticator "Not set up", enrolment (state, mail words, end), open sessions 0; OPe → sign-in; no code, key or QR image shown to SA1. | L (U7) | Design §2.14 |
| WP15-A27 | SuperAdmin (SA1); harness; test | SA-06c of TAx and of SA1 (§3 V21-0f); test (V21-13) | Look for a reset link; harness posts the reset for TAx and for SA1. | No link. TAx: the refusal callout under the header "A travel agent has no second factor: sign-in uses their own address. Signing in without that mailbox is unavailable until the product owner approves a recovery rule. Owner: product owner. Nothing changed."; SA1: "You cannot reset your own second factor. Ask another SuperAdmin."; nothing recorded. | L+T | Design §2.1, §2.13 |
| WP15-A28 | SuperAdmin; test | SA-06k refusals | (1) Live (§3 V21-0e): empty reason. (2) Tests: stale; a pending or declined account (raw); audit behind. | (1) The reason sentence; nothing sent. (2) CMP-14 (Status; Authenticator); the stale answer with the current status; audit: no form and A11's sentence. SA-06k re-renders. Nothing recorded. | L (1) + T | Design §2.13, §2.15 |
| WP15-A29 | SuperAdmin; harness; test | Nth time on SA-06k (§3 V21-0e) | Replay terms 1 to 3; test: a second reset from a fresh page. | Same receipt, one reset, one enrolment; Back to SA-06k shows the current enrolment; the second reset from a fresh page is accepted (no guard) and the effect text says a new code replaces the earlier one. | L+T | Design §4.1 |

### 2.6 Grants: SA-06g and SA-06h

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A30 | SuperAdmin (SA2) | SA-06g (§3 V22-0, V22-8) | Read; filter by kind; clear. | `h1` "Grants"; lead of design §2.4; primary "Give read access to a group" → SA-06n; rule line "An operator holds at most [m] active group read grants. A group read grant lasts at most [n] days." (from the read); kind filter in the address; "Active" "[n] active grants" ("2000 or more" at the cap); columns Grant, Operator, Purpose (whole), Valid until, Granted, Action ("Open", "Revoke"); paging of 50; "Ended" with How words and the cap line "This list shows the 50 most recently ended grants."; S2/S3 words. No form. | L | Design §2.4 |
| WP15-A31 | Test | SA-06g with a grant past its end; grants ended by suspension and elevation; 200 grants; 2000 | Render. | "Active in the record, but its time passed at [time] IST: no access now" and no "Revoke" for it; end words of §0.2; 200 rows in 4 pages; "2000 or more"; filter state words. | T | Design §2.4, §4.5 |
| WP15-A32 | Test (V21-10) | SA-06g, SA-06n, SA-06t, SA-06x with the audit record behind | Render; send. | The primary action unavailable with "Unavailable while the audit record is behind."; SA-06n and SA-06t no form ("Giving read access is unavailable until the audit record is healthy again. Revoking stays available. Owner: TravelMudra."); a revoke is accepted. | T | Design §2.4, §2.6; BS B33 |
| WP15-A149 (new) | SuperAdmin (SA2, SA1); test | SA-06h of OPe's accounting grant (§3 V21-0a, V21-0d) and of OPg's read grant (V22-0, V22-8); test: past its end; not listed | Read after each receipt. | `h1` "[Group read grant / Accounting grant]: [operator]"; receipt per §0.2 (kind checked against the page's row); facts Kind, Operator, Group (→ SA-04g), Purpose, Valid from, Valid until, Granted by, State (design §2.12.2); action panel: active "Revoke it when the access is no longer needed." → SA-06x, ended "A grant that ended is not restored. Give a new one if access is needed again." → SA-06n with group and grantee; line "The operator sees this access as “Read-only access: [purpose], until [time] IST” on their Applications page."; not listed: "No active grant has this reference. Ended grants are listed for the 50 most recent only." | L+T | Design §2.5, §2.14 |

### 2.7 Give read access to a group: SA-06n (`iam.create_group_read_grant`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A33 | SuperAdmin (SA2) | SA-06n for G1, from SA-04g "Give an operator read access to this group" or step 1 (§3 V22-0) | Step 1: type "abc"; then G1's reference ("Show the group"). Step 2: read. | Step 1 (GET form, no CSRF): "This is not a group reference. It starts with grp_."; no Core read. Step 2: "Read access to one group: [label] (reference [id]). Travel [start] to [return]. [n] applications." from `core.admin_group` before the form; links "Open the group", "Choose another group"; effects of design §2.6; fields Operator (select, no default unless `grantee`), "Named purpose", "Last day of access" (default tomorrow; hint with [maxDays] from the read); hidden `groupId` equal to the shown group; review; "Give read access". States: read unavailable "This step cannot be prepared now: …" (no form); no operator; audit behind (A32). | L (U7) | Design §2.6; Q-W15-02; I-15 |
| WP15-A34 | SuperAdmin (SA2); OPg | SA-06n step 2 (§3 V22-0) | Choose OPg; purpose; last day tomorrow; give. OPg opens OP-01a. | 303 to SA-06h with "Read access given" (kind checked); Current "Active"; OPg's OP-01a read-only section lists G1 "Read-only access: [purpose], until [time] IST" (WP07-A08). | L (U7) | Design §2.14 |
| WP15-A35 | SuperAdmin; harness; test | SA-06n refusals | (1) Live (§3 V22-0): no operator, empty purpose. (2) Harness raw (V22-0a): a last day beyond the maximum; yesterday; a forged hidden `groupId`. (3) Tests: a grantee that is not eligible (raw); an unknown group in a well-formed reference; clock unhealthy; audit behind; a malformed date. | (1) C1 at each field; nothing sent. (2) "Choose a last day from today up to [maxDays] days from now." at the date; forged `groupId`: "Choose the group again." and no command. (3) "Choose an active operator who has set up an authenticator."; unknown group: the shell (never a field error that names the group); clock: "The server clock disagrees with the database, so time-limited access cannot start now. Nothing was recorded. Try again later. Owner: TravelMudra."; date: "Enter the last day as a date." Values kept; grant deltas 0. | L (1), (2) + T | Design §2.13, §2.16; F-W15-15 |
| WP15-A36 | SuperAdmin (SA2); harness; test | `grant_exists` (§3 V22-0a); test: the earlier grant past its end | A new key for OPg and G1. | "This operator already holds read access to this group. Nothing new was given." with "Open the grant" (SA-06h of `existing`). Test: accepted; the earlier grant ends `expired`. | L (U7) + T | Design §2.13 |
| WP15-A37 | Test | SA-06n for an operator at the limit | Render; send. | The page counts the operator's unexpired active group read grants **from the returned active grants** ("[name] holds [k] of at most [m] active read grants", m from the read; "count may be incomplete" when the active list is at its 2000-row cap); Core's refusal: "This operator already holds the most active read grants allowed ([m]). Revoke one first, or choose another operator." at the operator; nothing recorded. | T | N-10 (R-10) |
| WP15-A38 | SuperAdmin (SA2); harness | Nth time on SA-06n (§3 V22-0a) | Replay terms 1 to 3. | Same 303 and receipt; one grant; Back shows step 2 with a fresh form; a new key: A36. | L (U7) + T | BS B35 |

### 2.8 Revoke a grant: SA-06x (`iam.revoke_grant`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A39 | SuperAdmin (SA1, SA2) | SA-06x of OPe's accounting grant (§3 V21-0d) and of OPg's read grant (V22-8) | Read. | `h1` "Revoke the [group read grant / accounting grant] of [operator]"; scope sentence; effects "Access ends at once: at the operator's next page, download or task run." · group: "[operator] can no longer read group [reference]." · accounting: "[operator] no longer sees the Accounts area."; unchanged lines; "Reason for revoking"; review; "Revoke the grant" (destructive); "Cancel" → SA-06h. | L (U7) | Design §2.7 |
| WP15-A40 | SuperAdmin | SA-06x (§3 V21-0d, V22-8) | Revoke with a reason. | 303 to SA-06h, "Grant revoked" ("Access ended at once."); Current "Revoked on [time] IST"; SA-06g "Ended". | L (U7) | Design §2.14 |
| WP15-A41 | SuperAdmin (SA2, two tabs); test | SA-06x states and races (§3 V22-8) | Tab 2 (loaded before) sends after tab 1. Tests: ended by time, suspension, elevation; time passed; audit behind; empty reason. | Tab 2: CMP-14 "Revoked on [time] IST", reason kept, one revocation. States: "This grant already ended: [state words]." / "Its time passed at [time] IST, so it gives no access now. TravelMudra records it as expired by itself." (no form). Audit behind: accepted. | L (U7) + T | Design §2.7, §2.15 |
| WP15-A42 | SuperAdmin; harness | Nth time on SA-06x (§3 V21-0d) | Replay terms 1 to 3. | Same receipt; one revocation; Back shows "This grant already ended …"; a new key: CMP-14. | L (U7) + T | BS B35 |

### 2.9 Give the accounting grant: SA-06t (`iam.set_accounting_grant`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A43 | SuperAdmin (SA1) | SA-06t of OPe (§3 V21-0a) | Read. | `h1` "Give [OPe] the accounting grant"; body "The grant opens the Accounts area for [OPe]. Every Accounts action is unavailable in this release; the grant gives no access to applications."; consequences "[OPe] sees the Accounts area from their next page." · "It stays until a SuperAdmin revokes it on Grants." · "A support view of [OPe] does not show the Accounts area." (N-01, STOP-W15-03); reason (10 to 500); button; "Cancel". | L (U7) | Design §2.1 `accounting`; B |
| WP15-A44 | SuperAdmin (SA1); OPe | SA-06t (§3 V21-0a) | Give with a reason. OPe reads `/account` and `/accounts`. | 303 to SA-06h with "Accounting grant given" (kind checked); OPe's OP-10a shows the grant with the B29 boundary (WP01-A72); `/accounts` shows the boundary page; no context entry. | L (U7) | Design §2.14; AD-12 |
| WP15-A45 | SuperAdmin; harness; test | SA-06t refusals (§3 V21-0b); tests | A new key after A44. Tests: not an operator (raw); audit behind. | "[OPe] already holds the accounting grant. Nothing new was given." + link SA-06h; "Only an active operator can hold the accounting grant. Nothing was given."; audit: A32. Nothing recorded. | L (U7) + T | Design §2.13 |
| WP15-A46 | OPe; test | After the revocation (§3 V21-0d) | OPe reloads `/account`; opens `/accounts`. | No accounting section; `/accounts` → SH-02; test: a page loaded before the revocation answers the shell on its next load (LD-14). | L (U7) + T | BS B10; LD-14 |

### 2.10 Open a read-only view: SA-06v (`iam.start_support_view`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A47 | SuperAdmin (SA1) | SA-06v of `syn-ta-1` (§3 V22-1), of OPe (V21-0c) and of a suspended TAx (V22-11a) | Read. | `h1` "Open a read-only view for [name]"; body "You read exactly what [name] can read now, with a banner on every page. You cannot act as [name]: no form, no download, no change."; consequences (N-04): "The view ends when you exit it, at the end time its banner shows, or when you are suspended." · "While [name]'s account is not active, the view shows nothing; it shows [name]'s pages again if the account is restored before the view ends." · "While it is open, SuperAdmin pages in this browser session show only the way out." · "The start, the end and your reason are recorded."; for an account that is not active (N-03) a warning before the button: "[name]'s account is [status]. A read-only view of it will show nothing until the account is active again."; reason (10 to 500); button "Open the read-only view"; "Cancel". No configured duration. | L | Design §2.1 `support`; N-03, N-04; B |
| WP15-A48 | SuperAdmin (SA1) | SA-06v (§3 V22-1) | Open the view with a reason. | 303 `/account` of `syn-ta-1` with the banner (A52); lead "Read-only view of [name]'s account, as they see it."; no sign-out of the viewed account; no receipt page. | L | Design §2.8, §2.9 |
| WP15-A49 | SuperAdmin (SA1); harness; test | SA-06v eligibility (§3 V22-11a); test | Live: SA-06v of the suspended TAx: read the warning; open the view; read TAx's `/account` and an application address; exit. Test: SA-06v of SA2, of the reader, of a pending and a declined account; harness start for SA2. | The form stays with the N-03 warning; the start is accepted; every viewed page answers the uniform 404 with the banner; "Exit support view" works. SA2 or the reader: no form, "Only travel agent and operator accounts can be viewed, and not your own."; a raw start: that sentence, nothing recorded. | L+T | N-03 (R-03); `WP-15.md` §3 PM Q-01 |
| WP15-A50 | SuperAdmin (SA1, tab 2); test | SA-06v refusals (§3 V22-5) | Tab 2 (SA-06v of OP1, loaded in V22-1) sends after the view started. Tests: empty reason; clock; audit. | Tab 2: the 409 page "A read-only view is open in this browser session. Nothing you sent from this page was recorded. Exit the view with “Exit support view” in its banner, then open SuperAdmin pages again." with the banner; no second view. Tests: reason sentence; clock sentence of A35; audit: no form. | L+T | AM-W15-01; design §2.13 |
| WP15-A51 | SuperAdmin (SA1); harness | Nth time on SA-06v (§3 V22-5) | Replay the start (same key) from SA1's session. | The 409 page (the session is in a view) or the original landing; never a second view (audit: one start). Back to SA-06v shows the 409 page. | L+T | Design §4.1 |

### 2.11 Inside a read-only view (SH-R09; V22)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A52 | SuperAdmin (SA1); screen-reader user | Every page in the views of `syn-ta-1`, OPe, OPg and TAx; their SH-02 and 404 pages (§3 V21-0c, V22-1 to V22-11b) | Read the banner. | The AM-W15-01 banner in the header after the environment label, as text, not dismissible, with "Exit support view"; on the error pages of the view too, so the exit is always reachable. | L | SH-R09; design §2.8 |
| WP15-A53 | SuperAdmin (SA1); `syn-ta-1` (harness on edge) | View of `syn-ta-1` (§3 V22-2, V22-2a) | Both read `/ta/groups`, `/ta/applications`, one application, its delivery page, `/ta/notices`, `/ta/payments`; SA1 opens a `syn-ta-2` application address. | The sets of group ids and application ids are equal on both origins; the `syn-ta-2` address: uniform 404 with the banner and no facts. | L | Design §6.4 V22-2 |
| WP15-A54 | SuperAdmin (SA1) | Views of OPg (§3 V22-7) and OPe (V21-0c) | Read `/ops/applications` and one G1 application (OPg); OPe's pages. | OPg: the "Read-only access: [purpose], until [time] IST" line and G1's applications; the application page has no form. OPe: OPe's operator pages; the Accounts comparison is A150. | L (U7) | UX §2.3; AM-W15-05 |
| WP15-A55 | SuperAdmin (SA1); test | Every page in a view; test: every `sv` route | Look for controls; open `/ta/account/email` (staff). | No form other than exit and sign-out; no download or selection control (N-02); no acknowledge; no "Change your email address"; `/ta/account/email` on staff → 404. Test: design §7.2 (d). | L+T | Design §7.2 (d); F-38, E-24 |
| WP15-A56 | Harness (in the view) | Hand-made POSTs (§3 V22-3) | POST a travel-agent route (group create) and a download. | Both 404 before Core; no bytes; nothing recorded. | L | Design §6.4 V22-3 |
| WP15-A57 | SuperAdmin (SA1); test | `/admin/accounts` in a view (§3 V22-5); test V22-4 | Open it. | The 409 page with the banner; test: every admin route 409; other POSTs 404; SuperAdmin operation count unchanged. | L+T | Design §6.4 V22-4, V22-5 |
| WP15-A58 | SuperAdmin (SA1) | Exit (§3 V21-0c, V22-6, V22-9a, V22-11b) | Exit; reload an old viewed address; Back twice. | 303 to SA-06c of the viewed account with "Read-only view ended"; the old address → uniform 404 without facts; Back shows nothing of the viewed pages (WP01-A131). | L | Design §2.8; §2.14 |
| WP15-A59 | SuperAdmin (SA1, SA2); test | Access changes in a view (§3 V22-8, V22-11, V22-11b); tests V22-12 | (1) SA2 revokes OPg's grant; SA1 reloads G1's application and `/ops/applications`. (2) SA2 suspends TAx during SA1's view; SA1 reloads. (3) SA2 restores TAx before SA1 exits; SA1 reloads. Tests: the end time; SA1 suspended; restoration before exit. | (1) Uniform 404 with the banner; G1 gone. (2) Uniform 404 with the banner; **no text says the view ended** ("reads denied while the account is not active"). (3) TAx's pages read again in the same view (N-04). End time: the next request is SA1's own session; viewed paths 404 **without** the banner; **no message states an end time** (N-04). SA1 suspended: the view ends `superadmin_suspended`. | L (1) U7, (2), (3) + T | N-04 (R-04); design §4.3 |
| WP15-A60 | SuperAdmin (SA1); test (V22-13) | SA-08a and SA-08s (WP-14) after V22-6 | Find the view's start and end. | Start and end facts name the SuperAdmin as actor with the reason and the end reason in words; no fact names the viewed account as actor; no fact per page view. Where SA-08a cannot filter it, by test. | L+T | Design §6.4 V22-13; BS B33 |
| WP15-A150 (new) | SuperAdmin (SA1); OPe; harness | OPe holding the accounting grant: OPe's own session and SA1's view of OPe (§3 V21-0c) | OPe opens `/accounts` and reads its rail. SA1 opens the view of OPe and opens `/accounts` and the rail. | OPe: the Accounts boundary page. The view: no Accounts area (uniform 404 with the banner). The run record states the difference; **V22 scope completeness: Partly met** (STOP-W15-03; Core defect in the batch, PLAN S-15). SA-06t and SA-06c state it before the grant (A43). | L (U7) | N-01 (R-01) |

### 2.12 Revoked access: old links, bytes and background results (V22)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A61 | OPg | OPg's tab of a G1 application opened in V22-0b (§3 V22-9) | Reload; follow links; open OP-01a. | Uniform 404 / SH-02 without facts; OP-01a no longer lists G1 and shows no "0" for it (LD-14). | L (U7) | BS B10; SH-R04 |
| WP15-A62 | OPg (browser) | The download control on the old page (§3 V22-9) and a new download | Press the control still on the page from V22-0b; reload and look for it. | The release is checked again and refused: no bytes, the access answer; after reload no control; no new successful retrieval (a denied check MAY be recorded with its reason). | L (U7) | K-BYTE; BS B12; N-02 |
| WP15-A63 | Test (V22-10) | Background results | (1) A poll region of a granted page answers 404. (2) An old receipt address of the grantee. (3) Back/forward cache after revocation. | (1) Conceal and reload (WP-01 A-01). (2) `readReceipt` reaches the shell. (3) The page reloads before anything shows. | T | SH-R05; WP-01 A-01, A-02 |
| WP15-A64 | Test | A grant at its end before the cleanup task; clock unhealthy | Read as the grantee; read SA-06g and SA-06h. | Reads deny from the end; "Active in the record, but its time passed …"; clock: every grant read denies. | T | Design §1.2 |

### 2.13 TA-12a and TA-12e (two-proof email change)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A65 | Travel agent (TAx) | TA-12a `/account` (§3 V21-14, before and during) | Read. | WP-01 parts. "Sign-in address": "Current address: [address]"; with an open change the callout "Your sign-in and document email remain [current address] until both addresses are verified." with "Continue the change"; read unavailable "Whether an address change is open cannot be read now."; link "Change your email address"; CMP-10 "Changing your address without access to your current mailbox is unavailable until the product owner approves a recovery rule. Owner: product owner."; "TravelMudra staff cannot change your address." In a view: the fact and the boundary only; the change read is never made. | L (U7) | Design §2.9 |
| WP15-A66 | Travel agent (TAx) | TA-12e state a (§3 V21-14) | Read. | `h1` "Change your email address"; lead of design §2.10; steps; "New email address" with the hint "We first send a code to your current address. Only after you enter it do we send a code to the new address."; button "Send a code to my current address"; "What happens next" without "30 minutes". | L (U7) | Design §2.10 |
| WP15-A67 | Travel agent (TAx) | TA-12e (§3 V21-14, V21-14d) | Start the change. | Receipt "Address change started"; state c: "We are sending an 8-digit code to your current address, [current]. Mail: [words]."; status facts "New address", "Ends [time] IST"; the pending line; the cancel form "Cancel the address change". | L (U7) | Design §2.10, §2.14 |
| WP15-A68 | Travel agent (TAx); test | Start refusals (§3 V21-14d); tests | Live: the current address; "abc". Tests: an open change visible (other session); a change past its end, not visible; rate limit; stale; 321 characters. | "The new address is the same as your current address."; "Enter an email address in the form name@example.com."; value kept; nothing recorded. Visible open change: "An address change is already open. Finish or cancel it first." Not visible (N-08): waiting guidance only ("An earlier address change has ended and is being closed. Try again in a few minutes."), no finish or cancel, no time. Rate: "Too many address changes were started in a short time. Try again later."; stale: "Your account changed after you opened this page." with the address kept; 321: "Enter an address of up to 320 characters." (local, no command). | L (U7) + T | Design §2.13; N-08 |
| WP15-A69 | Travel agent (TAx); harness | State c → d (§3 V21-14) | U7 types the current-address code. | Receipt "Current address confirmed"; state d with "We are sending an 8-digit code to your new address, [new]. Mail: [words]." and the review "When you confirm: your sign-in and document address become [new]. Every session of your account ends, this one too. You sign in again with [new]."; the code field empty. | L (U7) | Design §2.10 |
| WP15-A70 | Travel agent (TAx); test | Wrong and dead codes (§3 V21-14a); tests | One wrong code. Tests: attempts ended; a dead code; spaces and hyphens; 7 digits; 33 characters. | "This code did not work. Enter the newest code we sent to [address of this step]. If no code works, cancel the change and start again." at the code (status 422), field empty, no receipt. Attempts ended: "The address change ended after too many wrong codes. Your address did not change. Start again if you still want to change it." 33 characters: "Enter the 8-digit code." (local). | L (U7) + T | Design §2.10, §2.16 |
| WP15-A71 | Travel agent (TAx), two browsers; harness; SuperAdmin (SA1) | Completion (§3 V21-14c, V21-15) | U7 types the new-address code; browser 2 opens a page; a sign-in code is requested for the old address; TAx signs in with the new address; SA1 reads SA-06c. | Browser 1 → "Sign in with your new email address."; browser 2 → "Your session ended. Sign in again to continue."; old address: neutral answer, no code; TA-12a shows the new address; SA-06c shows it and A04's row. | L (U7) | BS B09; WP01-A56 |
| WP15-A72 | Test | New address held by another account | Prove both mailboxes. | "The new address cannot be used. The change ended and your address did not change. Start again with another address." Nothing said before the new proof. | T | Design §2.10 |
| WP15-A73 | Test | Expiry and the cleanup window | (1) A code sent at or after the end. (2) TA-12e after the end. (3) A start in the cleanup window. | (1) "The address change ended: it expired before both codes were confirmed. Your address did not change. Start again if you still want to change it." (no time: the result carries none; N-08). (2) State a. (3) The N-08 waiting guidance of A68; the Core gap: "Unmet: waits for STOP-W15-01". | T | N-08; STOP-W15-01 |
| WP15-A74 | Travel agent (TAx), two browsers; test | Cancel (§3 V21-14d, V21-14e) | Browser 1 starts a second change; browser 2 cancels it. Test: cancel an ended change. | Receipt "Address change cancelled" with "Your address did not change."; the review "Cancelling keeps [current] as your address."; ended: "This address change already ended: it finished, was cancelled or ended by its time." | L (U7) + T | Design §2.10, §2.13 |
| WP15-A75 | Travel agent (TAx), two browsers; harness | Other session (§3 V21-14e) | Browser 2 reads TA-12e; the harness sends a code from browser 2 (raw). | State b: "This address change was started in another browser, or before you signed in again. Finish it there. You can also cancel it here and start again." No confirm form. The raw send: the shell; attempts unchanged. | L (U7) | Design §2.10 state b |
| WP15-A76 | Travel agent (TAx); harness; test | Nth time on TA-12e (§3 V21-14b) | Back after the current proof; the step-c form again with a new key; replay of the step-c send; test: lost answer; replay after completion. | State d; CMP-14 (Step: you saw "Code from your current address" / now "Code from your new address"; no code kept); the replay returns the same answer, no second code; lost answer → `/ta/operations/<key>`; after completion → sign-in. | L (U7) + T | Design §2.15, §4.1 |
| WP15-A77 | Test (`bff-email-change.test.ts`) | The three edge handlers | Over-limit and malformed values. | Every field is read whole (no slice); over its limit it is refused locally at its field (`newEmail` 320, `code` 32) with safe values kept and the code never kept; a malformed `emailChangeId` or `proof`: "This form no longer fits the page. Open the page again."; **no command is sent** for any of these (N-10). | T | Design §2.16; N-10 |
| WP15-A78 | SuperAdmin (SA1); harness | No staff address change (§3 V21-12) | Read SA-06c of TAx; collect every form on SA-06a/b/c/d, SA-06e/g/h/n/x, SA-06q/k/t/v, SA-09s; POST `/admin/accounts/<TAx>/email`; GET and POST `/ta/account/email` on staff. | The only form with an `email` field is SA-06b's create form; the POST 404 (no route); staff `/ta/account/email` 404; TAx unchanged. | L | Design §6.3 V21-12; §7.2 (c) |

### 2.14 OP-10 and SA-10 Notices and account (CC-03)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A79 | Operator (OP1) | OP-10n `/ops/notices` (§3 N-1) | Open "Notices and account" › "Notices"; view `needs_ack`; Back; clear. | `h1` "Notices"; lead "Notices from TravelMudra about your work. Opening a notice changes nothing. A notice that needs a decision from you asks for your acknowledgement."; "Read at"; "Needs your acknowledgement: [n] notices"; rows with the staff words, "Application [reference]" (linked when the reader can read it), posted time, acknowledgement words; no read marker. At 200 rows (N-06): "This list shows the newest 200 notices. Older notices may exist." and the count reads "… among the newest 200 notices". | L | Design §2.11; N-06; E-10 |
| WP15-A80 | Operator (OP1); harness | OP-10i of an existing notice (§3 N-1) | Open; harness posts the acknowledgement. | Breadcrumb "Notices"; `h1` the notice text (for an assignment "An application was assigned to you"); Posted; Application link; no delivery link (only result and disclosure notices have one); acknowledgement "No acknowledgement needed"; no form. The post: WP-08's `ack_not_required` sentence; nothing recorded. | L | Design §2.11, §2.12.4 |
| WP15-A81 | Test; gallery | OP-10i and SA-10i of a deletion-request notice to a staff recipient | Read; acknowledge; replay; two tabs; another account. | WP-08's `disclosureBody`; review (N-05) "Acknowledging records that you read this notice. It does not record that you deleted anything and changes nothing else."; button "Acknowledge" (never "I deleted it"); receipt "Notice acknowledged"; second tab `already_acknowledged` sentence; stale CMP-14 (Acknowledgement); another account: 404. Live part "Deferred" (§6 Q-04). | T + gallery | N-05 (R-05); CC-03 |
| WP15-A82 | SuperAdmin (SA1) | SA-10n, SA-10i (§3 N-3) | Open Notices from the top bar. | As A79 and A80 with SuperAdmin notices (`financial_follow_up`: "A payment follow-up needs your attention"; `deferral_review_due`); S2 "No notices yet. Notices about your work appear here." | L | Design §2.11 |
| WP15-A83 | OP1; SA1; OPe | OP-10a, SA-10a (§3 N-2, N-3, V21-0a) | Read `/account`. | WP-01 parts (WP01-A70, A71); staff address: the known-limitation notice only, without "Ask a SuperAdmin if your work address changes." (F-W15-08); SA1 no accounting section; OPe with the grant: A44. | L | Design §2.9 |
| WP15-A84 | Operator (OP2); test | OP1's notice address (§3 N-4); test: a `reassigned_away` notice | OP2 opens it. Test: render the notice; separately open the old application URL as its former operator. | OP2: 404 without facts. Test (N-07): the notice text "Application [reference] was reassigned to another operator. You no longer work on it, so it does not open for you." with the reference **unlinked**; the old application URL, opened separately, answers SH-02 without earlier facts (LD-14). | L+T | N-07 (R-07); E-23 |
| WP15-A85 | Test (`staff-notices.test.ts`) | Every staff kind and event | Render. | Design §2.12.4 words for `assigned`, `reassigned_away`, `assistance_approved`, `gate_exception_granted`, `superadmin_correction`, `problem_reported`, `handed_back`, `flag_responded`, `problem_resolved`, `deferral_ended`, `withdrawn`, `submitted`, `transition_pending`, `packet_available`, `deferral_review_due`, `financial_follow_up`, `disclosure_correction`; unknown: "A notice about your work"; link rules of the table. | T | Design §2.12.4 |
| WP15-A86 | Test | OP-10n and SA-10n states | Read failure; access refusal between reads; 200 notices; `needs_ack` with none. | S7, never "0"; the shell; the cap line and qualified count (N-06); "No notice among the newest 200 needs your acknowledgement." at the cap, else "No notice needs your acknowledgement." with "Show all notices". | T | N-06; WP08-A96 |
| WP15-A87 | OP1; SA1 | Rail and top bar | Read the current item. | Operator: "Notices and account" with members "Notices" and "Your account"; SuperAdmin: top-bar Notices and the account menu; the counts keep `noticesToAcknowledge`. | L | Design §1.4 |

### 2.15 Pages of other packages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A88 | SuperAdmin (SA2); test | SA-04g of G1 (I-15); SA-06a; SA-06c; SA-01 group 7 | Follow the links. | "Give an operator read access to this group" → SA-06n `?group=`; the others → SA-06e, the task pages, SA-06h, SA-06n `?grantee=`; Back returns. | L+T | I-15; AM-W15-02 |
| WP15-A89 | Operator (OPg, own session) | OP-01a; OP-02 of a G1 application; its result and delivery pages (§3 V22-0b) | Read; press one download control. | WP07-A08, A35 hold (read-only line; no action); **the download control for each file Core permits** (F-38, E-24) is visible; pressing it downloads the file **in the browser** (the run record holds the browser's download event and file size, not the file). No other control. | L (U7) | N-02 (R-02); F-38; E-24 |
| WP15-A90 | SuperAdmin; test | SA-06e, SA-06g; WP-02 pages | Look for forms; run the host-page test. | No form on SA-06e or SA-06g; each form on its host page of §1.2. | L+T | CC-20 |

### 2.16 Command results, access and shell

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A91 | All | Every WP-15 page | Read the shell. | Environment label; "[TEST]"; rail current item and breadcrumbs of design §1.4; one `h1`; "Read at". | L | Design §1.4 |
| WP15-A92 | SuperAdmin (SA1, SA2); test | Receipt addresses and the operation status page (§3 V22-9a) | SA2 opens SA1's receipt addresses. Test: edited addresses (a reset key at `elevation_requested`; a group-read key at `accounting_granted`); a key with no record on a receipt address and on `/<surface>/operations/<key>`. | Titles only under §0.2's conditions; edited: the unchecked receipt; SA2: the unchecked receipt with current authorized facts. A key with no record: the **receipt address** shows the unchecked receipt; **only the status page** reads "Nothing is recorded for request [reference] so far" (N-10). | L+T | N-10; §0.2 |
| WP15-A93 | SuperAdmin; test | Receipt addresses of V21-1, V21-0a and V22-0 opened after V21-4, V21-0d and V22-8 (§3 V22-9a) | Open. | Recorded facts kept; later facts "Current" ("This request is no longer open."; "Revoked on …"); no instruction. | L+T | WP-07 F-33 |
| WP15-A94 | Test | Lost answer per command; the view start (N-09) | Inject the fault. | Every command except the view start: 303 to `/<surface>/operations/<key>`, "Checking the original result", "Check status", no new send. View start (N-09): committed with a lost answer — the next page shows the banner, which confirms the view (the status page is not reachable in a view: 409); after exit, `/admin/operations/<key>` shows the original start; not committed — no banner, the status page reads "Nothing is recorded …"; in both cases no second view is started and none is offered as a retry. | T | N-09 (R-09); BS B35 |
| WP15-A95 | Test | Replay matrix | As the first version. | (3) Request `elevation_open`; approve, decline `stale_revision`; reset a second reset; grants `grant_exists`; revoke `stale_revision`; view start: the BFF 409; address start `email_change_open`; confirm, cancel `stale_revision`; acknowledge `already_acknowledged`. (4) CMP-14 for the revisioned forms (design §2.15). (5a), (5b) as the terms. | T | BS B35 |
| WP15-A96 | Harness | The Nth time on the live steps | Replay terms on V21-1, V21-4, V21-0d, V21-14, V22-0. | One record per intent (deltas). | L | BS B35 |
| WP15-A97 | Test (`identity-words.test.ts`) | Word and sentence maps | Unit test against Core's vocabulary. | Every value of `ELEVATION_KINDS`, `ELEVATION_STATES`, `GRANT_KINDS`, `GRANT_STATES`, `GRANT_END_REASONS` and every code of design §2.13 (`elevation_open` included; two `grantee_not_operator` sentences) has words; unknown → code with "Reference code"; no word contains "Override", "Impersonate", "Sign in as". | T | Design §2.12, §2.13, U0 |
| WP15-A98 | All | Every refusal reachable in §3 | Read. | Design §2.13 sentences at the field or form level; "Nothing was …" only after a refusal; never a code alone. | L | Design §2.13 |
| WP15-A99 | All | Every WP-15 page | Look for forbidden controls. | No staff address field for an existing account; no credential, code or key; no "Sign in as"; a read grant adds no case action (only the permitted download, F-38); boundaries named with owner. | L | Design §2.0; BS B08 to B11, B44 |
| WP15-A100 | All | Every WP-15 page | Read text. | §0.2 forbidden words absent; no "72 hours" or "30 minutes"; IST everywhere. | L | Design §2.0 "Copy" |
| WP15-A101 | All; test | Task pages; TA-12e | Storage, headers, re-renders. | No reason, purpose, address, code or key in browser storage; `no-store`; no code ever rendered back. | L+T | SH-R12; WP-01 A-12 |
| WP15-A102 | `syn-ta-2`; OP2; OPg | Isolation (§3 X-1) | Foreign reads and posts. | 404 or SH-02; nothing recorded. | L | BS B10 |
| WP15-A103 | Test (`bff-account-access.test.ts`, `bff-elevations.test.ts`, `bff-grants.test.ts`) | Every WP-15 staff handler | Over-limit, malformed and largest valid input. | Every field is read whole; over its limit it is refused locally at its field with every value kept and **no command sent** (N-10; design §2.16: 1,001-character reason, 501-character purpose, malformed `accountId` → 404, malformed `granteeAccountId`, `groupId`, `validUntil`); within limits it reaches Core whole; the largest valid form passes a real HTTP check. | T | LD-17; N-10 |
| WP15-A104 | Test | Optional reads (SA-09s target, requester, duties; SA-06n group; TA-12a change read; receipts) | Availability failure; access refusal. | Availability: the block's "… cannot be read now." (SA-06n: no form); access: the shell (LD-14); TA-12a in a view never reads the change. | T | LD-14; design §2.0 |
| WP15-A105 | Test (`identity-host-pages.test.ts`); SuperAdmin | Host pages (§3 V21-12) | Run the test; collect form actions. | Design §7.2 (a), (b), (c) with B: each POST path only on its host page of §1.2; every form action registered. | L+T | Design §7.2; CC-20 |
| WP15-A151 (new) | Test (`signin-harness-rules.test.ts`) | The U7 harness extension | Run the guard tests. | `enrol` and `enterMailedCode` refuse a seeded account and an account not in the run-owned registry; no returned value, log line or error carries a code or key; a secret-bearing step produces no persisted screenshot, trace or video. A first check of §0.4. | T | N-11 (R-11); Q-W15-06 |

### 2.17 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A106 | Keyboard-only users | V21-1, V21-4, V22-0, V22-1, V21-14 at 1440 px; V21-14 and V22-1 at 390 px | Keyboard only. | Every task page, decision page, the grant steps, the view start and exit, the address steps and cancel work with Tab, Shift+Tab, Enter, Space, Escape. | L | AC-01, AC-12 |
| WP15-A107 | Keyboard-only user | Every WP-15 page, 1440, 390, 400% | Tab through. | Focus visible, never hidden by the banner. | L | AC-02 |
| WP15-A108 | Phone user | SA-06e, SA-06g, SA-06h, SA-09s, SA-06v, TA-12a, TA-12e, OP-10n, the banner | 320 px; 400%. | One column; tables stack; scope and effect before the fields; no fixed action bar; the banner wraps with its exit reachable. | L | AC-04, AC-21 |
| WP15-A109 | Any | Every form | Inspect. | Labels, hints, required stated; the operator select labelled; the date labelled with its rule. | L | AC-05, AC-15 |
| WP15-A110 | Any | States | Greyscale. | Text for every state. | L | AC-06 |
| WP15-A111 | Any | Every form | Send with an error. | Focus to the summary; values kept; codes empty. | L | AC-08 |
| WP15-A112 | Screen-reader user | Receipts; banner; code steps | Read. | Receipts polite; banner in order; code field `one-time-code`, numeric, paste allowed. | L | AC-09; UX §7.5 |
| WP15-A113 | Screen-reader user | Unavailable actions (A01, A08, A13, A17, A27, A32, A47 warning) | Focus. | The reason exposed. | L | AC-13 |
| WP15-A114 | Phone user | Every page at 390 px | Measure. | Targets 24 px; primary actions and "Exit support view" 44 px; links name the person (WCAG 2.4.6). | L+T | AC-10; design §5 |
| WP15-A115 | — | Every page | Contrast. | 4.5:1 text; 3:1 non-text and focus; the banner. | L+T | AC-11 |
| WP15-A116 | Any | Long names, reasons, addresses | 400-character name; 1,000-character reason; 254-character address. | Wraps; no horizontal page scroll. | L | AC-14, AC-20 |
| WP15-A117 | SA1, SA2, TAx (observation) | After V21-4, V22-6, V21-14c | Ask "Could SA1 have approved this alone?", "During the view, could you change anything for syn-ta-1?", "Until when do documents go to your old address?". | Answers and sample size recorded; a wrong answer is a finding. | L | AC-24, AC-26 |

### 2.18 axe checks (WCAG 2.2 A/AA)

Rule for every row: axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) at
1440 × 900 and 390 × 844. Expected: no "serious" or "critical" violation at either width; minor and moderate counts
recorded. Gallery rows run on the design's gallery state.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP15-A118 | SuperAdmin | SA-06c of OPe, "Access and support" (V21-0a) | L | UX §7.5 |
| WP15-A119 | SuperAdmin | SA-06t of OPe (V21-0a) | L | same |
| WP15-A120 | SuperAdmin | SA-06h of OPe's accounting grant with its receipt (V21-0a) | L | same |
| WP15-A121 | SuperAdmin | SA-06x of OPe's accounting grant (V21-0d) | L | same |
| WP15-A122 | SuperAdmin | SA-06k of OPe with the C1 error (V21-0e) | L | same |
| WP15-A123 | SuperAdmin | SA-06c of OPe after the reset (V21-0e) | L | same |
| WP15-A124 | SuperAdmin | SA-06c of TAx with the parked reset callout (V21-0f) | L | same |
| WP15-A125 | SuperAdmin | SA-06c and SA-06q of OP1, withheld (V21-0g) | L | same |
| WP15-A126 | SuperAdmin | SA-06q of OPe with the C1 error (V21-1) | L | same |
| WP15-A127 | SuperAdmin | SA-06e with the open request (V21-2) | L | same |
| WP15-A128 | SuperAdmin | SA-09s `approve`, state 4 (V21-2) | L | same |
| WP15-A129 | SuperAdmin | SA-09s `approve` draft (V21-4) | L | same |
| WP15-A130 | SuperAdmin | SA-09s with CMP-14 (V21-6) | L | same |
| WP15-A131 | SuperAdmin | SA-09s `decline` as the requester (V21-8a) | L | same |
| WP15-A132 | Travel agent | TA-12a with the pending line (V21-14) | L | same |
| WP15-A133 | Travel agent | TA-12e state a with the error summary (V21-14d) | L | same |
| WP15-A134 | Travel agent | TA-12e state d with the code error (V21-14a) | L | same |
| WP15-A135 | Travel agent | Sign-in page "Sign in with your new email address." (V21-14c) | L | same |
| WP15-A136 | Travel agent | TA-12e state b (V21-14e) | L | same |
| WP15-A137 | SuperAdmin | SA-06v of `syn-ta-1` (V22-1) | L | same |
| WP15-A138 | SuperAdmin | A `syn-ta-1` application page in the view, with the banner (V22-2) | L | same |
| WP15-A139 | SuperAdmin | The 409 page (V22-5) | L | same |
| WP15-A140 | SuperAdmin | SA-06n step 2 with the C1 error (V22-0) | L | same |
| WP15-A141 | SuperAdmin | SA-06g with OPg's grant (V22-0) | L | same |
| WP15-A142 | SuperAdmin | SA-06x of OPg's grant (V22-8) | L | same |
| WP15-A143 | Operator; SuperAdmin | OPg's 404 after the revocation; the view's 404 with the banner (V22-9, V22-11) | L | same |
| WP15-A144 | Operator | OP-10n (N-1) | L | same |
| WP15-A145 | Operator | OP-10i with the `ack_not_required` refusal (N-1) | L | same |
| WP15-A146 | SuperAdmin | SA-10n (N-3) | L | same |
| WP15-A147 | All | Gallery: SA-09s states 3, 5 to 8; SA-06n at the limit and with the clock refusal; SA-06h ended; OP-10i with a receipt; TA-12e ended results | L (gallery) | same |
| WP15-A148 | SuperAdmin; travel agent | Operation status page of a WP-15 command | L | same |
| WP15-A152 (new) | SuperAdmin | SA-06h of OPg's grant with "Read access given" (V22-0) | L | same |
| WP15-A153 (new) | SuperAdmin | SA-06n step 1 with the field error (V22-0) | L | same |
| WP15-A154 (new) | SuperAdmin | The view of OPe: `/accounts` 404 with the banner (V21-0c) | L | same |

## 3. Proof scenarios V21 and V22

V21 (UX §12): "One SA can suspend in emergency/lower exposure; distinct second SA is required for ordinary SA
elevation/ceiling increase. TA email has no admin override." V22: "Support view matches selected user's current read
scope and offers no impersonation/action; revoked old links/background results deny metadata/bytes." One ordered
recipe: the design's §6 with lettered additions on the same accounts. "L (U7)" steps need the harness extension.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1, SA2, OP1, `syn-ta-1` | Read the baselines of §0.4. | Recorded. | — | L |
| Setup 0 | SA1 (SA-06b, SA-06c); U7 | Create, approve, activate OPe, OPg, TAx; enrol OPe and OPg; sign TAx in. | Accounts active. | — | L (U7) |
| V21-0a | SA1: SA-06c of OPe, SA-06t; OPe | Read; give the accounting grant. OPe reads `/account`, `/accounts`. | Links of A01; "Accounting grant given" on SA-06h; the B29 boundary; the Accounts page. | A01, A03, A43, A44, A83, A149, A118 to A120 | L (U7) |
| V21-0b | Harness | A new key for the accounting grant. | `grant_exists`. | A45 | L (U7) |
| V21-0c | SA1: SA-06v of OPe; OPe | Open the view; read OPe's pages and `/accounts`; exit. OPe opens `/accounts`. | The view: no Accounts area (404 with the banner); OPe: the boundary page; **Partly met** recorded. | A47, A52, A54, A58, A150, A154 | L (U7) |
| V21-0d | SA1: SA-06h → SA-06x; harness; OPe | Revoke; replay terms 1 to 3. OPe reloads. | "Grant revoked"; one revocation; no accounting section; `/accounts` SH-02. | A39, A40, A42, A46, A149, A121 | L (U7) |
| V21-0e | SA1: SA-06k of OPe (empty first); OPe; U7 | C1; reset; replay; OPe reloads; U7 enrols OPe again. | C1; "Second factor reset"; OPe → sign-in; enrolled. | A25, A26, A28 (1), A29, A04, A122, A123 | L (U7) |
| V21-0f | SA1: SA-06c of TAx and own; harness | Look for reset; post resets. | No link; the parked and self sentences; nothing recorded. | A01, A27, A124 | L |
| V21-0g | SA1: SA-06c, SA-06q of OP1; harness | Read; post the request. | Withheld; `elevation_target_has_duties`; delta 0. | A01, A08, A125 | L |
| V21-1 | SA1: SA-06q of OPe (empty first) | C1; request with a reason. | C1; "Elevation requested" on SA-06c; the open request. | A06, A07, A09 (1), A02, A126 | L (U7) |
| V21-1a | Harness; SA1, SA2 | Replay terms 1 to 4; read SA-06e, SA-01, SA-06a. | One request; counts +1. | A10, A14, A96 | L (U7) |
| V21-2 | SA1: SA-06e; SA-09s `approve` | Read. | "Withdraw your request"; state 4, no form. | A12, A17, A127, A128 | L (U7) |
| V21-2a | Harness (SA1) | Post the approval. | `second_superadmin_required`; nothing recorded. | A17 | L (U7) |
| V21-2b | OPe (operator); harness | Open SA-06e, SA-09s; post the approval. | 404 before Core; nothing recorded. | A18 | L (U7) |
| V21-3 | Test | SA1 approves its own request with a valid key. | `second_superadmin_required`. | A17 | T |
| V21-4 | SA2: SA-09s `approve` (tab 1), `decline` (tab 2, kept) | Read; approve with a reason. | "Request approved"; OPe SuperAdmin; counts back to P-0. | A15, A16, A12, A14, A129 | L (U7) |
| V21-5 | OPe | Reload; sign in again. | Sign-in; the SuperAdmin home. | A16 | L (U7) |
| V21-6 | SA2; harness | Same `_op`; new `_op` with the old revision; send tab 2. | Same receipt; CMP-14 twice; one decision. | A21, A23, A130 | L (U7) |
| V21-7 | SA1: SA-06c of OPe | Suspend alone (WP-02). | Accepted with one SuperAdmin; OPe → sign-in. | (WP02-A94, A102) | L (U7) |
| V21-8 | SA1 (restore); SA2: SA-09s `decline` | Request restoration; SA1 sees "Withdraw your request" only; SA2 declines. | "Request declined"; OPe suspended. | A19, A24 | L (U7) |
| V21-8a | SA1 (restore); SA1: SA-09s `decline` | Request restoration again; withdraw. | "Request withdrawn". | A20, A131 | L (U7) |
| V21-9 | SA1: SA-06b, SA-06c; SA2: SA-09s `decline` | Create `wp15-sa`; read; SA2 declines. | No approve control for SA1; the decline effect; account Declined. | A19, A24, A12 | L |
| V21-10 | Test (audit behind) | Request, approve, decline, suspend, revoke, give. | A11, A21, A28, A32, A35, A41, A45, A50. | A11, A21, A28, A32, A35, A41, A45, A50 | T |
| V21-11 | SA1, SA2 on WP-07 pages | Re-run of WP-07 V09-3, V09-4, V09-9 (its own recipe). | Lowering by one SuperAdmin; increase by a second. | (WP07-A83 to A89) | L |
| V21-12 | SA1; harness | Collect forms (SA-06e and SA-06g hold none); the address POSTs. | A78, A90, A105. | A78, A90, A105, A99 | L |
| V21-13 | Test | A SuperAdmin session sends reset and start-email-change for TAx. | Refused; TAx unchanged. | A27, A78 | T |
| V21-14 | TAx: TA-12a, TA-12e (browsers 1 and 2 signed in); U7 | Read; start; enter the current-address code. | Receipts "Address change started", "Current address confirmed"; the pending line. | A65, A66, A67, A69, A132 | L (U7) |
| V21-14a | TAx | One wrong code at state d. | The code sentence; no receipt. | A70, A134 | L (U7) |
| V21-14b | TAx; harness | Back; the state-c form with a new key; replay. | State d; CMP-14; same answer. | A76 | L (U7) |
| V21-14c | TAx (browsers 1, 2); U7 | Enter the new-address code; browser 2 loads a page; code request for the old address; sign in with the new address. | Sign-in notices; neutral answer; TA-12a shows the new address. | A71, A135 | L (U7) |
| V21-14d | TAx (browser 1) | The current address; "abc"; start a change to `-c`. | The two sentences; "Address change started". | A68, A67, A133 | L (U7) |
| V21-14e | TAx (browser 2, signed in with the new address); harness | Read TA-12e; raw send; cancel. | State b; the shell; "Address change cancelled". | A74, A75, A136 | L (U7) |
| V21-15 | SA1: SA-06c of TAx | Read. | The new address; the history row. | A04, A71 | L (U7) |
| V22-0 | SA2: SA-04g of G1 → SA-06n (step 1 "abc" first; step 2 empty first) → SA-06h | Field error; C1; give OPg read access. | The group shown first; "Read access given"; SA-06g row. | A33, A34, A35 (1), A30, A88, A149, A140, A141, A152, A153 | L (U7) |
| V22-0a | Harness | Raw dates and forged `groupId`; a new key; replay. | Field refusals; `grant_exists`; one grant. | A35 (2), A36, A38 | L (U7) |
| V22-0b | OPg (own session, browser) | Read OP-01a, a G1 application, its result or delivery page; press one download control; keep the tab. | The control is visible; a browser download. | A89, A34 | L (U7) |
| V22-1 | SA1: SA-06v of `syn-ta-1` (tab 1); SA-06v of OP1 (tab 2, kept) | Read; open the view. | `/account` with the banner. | A47, A48, A52, A137 | L |
| V22-2 | SA1 (view); `syn-ta-1` (edge) | Compare the reads. | Equal id sets; no form, no download. | A53, A55, A138 | L |
| V22-2a | SA1 (view) | A `syn-ta-2` address; `/ta/account/email`. | 404 with the banner. | A53, A55 | L |
| V22-3 | Harness (view) | POST a TA route and a download. | 404; no bytes. | A56 | L |
| V22-4 | Test | Every staff route in a view. | 409 / 404; nothing ran. | A57, A55 | T |
| V22-5 | SA1, tab 2 | `/admin/accounts`; send tab 2; replay the start. | The 409 page; one view. | A50, A51, A57, A139 | L |
| V22-6 | SA1; SA-08a | Exit; old address; Back; read the audit. | "Read-only view ended"; 404; the facts. | A58, A60 | L |
| V22-7 | SA1: SA-06v of OPg | Open the view; read `/ops/applications` and a G1 application; keep the tab. | The read-only line and G1; no form, no download control. | A54, A55 | L (U7) |
| V22-8 | SA2: SA-06h → SA-06x (tab 1; tab 2 loaded before); SA1 (view) | Revoke; send tab 2; SA1 reloads. | "Grant revoked"; CMP-14; 404 with the banner; G1 gone. | A39, A40, A41, A59 (1), A142 | L (U7) |
| V22-9 | OPg (tab of V22-0b) | Reload; press the old download control; open OP-01a. | 404; refused, no bytes; G1 gone. | A61, A62, A143 | L (U7) |
| V22-9a | SA1 (exit the view of OPg); SA2 | Exit; open the receipt addresses of V21-1, V21-0a, V22-0 as SA1 and SA2. | Recorded and Current facts; the unchecked receipt for SA2. | A58, A92, A93 | L (U7) |
| V22-10 | Test | Background results. | A63. | A63, A64 | T |
| V22-11 | SA1: view of TAx; SA2: suspend TAx | SA1 opens the view; SA2 suspends; SA1 reloads; SA1 exits. | 404 with the banner; no "view ended" text; exit works. | A59 (2), A143 | L |
| V22-11a | SA1: SA-06c and SA-06v of the suspended TAx | Read the link and the warning; open the view; read `/account` and an application address. | The form with the N-03 warning; reads deny; banner and exit present. | A01, A47, A49 | L |
| V22-11b | SA2 (restore TAx); SA1 (view) | SA2 restores TAx; SA1 reloads; SA1 exits. | TAx's pages read again in the same view; exit works. | A59 (3), A58 | L |
| V22-12 | Test | End time; SA suspended; restoration before exit. | A59. | A59 | T |
| V22-13 | Test | Facts of a view. | A60. | A60 | T |
| N-1 | OP1: OP-10n, OP-10i; harness | Read; acknowledge by hand. | Words; no read marker; `ack_not_required`. | A79, A80, A87, A144, A145 | L |
| N-2 | OP1: OP-10a | Read. | A83. | A83 | L |
| N-3 | SA1: SA-10n, SA-10i, SA-10a | Read. | A82, A83. | A82, A83, A87, A146 | L |
| N-4 | OP2 | Open OP1's notice address. | 404. | A84 | L |
| N-T | Test; gallery | Acknowledgement-required notice; words; states; `reassigned_away`. | A81, A84, A85, A86. | A81, A84, A85, A86 | T + gallery |
| X-1 | `syn-ta-2`; OP2; OPg | Isolation reads and posts. | 404 / SH-02. | A102 | L |
| X-2 | Test | The test parts of: A01 to A05, A08 to A11, A13, A17, A18, A21 to A24, A27 to A29, A31, A32, A35 to A38, A41, A42, A45, A46, A49 to A51, A55, A57, A59, A60, A63, A64, A68, A70, A72 to A74, A76, A77, A81, A84 to A86, A88, A90, A92 to A95, A97, A101, A103 to A105, A114, A115, A149, A151. | As the items. | as listed | T |
| X-3 | axe | Every page and state above. | No serious or critical violation. | A118 to A146, A148, A152 to A154 | L |
| X-4 | axe (gallery) | A147. | As X-3. | A147 | L |
| X-5 | Keyboard, screen-reader, phone users; SA1, SA2, TAx | During V21-1, V21-4, V21-14, V22-0, V22-1: accessibility, shell, copy, role controls, storage and headers, the observation questions. | As the items. | A91, A98 to A101, A106 to A117 | L |

Proof split. V21 passes when P-0, Setup 0 and V21-0a to V21-15 (V21-3, V21-10, V21-13 as tests; V21-11 by WP-07's
items) pass at the integrated WP-15 commit. V22 passes when V22-0 to V22-11b pass on `lane-ui` and V22-4, V22-10,
V22-12, V22-13 pass as tests, with **"V22 scope completeness: Partly met"** recorded (A150, N-01). Part N and N-T
belong to the package pass (CC-03). Without U7, the "L (U7)" steps run as tests (Q-W15-06). Boundaries stated, not
crossed: first-admin and all-admin-loss recovery, lost-mailbox recovery, staff address change, travel agent eligibility
(B-01, B-02; BS B44). The run record names the ref, the run tag, the accounts, G1, each test, the identifiers (internal
record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V21: ceiling decrease by one SuperAdmin; increase by a second | WP-07 (WP07-A83 to A89); re-run in V21-11 |
| V21: emergency suspension, also while the audit record is behind | WP-02 (WP02-A94, A102); observed in V21-7 |
| V21: new or restored SuperAdmin needs a second SuperAdmin; no staff address control | WP-02 (WP02-A88, A98, A101); decisions on SA-09s here (A19, A24) |
| Sign-in, sign-out, enrolment, the account page's identity and sessions | WP-01 (WP01-A55, A56, A58, A67, A70 to A72, A131) |
| The grantee's read-only views and its download control | WP-07 (WP07-A08, A35; F-38); WP-08 (E-24); observed here (A89) |
| Incident pages in a view; no incident read under a grant | WP-14 (WP14-A89) |
| TA-10 and the travel agent's acknowledgement | WP-08 (WP08-A89 to A99) |
| Audit pages | WP-14; the view's rows only (A60) |
| SA-04g link | WP-11 (I-15); followed here (A88) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-15 page:

- A control that changes a travel agent's address from a staff page, a route or a view; a staff address change.
- A control that shows, chooses, resends or sets a code, a key or a password.
- "Sign in as", "Impersonate", "act as", any target-user action in a view, or a download control in a view.
- One SuperAdmin completing an elevation, a new SuperAdmin or a restoration; a first-admin, all-admin-loss or
  lost-mailbox bypass.
- A read grant that adds a case action (the permitted download is not an action), covers more than one group, or opens
  incidents, payments, notices or intake.
- An Accounts work area opened by the accounting grant; text that claims a view shows the Accounts area.
- A form outside its host page of §1.2; an unregistered form action.
- A success title for `expired`, `invalid` or `invalid_address`; "I deleted it" on an acknowledgement.
- A configured duration the page does not read; an end-time message after a view ended by its time; a read marker.
- Earlier facts after an access change; a truncated field; a command sent with over-limit input.
- A code, key, reason or address in storage, a URL, a title, diagnostics or a capture of a secret-bearing step.

Recorded as pending, not as failures:

- V22 scope completeness: "Partly met" (A150; STOP-W15-03; PLAN S-15).
- A04, A24: the decider of an older request: "Partly met" (STOP-W15-02; N-12).
- A73 part (3): "Unmet: waits for STOP-W15-01".

Deferred in WP-15:

- A81 live part (§6 Q-04): test and gallery.
- The audit record behind, the clock, end times, the cleanup window, lost answers: tests (P-03).
- Without U7: the "L (U7)" steps as tests (Q-W15-06).

Not in WP-15: the ceiling decisions (WP-07); account creation and status actions (WP-02); sign-in and enrolment
(WP-01); the grantee's views (WP-07, WP-08); TA-10 (WP-08); the audit pages (WP-14); `/accounts` retirement (WP-16);
the parked recovery and eligibility policies (product owner).

## 6. Questions for the architect (ranked)

Kept as asked, each answered row reduced to its answer. `WP-15.md` §3 and §4.1 answer: Q-01 → PM Q-01 decision and N-03
(warning, form stays; Core note in the batch, PLAN S-15); Q-05 → Q-W15-02 and I-15 (A33); Q-09 → Q-W15-06 with N-11
(A151); Q-02 → STOP-W15-01 and N-08 (A68, A73); Q-06 → STOP-W15-02, -06 with N-12 (criterion point 2 unproven); Q-07 →
N-02, F-38, E-24 (A89); Q-08 → STOP-W15-05; Q-10 → Q-W15-05; Q-11 → design §2.13. Q-03 and Q-04 stay open (P2); Q-12 is
new (P2).

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | A view of an account that is not active. | Answered: warning, form stays (N-03). | — |
| Q-05 | P1 | The group of a read grant. | Answered: Q-W15-02, I-15. | — |
| Q-09 | P1 | The harness for run-created accounts. | Answered: Q-W15-06 with N-11. | — |
| Q-02 | P2 | An expired address change blocks a new start. | Answered: STOP-W15-01 (Core note), N-08 words. | — |
| Q-03 | P2 | SA-06a, SA-06e and SA-01 group 7 count Core's open list, which includes a request past its end until the cleanup task closes it. | SA-06a shows "Open elevation requests: 1" while the only request ended; SA2 opens SA-06e and finds no link. Likelihood: medium; harm: low. | Keep Core's counts; the rows say "Expired at … it closes by itself" (A13). Core note: the count could exclude ended requests. |
| Q-04 | P2 | No staff notice on `lane-ui` needs an acknowledgement except a disclosure deletion request to a staff recipient. | CC-03's acknowledgement passes on tests only. Likelihood: certain; harm: low. | Test and gallery for A81. |
| Q-06 | P2 | The decider of an older request; the revoker's name; applicant names on staff notices. | Answered: parked, criterion point 2 unproven (N-12). | — |
| Q-07 | P2 | A download for a grant reader. | Answered: N-02, F-38, E-24. | — |
| Q-08 | P2 | Unlimited reads under wire caps. | Answered: STOP-W15-05. | — |
| Q-10 | P2 | Run-created accounts accumulate. | Answered: Q-W15-05. | — |
| Q-11 | P2 | One `grantee_not_operator` sentence. | Answered: two sentences (design §2.13). | — |
| Q-12 | P2 | The lettered additions write beyond design §6.2: OPe's accounting grant (given, revoked), OPe's reset and re-enrolment, a view of OPe, a withdrawn restoration, TAx's cancelled second change, TAx's suspension and restoration. | A rerun on `lane-ui` adds these rows per run on run-created accounts. Likelihood: certain per run; harm: low (synthetic, tagged). | Confirm them under Q-W15-05; they touch only run-created accounts and prove A43 to A46, A150, A25 to A29, A20, A74, A49 and A59. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, accounts (OPe, OPg, TAx, `wp15-sa`), G1 (internal record reference) | |
| U7 present and its guard tests (A151) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V21 result (steps; tests; WP-02 and WP-07 references) | |
| V22 result (steps; tests; scope completeness Partly met) | |
| Deferred items (reference each) | |
| Partly met and Unmet items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Unmet, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP15-A01 | | | |
| WP15-A02 | | | |
| WP15-A03 | | | |
| WP15-A04 | | | |
| WP15-A05 | | | |
| WP15-A06 | | | |
| WP15-A07 | | | |
| WP15-A08 | | | |
| WP15-A09 | | | |
| WP15-A10 | | | |
| WP15-A11 | | | |
| WP15-A12 | | | |
| WP15-A13 | | | |
| WP15-A14 | | | |
| WP15-A15 | | | |
| WP15-A16 | | | |
| WP15-A17 | | | |
| WP15-A18 | | | |
| WP15-A19 | | | |
| WP15-A20 | | | |
| WP15-A21 | | | |
| WP15-A22 | | | |
| WP15-A23 | | | |
| WP15-A24 | | | |
| WP15-A25 | | | |
| WP15-A26 | | | |
| WP15-A27 | | | |
| WP15-A28 | | | |
| WP15-A29 | | | |
| WP15-A30 | | | |
| WP15-A31 | | | |
| WP15-A32 | | | |
| WP15-A33 | | | |
| WP15-A34 | | | |
| WP15-A35 | | | |
| WP15-A36 | | | |
| WP15-A37 | | | |
| WP15-A38 | | | |
| WP15-A39 | | | |
| WP15-A40 | | | |
| WP15-A41 | | | |
| WP15-A42 | | | |
| WP15-A43 | | | |
| WP15-A44 | | | |
| WP15-A45 | | | |
| WP15-A46 | | | |
| WP15-A47 | | | |
| WP15-A48 | | | |
| WP15-A49 | | | |
| WP15-A50 | | | |
| WP15-A51 | | | |
| WP15-A52 | | | |
| WP15-A53 | | | |
| WP15-A54 | | | |
| WP15-A55 | | | |
| WP15-A56 | | | |
| WP15-A57 | | | |
| WP15-A58 | | | |
| WP15-A59 | | | |
| WP15-A60 | | | |
| WP15-A61 | | | |
| WP15-A62 | | | |
| WP15-A63 | | | |
| WP15-A64 | | | |
| WP15-A65 | | | |
| WP15-A66 | | | |
| WP15-A67 | | | |
| WP15-A68 | | | |
| WP15-A69 | | | |
| WP15-A70 | | | |
| WP15-A71 | | | |
| WP15-A72 | | | |
| WP15-A73 | | | |
| WP15-A74 | | | |
| WP15-A75 | | | |
| WP15-A76 | | | |
| WP15-A77 | | | |
| WP15-A78 | | | |
| WP15-A79 | | | |
| WP15-A80 | | | |
| WP15-A81 | | | |
| WP15-A82 | | | |
| WP15-A83 | | | |
| WP15-A84 | | | |
| WP15-A85 | | | |
| WP15-A86 | | | |
| WP15-A87 | | | |
| WP15-A88 | | | |
| WP15-A89 | | | |
| WP15-A90 | | | |
| WP15-A91 | | | |
| WP15-A92 | | | |
| WP15-A93 | | | |
| WP15-A94 | | | |
| WP15-A95 | | | |
| WP15-A96 | | | |
| WP15-A97 | | | |
| WP15-A98 | | | |
| WP15-A99 | | | |
| WP15-A100 | | | |
| WP15-A101 | | | |
| WP15-A102 | | | |
| WP15-A103 | | | |
| WP15-A104 | | | |
| WP15-A105 | | | |
| WP15-A106 | | | |
| WP15-A107 | | | |
| WP15-A108 | | | |
| WP15-A109 | | | |
| WP15-A110 | | | |
| WP15-A111 | | | |
| WP15-A112 | | | |
| WP15-A113 | | | |
| WP15-A114 | | | |
| WP15-A115 | | | |
| WP15-A116 | | | |
| WP15-A117 | | | |
| WP15-A118 | | | |
| WP15-A119 | | | |
| WP15-A120 | | | |
| WP15-A121 | | | |
| WP15-A122 | | | |
| WP15-A123 | | | |
| WP15-A124 | | | |
| WP15-A125 | | | |
| WP15-A126 | | | |
| WP15-A127 | | | |
| WP15-A128 | | | |
| WP15-A129 | | | |
| WP15-A130 | | | |
| WP15-A131 | | | |
| WP15-A132 | | | |
| WP15-A133 | | | |
| WP15-A134 | | | |
| WP15-A135 | | | |
| WP15-A136 | | | |
| WP15-A137 | | | |
| WP15-A138 | | | |
| WP15-A139 | | | |
| WP15-A140 | | | |
| WP15-A141 | | | |
| WP15-A142 | | | |
| WP15-A143 | | | |
| WP15-A144 | | | |
| WP15-A145 | | | |
| WP15-A146 | | | |
| WP15-A147 | | | |
| WP15-A148 | | | |
| WP15-A149 | | | |
| WP15-A150 | | | |
| WP15-A151 | | | |
| WP15-A152 | | | |
| WP15-A153 | | | |
| WP15-A154 | | | |
| V21 proof | | | |
| V22 proof (scope completeness: Partly met expected) | | | |
