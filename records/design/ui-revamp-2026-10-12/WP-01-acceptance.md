# WP-01 acceptance checklist: shell, sign-in, access states and command patterns

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-01 (UI-PLAN §12.1; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 12 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3. Not run. Input to the UX design review and the independent review. |
| Product base | lane branch `ui-revamp-2026-10-12` at 102e4c9 |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (public site, travel-agent sign-in, travel-agent pages); staff http://127.0.0.1:4652 (staff sign-in, operator and SuperAdmin pages) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 12 October 2026

The independent design review (lane `research/reviews/WP-01-design-review.md`, findings R-01, R-02, R-08, R-10,
R-11, R-12) and the architect's decisions and amendments (`WP-01.md` §3 and §4.1, A-01 to A-12) changed the rows
below. No other row changed. The questions of section 5 are answered in `WP-01.md` §3; section 5 is kept as asked.

| Row | Finding | Change |
|---|---|---|
| §1.2 | R-10 | Enrolment uses revisions: C5 applies to the set-up (E8). Operation status page: no rejection row; foreign and unknown keys are non-disclosure (200). OP-10: failed read is S7. |
| A35 | R-10 (A-03, A-06) | Identical replay (same key, same content) replays; changed content conflicts (409, S8); a new key is a new request; a replay never replaces the newer address. |
| A37 | R-11 | Pre-issuance service refusal split from post-commit mail failure; the mail failure is tested at the worker boundary, with the same neutral response for eligible and unknown addresses. |
| A42 | R-12 (§3 Q-11, Q-13) | S9 copy "If [address] can sign in, we are sending a code to it."; no numbers in the copy. |
| A49 | R-10 | An identical replay of a successful verification opens no second session; a new key with the used code gets the combined failure. |
| A56 | R-12 | The email-change redirect (initiating browser) is separated from the generic session-ended page (other sessions). |
| A65 | R-12 (§3 Q-09) | One combined code-failure text; no factor-specific correction; secret fields empty after re-render. |
| A67 | R-10 (A-02; §3 PM Q-05) | The key MAY show again while the set-up is open; never after completion; E8 stale revision in a second tab; the harness enrols, Max does not. |
| A70 | R-10 | Status is "set up" or "Not set up"; a failed read is the S7 error state, not a partial "Unavailable" field. |
| A82 | R-12 (§3 Q-01, P-02; A-04) | Receipt shows reference and resulting facts, no command name and no accepted time (partly met until P-02); status page reads "Checked at [time] IST"; an unavailable read claims no acceptance. |
| A83 | R-10 (§3 PM A83) | A rejection shows its reasons on the re-rendered form, never on the status page. |
| A86, A89 | R-08 (A-08) | An unknown or foreign key reads "Nothing is recorded for request [reference] so far" (200), not 404. |
| A99 | R-12 (A-12) | Safe input stays; a secret code value never stays in a re-rendered form. |
| V23 (section 3) | R-12 (§3 Q-10, P-W01; A-09) | Lag-form freshness ("Behind by [n] s when read at [time] IST"), "Checked at" on the status page; part B by test, part C by test until P-03; maintenance page without account or support-view details; static public page served during maintenance. |
| A11, A16 | Architect decision WP-01.md §3 (Q-10) | Freshness in the amended LD-08 lag form; no as-of time. |
| A47 | Architect decision WP-01.md §3 (Q-09) | Combined code-failure text; the code field is empty after a refusal. |
| A69, A118 | Architect decision WP-01.md §3 (PM Q-05) | The harness does the enrolment and the axe run, with screenshots off; Max does not enrol by hand. |
| A130 (new, §2.8) | R-01 (A-01) | A background refusal removes restricted content and navigates. |
| A131 (new, §2.5) | R-02 (A-02) | Back after sign-out or after enrolment never shows private content or the key; the JavaScript-off residual is recorded. |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §3.3, §7.1, §7.4, §7.5, §8 (all), §9 C01 C02 C13 C15, §12 V23 V24 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B08, B09, B10, B33, B37, B39, B40, B41 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | internal 52adc40 | §1, §2, §3.1, §5.1, §7 (sign-in rows), §8.1, §10 AC-01 to AC-28, §11, §12.1 WP-01, §14.1 (binding) |
| TR | `../../uat/2026-10-12-uat-pass1-triage.md` | internal 52adc40 | §1 (UAT-01, UAT-02, derived "challenge expired"), §3.1 |
| UF | `../../uat/2026-10-12-max-uat-findings.md` | internal 52adc40 | UAT-01, UAT-02 |
| LP | `PLAN.md` (this folder) | working tree of 12 October 2026 | LD-01 to LD-13 |

### 0.2 Conventions

- **Personas.** Visitor (signed out). TA: `syn-ta-1`, `syn-ta-2`, `syn-ta-3` (`@synthetic.test`). Operator:
  `syn-operator-1` to `-3`. SuperAdmin: `syn-superadmin-1` to `-3`. Keyboard-only user. Screen-reader user. Phone
  user (390 px wide).
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required.
- **Sign-in codes (rule C).** "Get the code" means: Max runs `signin-codes.mjs` with the address in his own
  terminal; an agent uses the LD-11 harness, which types the code into the browser. Nobody prints, logs,
  screenshots or stores a code or an authenticator key. Agents use the helper's command line only with `--list`
  and `--check`.
- **Copy.** Quoted text is mandatory where the source quotes it as a requirement: the environment label, the
  PUB-02-S9 address line and the §11.3 boundary template. Other quoted text is draft copy (CR-09). Draft copy
  passes when the page states the same facts.
- **Viewports.** Wide 1440 × 900. Phone 390 × 844. Reflow checks add 320 px and 1280 px at 400% zoom.
- **Times.** Every time on a page carries "IST" (AD-10, CR-06).
- **Pass rule.** WP-01 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V23 proof (section 3) passes. A failed item
  becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** The installation is seeded with the synthetic accounts, catalogue and launches.
  `syn-ta-1` holds at least one group and one draft application, made through the existing pages (LD-02).
  `syn-operator-1` holds at least one assigned application. The run record keeps these identifiers in the internal
  record only.

## 1. Scope

### 1.1 Pages

| Page | Host and path (existing paths stay, LD-03) | Part in WP-01 |
|---|---|---|
| SH-01 App shell | Every signed-in page on 4650 and 4652 | Environment label and title prefix, rail per role (§2.2), top bar (scoped search, Notices, Help, account menu, context selector), breadcrumb and freshness line, landmarks, announcement region, public header on PUB pages |
| SH-02 Access and service state | Any path on 4650 and 4652 | Denied, not found, access changed, signed out, maintenance; capacity and core-unreachable states of the shell |
| PUB-02 Sign-in, TA path | 4650 `/sign-in`, `/sign-in/verify`, `/sign-in/help` | Email step, code step, help; states of §3.1 plus PUB-02-S8, S9, S10 (§14.1) |
| PUB-02 Sign-in, staff path | 4652 `/staff/sign-in`, `/staff/sign-in/verify`, `/staff/enrol`, `/staff/enrol/setup` | Email step, mailed code plus authenticator code, first-time enrolment of the authenticator |
| OP-10 Notices and account, sign-in and MFA part | 4652 `/account` | Name, role, authenticator status, sessions, Sign out, Sign out everywhere |
| Operation status page | 4650 `/ta/operations/:operationKey`; 4652 `/ops/operations/:operationKey`, `/admin/operations/:operationKey` | Check operation status: accepted, rejected, unresolved, unavailable, denied |
| Command-result patterns | Component gallery and the pages above | CMP-07 error summary, CMP-08 operation receipt, CMP-10 policy boundary notice, CMP-13 unresolved command banner, CMP-23 environment label, CMP-27 OTP code field |

Commands: Request sign-in code, Verify sign-in code, Staff sign-in, Enrol MFA factor, Sign out, Check operation
status. Read models: Session context, Recent operations, Notices.

### 1.2 State coverage

S1 (loading) does not apply: every WP-01 page is server-rendered and no region loads after the page. S2 and S3 do
not apply: no WP-01 page holds a filtered list, and the OP-10 sessions list always holds the current session. PUB-02
has no S1 to S6 (PL §3.1, §14.1). C5 (stale revision) applies only to the staff authenticator enrolment set-up,
which carries a revision (design E8): A67. No other WP-01 command acts on a revisioned object.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved |
|---|---|---|---|---|---|
| SH-01 | S4 A21; S5 A11, A16; S6 → SH-02; S7 A81 | — | — | A22 (Sign out) | A23 (Sign out) |
| SH-02 | S6 A73, A74, A75, A76, A77; maintenance A78; capacity A79; core unreachable A80 | — | — | — | — |
| PUB-02 TA email step | S8 A34, A35; S10 A33; JavaScript off A32 | A27, A28 | A32 to A38, A83 | A29, A30, A31 | A39 |
| PUB-02 TA code step | S9 A42, A43 | A47 | A47 to A51 | A46 | A52 |
| PUB-02 staff | S8 and S10 A62 | A63 | A65, A66, A68, A69, A83; C5 A67 | A64, A67, A69 | As A39 and A52, by test |
| OP-10 sign-in and MFA part | S6 A77; S7 A70 (failed read), A81 | — | — | A71 | A23 |
| Operation status page (shows the original command's ACC or UNR; a rejected command leaves no record) | S4 A88; S5 not applicable (authoritative read, LD-08); S6 A87; unknown or foreign key (non-disclosure, 200) A86, A89; S7 A81 | — | None: the rejection shows on the form (A83) | A82, A85 | A84 |

## 2. Acceptance checklist

### 2.1 Environment label and page title (SH-01, CMP-23)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A01 | Visitor, TA, operator, SuperAdmin | Every page in scope on 4650 and 4652: sign-in pages, help, signed-in pages, SH-02 variants, operation status pages, error pages | Open each page. Reload it. Go to a second page. | The text "Test environment. Synthetic data only." is visible on every page. No control hides or dismisses it. It stays after reload and after navigation. | L | PL §2.1; UX §7.1; BS B37; AC-28 |
| WP01-A02 | Any | Same pages | Read the browser tab title. | The title starts with "[TEST] ". The rest of the title names the page. | L | PL §2.1 (ADDED); CMP-23 |
| WP01-A03 | Screen-reader user | `/sign-in`, `/staff/sign-in`, one signed-in page per role, SH-02 denied | Read the page from the top with VoiceOver or NVDA. List the landmarks. | The screen reader reads the environment label as text. The label is not `aria-hidden`. It is inside the banner landmark or before the main landmark. | L | AC-28 |
| WP01-A04 | — | Production-mode render of the same pages | Render the pages with the production environment setting. | No environment label and no "[TEST]" prefix appear. | T | CMP-23 ("absent in production") |

### 2.2 Shell: rail, top bar, landmarks (SH-01)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A05 | TA (`syn-ta-1`) | Any TA page, 4650 | Sign in. Read the rail. Open the account menu. | The rail holds Home, Services, Groups, Applications, Notices, Payment history, and nothing else. Account is in the top-bar account menu, not in the rail. | L | PL §2.2; LD-03 |
| WP01-A06 | Operator (`syn-operator-1`) | Any operator page, 4652 | Sign in. Read the rail. | The rail holds My work, Applications, Incidents and follow-up, Notices and account. "Originals" is absent, because the synthetic operator's scope has no declared physical route. | L | PL §2.2; BS B30 |
| WP01-A07 | SuperAdmin (`syn-superadmin-1`) | Any SuperAdmin page, 4652 | Sign in. Read the rail and the account menu. | The rail holds Home, Work queues, Applications & groups, Offerings & launch, Accounts & access, Money & exposure, Incidents & audit. Notices and account are in the top-bar account menu. No role sees an "Accounts dashboard" or another destination for a PARKED capability. | L | PL §2.2; BS B29, B43 |
| WP01-A08 | TA, operator, SuperAdmin | One page per rail destination | Open the page. Inspect the current rail item. View the page in greyscale (browser rendering emulation). | The current item has heavier text, the teal indicator and `aria-current="page"`. In greyscale the current item is still identifiable. | L | PL §2.1; AC-06 |
| WP01-A09 | TA, operator, SuperAdmin | Any signed-in page | Read the top bar. | The top bar holds scoped search, Notices, Help and the account menu. The search label states its scope (for the TA: "Search your applications"). The account menu shows the person's own name and role and "Sign out". | L | PL §2.1; UX §7.1 |
| WP01-A10 | TA (`syn-ta-2`) | Top-bar search, 4650 | Note a synthetic applicant name and an application reference of `syn-ta-1`. Sign in as `syn-ta-2`. Search for each. Search for a random string. | No result appears. No count, hint or "hidden results" text appears. The answer for the other TA's data is the same as the answer for the random string. | L | PL §2.1; BS B10 |
| WP01-A11 | TA | Top-bar search results | Make the search read model report lag (test fixture). Search. | The results show "Behind by [n] s when read at [time] IST" or "Freshness unavailable". No result outside scope appears. | T | PL §5.1 (Scoped search row); LD-08 as amended (architect decision WP-01.md §3, Q-10) |
| WP01-A12 | TA, operator, SuperAdmin | Help in the top bar | Select Help. Read the panel. Close it with Escape. | Help opens a side panel. The panel states no support hours, response time, telephone number or escalation promise. Escape closes the panel and returns focus to Help. | L | PL §2.1; UX §9 C13 |
| WP01-A13 | TA, operator | Notices in the top bar | Read the Notices entry. Select it. | The entry counts notices that need the person's acknowledgement. It shows no "unread" or "read" marker. It opens the notices destination of the role. | L | PL §2.1; LD-06 |
| WP01-A14 | Each of the nine synthetic accounts | Any signed-in page | Sign in. Look for a context selector. | No context selector appears: each synthetic account holds one context. | L | PL §2.1; AD-12 |
| WP01-A15 | Fixture person with two contexts | Any signed-in page | Open the selector. Switch context. Open a page of the first context by its address while the second context is active. | The selector lists only the contexts the person holds. Switching changes the rail and the home page only. The person's permissions do not change. No impersonation occurs. | T | PL §2.1; UX §7.1; AD-12 |
| WP01-A16 | TA, operator | Every list or workspace page that uses the new shell | Read the line under the breadcrumb. | The breadcrumb shows the location path. The freshness line shows "Read at [time] IST" for an authoritative read. For a projection it shows "Up to date when read at [time] IST", "Behind by [n] s when read at [time] IST" or "Freshness unavailable". The page computes no as-of time and applies no client-side age rule. | L | PL §2.1; LD-08 as amended (architect decision WP-01.md §3, Q-10); AD-10 |
| WP01-A17 | Keyboard-only user | Every page in scope | Load the page. Press Tab once. Press Enter. Inspect landmarks and headings. | The first focusable element is "Skip to main content". Enter moves focus to the main region. The page has one `banner`, one labelled `navigation` for the rail (signed-in pages), one `main` and one `h1`. Heading levels do not skip. | L | PL §2.1; AC-03 |
| WP01-A18 | Screen-reader user | Every signed-in page | Inspect the page for live regions. | The page holds exactly one polite announcement region. It announces nothing at page load. | L | PL §2.1 |
| WP01-A19 | Visitor | `/sign-in`, `/staff/sign-in` | Read the header. | The header holds the text wordmark "TravelMudra" and no logo image (C01 not supplied). It holds no rail, no private search and no Notices. | L | PL §2.1; UX §7.1; UX §9 C01 |
| WP01-A20 | TA, operator | Any signed-in page at 1440, 1000 and 390 px | Resize the window. Open and close the menu with the keyboard. | At 1200 px or wider the rail is visible and 224 to 240 px wide. From 768 to 1199 px the rail collapses to a menu button. Below 768 px the menu opens at full height. The menu button has an accessible name and `aria-expanded`. Escape closes the menu and returns focus to the button. | L | PL §2.1, §9 (AD-11) |
| WP01-A21 | TA | Rail and top bar while the count read model is unavailable | Make the count read model fail (see V23). Load a page. | No rail item and no Notices entry shows "0" or a number from before the failure. The count shows "Unavailable" (visible text or accessible text, per Q-03). | L+T | PL §1.2 (D7); UX §3.3, §8.3; BS B33 |
| WP01-A22 | TA, operator | Account menu | Select "Sign out". Then press the browser Back button. Then open `/ta` (TA) or `/ops/work` (operator) in a new tab. | Sign out ends the session. The TA lands on the public entry with "You are signed out." (the operator on staff sign-in). Back shows no private content. The new tab shows the sign-in page. | L | PL §5.1 (Sign out row); BS B08 |
| WP01-A23 | TA | Sign out with a lost acknowledgement | Inject a lost acknowledgement on Sign out. | The page shows the signed-out state locally. The next page load checks the session and shows the sign-in page. No private content shows. | T | PL §5.1 (Sign out UNR) |

### 2.3 PUB-02 travel-agent sign-in: email step

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A24 | Visitor | 4650 `/sign-in` | Open the page. Read it. | The `h1` is "Sign in". The page says it is for travel agents and that no password is needed. It shows a labelled "Email address" field (`type="email"`, `autocomplete="username"`), a labelled verification region with one sentence that explains the browser check, "Send sign-in code", and a link to sign-in help. | L | PL §3.1 PUB-02; UX §7.5 |
| WP01-A25 | Visitor | `/sign-in`, `/sign-in/help` | Select "Lost access to your email?". Select the account question ("Getting an account" or equivalent). | Each shows a policy boundary notice in the §11.3 form: "[Action] is unavailable until [policy] is [approved / recorded]. Owner: [owner]." Lost mailbox: recovery is unavailable; owner product owner (BS B09, B44). Getting an account: no self-registration; eligibility is not published; owner product owner (B-01). No form to request an account appears. | L | PL §3.1, §11.3, §13.2 B-01, B-02; AD-05; OC-10 |
| WP01-A26 | Visitor | `/sign-in` | Look for the staff path. | The page shows that it is the travel-agent path. The staff path follows the architect's answer to Q-04: either a "TravelMudra staff" link to the staff sign-in, or no staff link and no staff host address on the edge host. | L | AD-08; Q-04 |
| WP01-A27 | Visitor | `/sign-in` | Leave the email empty. Select "Send sign-in code". | C1: the error summary "There is a problem" appears and receives focus. Its link names the field and moves focus to it. The field shows its error inline and has `aria-invalid="true"`. No code is sent. | L | PL §1.4 C1; CMP-07; AC-08 |
| WP01-A28 | Visitor | `/sign-in` | Type `abc`. Select "Send sign-in code". | C1: the error says the expected form, for example "Enter an email address in the form name@example.com." The typed value stays in the field. | L | PL §1.4 C1; AC-08 |
| WP01-A29 | Visitor | `/sign-in` | Type `syn-ta-1@synthetic.test`. Select "Send sign-in code". Get the code (rule C). | C3: the code step opens. The neutral line names the typed address (A42). A code arrives in the synthetic mailbox. | L | PL §5.1 (Request code ACC); BS B08 |
| WP01-A30 | Visitor | `/sign-in` | Repeat A29 with `nobody-pm-check@synthetic.test` (no account). Compare both code steps (text, elements, HTTP status). | The code step is identical except for the typed address. Nothing says that the account does not exist. No code arrives for the unknown address. | L | BS B08; CR-04; PL §5.1 ("Same copy for unknown accounts") |
| WP01-A31 | Visitor | `/sign-in` | Request a code for an active, an unknown, a suspended and a pending (not approved) TA account. | All four get the same neutral answer and the same HTTP status. Only the active account receives a code. | T | BS B08; PL §5.1 |
| WP01-A32 | Visitor | `/sign-in` with JavaScript turned off | Turn off JavaScript for 127.0.0.1:4650. Reload. Type `syn-ta-1@synthetic.test`. Send. | No code is sent. The page says that the verification needs JavaScript and how to turn it on. It links to sign-in help. The typed address stays. The message does not read as a generic failure. | L | BS B08 (CAPTCHA before issuance); PL §3.1 ("no bypass") |
| WP01-A33 | Visitor | `/sign-in` | Turn on JavaScript. Open `/sign-in`. Wait more than 5 minutes (`captcha.ttlMs`). Type `syn-ta-1@synthetic.test`. Send. | PUB-02-S10: the message says that the check on this page has expired and that a reload gives a new check. One action (for example "Reload the page") gives a fresh form. No code is sent. The text is not "The verification did not pass. Try again." alone. After that one action and a new send, the code step opens and a code arrives. | L | PL §14.1 PUB-02-S10; TR §1 (derived from UAT-08) |
| WP01-A34 | Visitor | `/sign-in` → code step → Back | UAT-01 steps: type a wrong address (not a synthetic account). Send. On the code step press the browser Back button. Correct the address to `syn-ta-1@synthetic.test`. Send. | PUB-02-S8: either the corrected address sends a new code with no manual reload, or the error offers a fresh form in one action ("Start again") and that action works. The message does not mark the address as wrong: the field is not in the error state and the text does not refer to the address. After "Start again" (if shown) and a send, the code step for `syn-ta-1` opens and a code arrives. | L | PL §14.1 PUB-02-S8; UF UAT-01; TR §1 |
| WP01-A35 | Harness | `/sign-in` | (1) Identical replay: request a code for `Syn-Ta-1@synthetic.test` (mixed case). Submit the same form again with the same operation key and the same content. (2) Changed content: press Back, change the address, submit with the old operation key. (3) New key: open a fresh form and request again. (4) Request address A, then address B in a second tab, then replay A's identical form. | (1) The replay returns the recorded request. No second code is issued. The page shows the same neutral code step. The mixed-case address replays, because the page sends it trimmed and lower-cased (A-03; the Core binding defect is P-04). (2) The server refuses the changed content (`conflict_operation_key`, 409). The page shows the S8 recovery of A34. No code is issued for the changed address. (3) A new key is a new request under the rate limits. It never bypasses the bot check. (4) The code step still names address B. A replay never replaces the newer address (A-06). | L+T | TR §1 (the refusal stays); PL §14.1 S8, §7 K-STD; BS B35; WP-01.md A-03, A-06; review R-10 |
| WP01-A36 | Visitor | `/sign-in` | Request codes for `syn-ta-3@synthetic.test` until the rate limit applies. Repeat with an unknown address. Wait for the limit window to pass. | C2: the page says "Too many attempts in a short time. Wait a few minutes before you try again." or the same facts. It invents no countdown. The unknown address gets the same message under the same limit. After the window, a request works. | L | BS B08 (rate limits at issuance); PL §5.1 (REJ rate limit) |
| WP01-A37 | Visitor; mail-task worker | `/sign-in`; the mail task after issuance | (1) Before issuance: make a required sign-in service unavailable (rate limiter or core; fixture). Send. (2) After issuance: make the mail provider fail at the mail-task worker boundary (fixture). Request a code for an eligible address and for an unknown address. | (1) 503 with a form-level notice: sending sign-in codes is unavailable until the sign-in service is back; nothing was sent; owner TravelMudra operations; try later. No code is issued without a passed bot check. (2) The sign-in response is the same neutral code step for the eligible and the unknown address. It does not report the later mail failure, and it never differs between the two addresses. The failure is visible only at the worker boundary (a failed mail task with its reason category). | T | PL §5.1 (Request code unavailable); UX §8.2; BS B08; design P15; WP-01.md A-11; review R-11 |
| WP01-A38 | Visitor | `/sign-in` | Send with a bot-check proof that fails (tampered or reused proof, harness). | C2: the message says that the verification did not pass and offers a fresh form. No code is sent. | T | BS B08; PL §5.1 (REJ CAPTCHA failure) |
| WP01-A39 | Visitor | `/sign-in` with a lost acknowledgement on Request code | Inject a lost acknowledgement. | C4: the page shows the same neutral copy. It claims nothing more. The TA may request again under the limits. | T | PL §5.1 (Request code UNR); UX §3.3 |
| WP01-A40 | Visitor | Email step and code step | Complete A29. Read the address bar, the page title and the browser history. | No URL, query string, title or history entry holds the email address or the code. The code-step URL is the same for every address. | L | PL §2.3 SH-R06; BS B33 |
| WP01-A41 | Visitor | Email step and code step | Complete A29. Inspect `localStorage`, `sessionStorage` and IndexedDB of 127.0.0.1:4650. | No email address and no code is stored. | L | PL §2.3 SH-R12; UX §3.3 |

### 2.4 PUB-02 travel-agent sign-in: code step

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A42 | Visitor | `/sign-in/verify` after A29 | Read the page. | PUB-02-S9: a line names the typed address in the no-disclosure form: "If [address] can sign in, we are sending a code to it." The line states no account fact (no name, no "your account"). The page states that the code expires and works once. It names no number of minutes or tries. | L | PL §14.1 PUB-02-S9 as amended (WP-01.md §3 Q-11, Q-13); UF UAT-02; BS B08; review R-12 |
| WP01-A43 | Visitor | `/sign-in/verify` | Select "Use a different address". Type `syn-ta-2@synthetic.test`. Send. | "Use a different address" is visible next to the code field. It is a separate control from "Request a new code". It returns to the email step with a fresh form (new operation key, new bot check). The send works the first time, with no "form already used" error. The code step names the new address. | L | PL §14.1 PUB-02-S9; UF UAT-02; TR §1 |
| WP01-A44 | Visitor | `/sign-in/verify` | Select "Request a new code". | A new bot check runs before the code is issued; nothing bypasses it. The neutral confirmation shows again. A new code arrives. | L | PL §5.1, §7 (K-OTP); BS B08 |
| WP01-A45 | Visitor, phone user | Code field | Inspect the field. Paste the code with a space or hyphen inside it. | The code field is one input, not split boxes. It has a visible label, `inputmode="numeric"` and `autocomplete="one-time-code"`. A pasted code with spaces or a hyphen is accepted. | L | CMP-27; AC-07; UX §7.5 |
| WP01-A46 | TA | Code step | Get the code (rule C). Enter it. Select "Sign in". Then press Back. | C3: the session opens in the TA context and the TA home page shows. Back does not show a working code form for the used attempt. | L | PL §5.1 (Enter code ACC), §4.1 step 1 |
| WP01-A47 | Visitor | Code step | Select "Sign in" with the code field empty. Then enter a wrong 8-digit code. Repeat for the unknown address of A30. | C1 (empty field) and C2 (wrong code): the error summary receives focus and links to the code field. The message is the combined code-failure text, for example "This code did not work. It may be mistyped, expired, already used, replaced by a newer code, or from another browser. Check the newest email, or request a new code.", with "Request a new code" as one action. The message is the same for the unknown address. The code field is empty after the refusal. | L | PL §5.1 (REJ); BS B08; AC-08; architect decision WP-01.md §3 (Q-09); design P19 |
| WP01-A48 | TA | Code step | Request a code. Wait more than 10 minutes. Enter the code. | C2: the page says that the code has expired (or the neutral form of A47) and offers "Request a new code" in one action. | L | PL §3.1 ("code expired"); UX §8.2; BS B41 |
| WP01-A49 | Harness | Code step | (1) Enter a correct code and sign in. (2) Replay the identical verification (same key, same content). (3) Submit the same code in a fresh form (new key). | (1) One session opens. (2) The replay opens no second session and delivers no session token. The page shows "Sign-in could not be completed in this browser" with "Request a new code". (3) The used code fails with the combined code-failure text of A47 ("This code did not work…"). | L+T | BS B08 (single use), B35, B41; design P19, P23; review R-10 |
| WP01-A50 | TA | Code step | Enter wrong codes until the attempt limit. Then enter the correct code. Repeat for the unknown address. | After the limit, the correct code is refused too. The page says to request a new code. The message discloses nothing about the account, and it is the same for the unknown address. | L | BS B08 (bounded attempts), B41; PL §3.1 ("attempts exhausted") |
| WP01-A51 | TA | Code step | Request the code in browser A. Enter it in browser B on the code-step address. | The page says that sign-in could not be completed in this browser and offers "Request a new code". No session opens in either browser. | L | BS B08 (code bound to the attempt) |
| WP01-A52 | TA | Code step with a lost acknowledgement on Verify | Inject a lost acknowledgement. | C4: the page claims no success. It offers "Request a new code" under the current limits. | T | PL §4.1 step 1 (UNR); UX §3.3 |

### 2.5 Session, deep links and revocation

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A53 | TA (`syn-ta-1`) | Deep link to an own application | Copy the address of a `syn-ta-1` application. Sign out. Open the address. Sign in as `syn-ta-1`. | The address leads to sign-in. After sign-in the TA lands on that application. | L | PL §2.3 SH-R03 |
| WP01-A54 | TA (`syn-ta-2`) | Same deep link | Sign out. Open the address of A53. Sign in as `syn-ta-2`. | The TA sees SH-02 denied. The page shows no applicant name, no application reference echo, no group and no country. | L | PL §2.3 SH-R02, SH-R03; BS B10 |
| WP01-A55 | TA (`syn-ta-3`) | Account page, two browsers | Sign in as `syn-ta-3` in browsers A and B. In A, open Account and select "Sign out everywhere". In B, open any page. Press Back in B. | B lands on sign-in with a message that the session ended. B shows no private content, also after Back. | L | UX §8.3 (revoked session); BS B08 (revocable session) |
| WP01-A56 | TA | Sign-in after an email change, two browsers | Sign in as the TA in browsers A and B. Complete a two-proof email change in A (fixture). Note where A lands. Then open any page in B. | A, the browser that completed the change, lands on sign-in with "Sign in with your new email address." B, on its next page, lands on the generic session-ended notice ("Your session ended. Sign in again to continue.") with no reason stated: an old session cannot know the cause. The old address no longer receives codes. | T | PL §2.3 SH-R11, §3.1; BS B09; design P5, P6; review R-12 |
| WP01-A57 | TA, operator | 4650 and 4652 | Signed in as `syn-ta-1` on 4650, open http://127.0.0.1:4652/ops/work. Signed in as `syn-operator-1` on 4652, open http://127.0.0.1:4650/ta. | The TA session does not open staff pages: staff sign-in shows. The staff session does not open TA pages: TA sign-in shows. | L | BS B41 (session scope), B10 |
| WP01-A58 | SuperAdmin | Account pages of `syn-ta-1` on 4652 | Look for any control that shows, chooses or resends a TA's sign-in code, sets a password, or signs in as the TA. | No such control exists. A support view, if present, is labelled read-only and offers no target actions. | L | BS B08, B09, B11, B41 (no admin bypass) |
| WP01-A59 | TA, operator | After a restore | Restore a recovery set (fixture). Use a session and a code issued before the restore. | The old session leads to sign-in. The old code is refused with the neutral message. The installation stays closed until it is opened deliberately. | T | BS B40 |
| WP01-A131 | TA, operator | Back and Forward after sign-out and after enrolment | (1) With JavaScript on, open a private page, sign out, press Back. (2) Complete an authenticator enrolment (A67). Press Back. (3) Read the sign-out response headers, and the `<html>` element of a signed-in page, a sign-in page, the enrolment set-up and an operation status page. (4) Repeat (1) with JavaScript off. | (1) Back shows the sign-in page, not the private page: a page restored from the back/forward cache hides its main content and reloads from the server. (2) Back never shows the key. (3) The sign-out answer carries `Clear-Site-Data: "cache"`. Each of those documents carries `data-reload-on-restore`. (4) Private content that a browser still restores with JavaScript off is recorded as a known limitation in `WP-01.md`, with the browser and its version. | L+T | WP-01.md A-02; UX §8.3; BS B08, B10; review R-02 |

### 2.6 PUB-02 staff sign-in and MFA

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A60 | Visitor | 4652 `/staff/sign-in` | Open the page. Then turn off JavaScript and send `syn-operator-1@synthetic.test`. | The `h1` is "Staff sign-in". The page says that staff sign in with a mailed code and an authenticator code. It holds a labelled email field and the verification region. With JavaScript off, no code is sent and the page says why. | L | PL §3.1 PUB-02 (staff path), AD-08; BS B08 |
| WP01-A61 | Visitor | `/staff/sign-in` | Send `syn-operator-1@synthetic.test`. Send `nobody-pm-staff@synthetic.test`. Compare. | Both get the same neutral next step and the same HTTP status. Only the real account receives a mailed code. | L | BS B08; PL §5.1 (Sign in with MFA REJ) |
| WP01-A62 | Visitor | `/staff/sign-in` | Run the steps of A33 (expired check) and A34 (Back, correct, send) on the staff form. | The staff form behaves as PUB-02-S10 and PUB-02-S8 require (Q-08). | L | PL §14.1 S8, S10 (same form design) |
| WP01-A63 | Operator | `/staff/sign-in/verify` | Read the fields. Submit with both fields empty. Paste a mailed code with a space. | Two labelled fields: the mailed code (`autocomplete="one-time-code"`) and the authenticator code, each with a hint. C1: the error summary receives focus and links to each empty field. A pasted code with a space is accepted. | L | CMP-27; AC-05, AC-07, AC-08 |
| WP01-A64 | Operator, SuperAdmin | `/staff/sign-in/verify` | Get the mailed code and the authenticator code (rule C). Sign in as `syn-operator-1`, then as `syn-superadmin-1`. | C3: the operator lands on My work (OP-01). The SuperAdmin lands on Home (SA-01). | L | PL §5.1 (Sign in with MFA ACC) |
| WP01-A65 | Operator | `/staff/sign-in/verify` | Enter a correct mailed code with a wrong authenticator code. Then a wrong mailed code with a correct authenticator code. Then reuse an authenticator code that was already used. | The first two attempts get the same combined text, for example "These codes did not work. Check the newest email code and the current code in your authenticator app." The page does not name which code failed. Both code fields are empty after the re-render; no secret value is kept. The reused authenticator code gets "This authenticator code was already used. Wait for the next code and try again." Nothing states the account state. | L | PL §5.1 (REJ neutral failure); CMP-07; design §4.8; WP-01.md §3 Q-09; review R-12 |
| WP01-A66 | Operator (`syn-operator-3`) | `/staff/sign-in` | A SuperAdmin suspends `syn-operator-3` (existing account pages, with a reason). Request a code for `syn-operator-3`. Then the SuperAdmin restores the account. | The answer is the same neutral answer as for an unknown address. No page says "suspended". The account cannot sign in. After the restore it can. | L+T | PL §5.1 (Suspended account → neutral failure); BS B08, B11 |
| WP01-A67 | Operator without an authenticator | 4652 `/staff/enrol`, `/staff/enrol/setup` | A SuperAdmin sends an enrolment code to a new synthetic operator. The harness opens `/staff/enrol`, enters the enrolment code and continues. (1) Reload the set-up page before completion. (2) Open the set-up in a second tab. Submit a wrong authenticator code in tab A. Then submit in tab B. (3) Complete the set-up. Press Back. Reload. | The set-up page shows the key and the QR code with "Shown to you only". The key is never in the URL or the title. (1) While the set-up is open, a reload MAY show the key again. (2) C5: tab B gets the stale-revision answer (409), "This set-up changed since you opened the page…", with the current key and revision. It does not say that the code was wrong (E8). (3) After completion, neither Back nor reload shows the key: the set-up has ended and the server redirects (A-02). The harness reads the enrolment code and the key in memory only. It never prints, logs, screenshots or stores them. | L (harness) + T | PL §5.1 (Enrol MFA factor); BS B08, B11; LD-11; WP-01.md §3 (PM Q-05), A-02; design E5, E8, E11; review R-10 |
| WP01-A68 | Operator | `/staff/enrol` | Paste a wrong, a used and an expired enrolment code. | Each gets "The enrolment code is invalid, already used or expired. Ask a SuperAdmin to send a new one." or the same facts. Nothing states whether the account exists. | L+T | PL §5.1 (Enrol REJ); BS B08 |
| WP01-A69 | Operator | `/staff/enrol/setup` | Enter a wrong authenticator code. Then a correct one. In a second run, enter wrong codes until the limit. | A wrong code shows the number of tries left. A correct code enrols the factor and the operator continues to sign in. At the limit the set-up ends and the page offers "Enter a new enrolment code". The harness runs these steps; it reads the enrolment code and the key in memory only and never prints, logs, screenshots or stores them. | L (harness) + T | PL §5.1 (Enrol ACC, REJ); LD-11; architect decision WP-01.md §3 (PM Q-05) |

### 2.7 OP-10 account: sign-in and MFA part

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A70 | Operator, SuperAdmin | 4652 `/account` | Open Account for an account with an authenticator and for an account without one (fixture). Then make the account read fail as a whole (fixture). | The page shows the person's name, role and authenticator status in words: set up, or "Not set up". It shows no key, QR code, recovery code or secret. It says that a SuperAdmin resets a lost authenticator and that nobody can see the key. When the account read fails, the page shows the S7 error state with no account facts. It never shows "Not set up" for a failed read. | L+T | PL §3.3 OP-10, §5.3 OP-10; BS B11; D7; design §11.4; review R-10 |
| WP01-A71 | Operator | `/account`, two browsers | Sign in in browsers A and B. Read the sessions list in A. Select "Sign out everywhere" in A. Confirm. Open a page in B. | The sessions list shows each browser session and no address or device details. The confirmation states the consequence before it acts. Both browsers are signed out. B lands on staff sign-in with a session-ended message. | L | PL §5.3 OP-10; BS B08 |
| WP01-A72 | Operator | `/account` | Look for the notices list and the accounting-grant section. | WP-01 does not change them. The page does not offer "Mark as read" (LD-06). | L | LD-06; PL §12.1 (OP-10 sign-in and MFA only) |

### 2.8 SH-02 access and service state

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A73 | TA (`syn-ta-2`) | Address of a `syn-ta-1` application | Signed in as `syn-ta-2`, open the address. | "You do not have access to this page." with "Go to your home". No applicant name, reference echo, group or country. One `h1`. The environment label shows. | L | PL §2.4 SH-02, §2.3 SH-R02; BS B10 |
| WP01-A74 | TA (`syn-ta-2`) | Address of an application that does not exist | Change one character of the reference in the A73 address. Open it. Compare with A73. | The text, the main content and the HTTP status equal A73. A person cannot tell "not yours" from "does not exist". | L | PL §2.4 (not found same text as denied); BS B08, B10 |
| WP01-A75 | Operator (`syn-operator-1`) | An assigned application, 4652 | Open the application. A SuperAdmin reassigns it to `syn-operator-2` with a reason. Reload. Open an earlier operation-result link for that application. | The reload shows SH-02 "Your access changed" with no case facts. The old operation-result link is denied. | L+T | PL §2.3 SH-R04, SH-R05; BS B10 |
| WP01-A76 | Operator (`syn-operator-3`) | Any page, 4652 | While `syn-operator-3` is signed in, a SuperAdmin suspends the account. The operator opens a page. The SuperAdmin restores the account afterwards. | The operator lands on staff sign-in with a session-ended message. No restricted content shows. | L+T | PL §2.3 SH-R04; BS B10, B11 |
| WP01-A77 | Visitor | 4650 `/account`, 4652 `/account` | Signed out, open each address. | Each leads to the sign-in of its host. No account facts show. | L | PL §2.4 (signed out) |
| WP01-A78 | TA, operator, SuperAdmin, visitor | Any page while admission is closed | See V23 part C. | "TravelMudra is closed for maintenance." No case data. No restore, reopen or resend control. | L or T (Q-01) | PL §2.4 (maintenance); BS B39, B40; UX §8.3 |
| WP01-A79 | TA | Any page at a capacity limit | Make a capacity limit apply (fixture). | The page says that the service is busy and that nothing was saved. It invents no wait time. It offers "Try again". | T | PL §5.1 (shell states); BS B38; UX §8.3 |
| WP01-A80 | TA | Any page while core cannot be reached | Make core unreachable (fixture). Load a page. Submit a form. | The page says that TravelMudra cannot be reached, that nothing was sent and to try again in a few minutes. It shows no zero, no empty list and no success. | T | UX §8.3; BS B33 |
| WP01-A81 | Any | Every error and refusal page in scope | Cause each refusal reachable on `lane-ui` (A27 to A38, A47 to A51, A73). Read the page. | The page names the error category and says what to do next. It shows a reference code where the text is a fallback. It echoes no request value (address, path, code). It never shows "Something went wrong", "Invalid data" or another forbidden label of §11.1. | L | PL §1.3 S7, §11.1 CR-01; BS B33 |
| WP01-A130 | Any signed-in persona | Gallery fixture with a polling region (no product page polls in WP-01) | (1) Let the poll answer 404. (2) Let the poll answer a redirect to a sign-in page. (3) Let the poll answer without the expected region. | In each case every poller of the page stops at once, the region's restricted content is removed, and the page navigates to its own address. The server then shows SH-02 Denied or the sign-in page. The old content never stays on screen. | T | WP-01.md A-01; PL §2.3 SH-R04, SH-R05; BS B10; review R-01 |

### 2.9 Operation status page and command-result patterns

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A82 | TA (`syn-ta-1`) | Receipt on a rebuilt page; 4650 `/ta/operations/:operationKey` | Perform a command on a page that uses the new receipt. Read the receipt. Open "Request reference [key]". Then reopen the receipt address while the operation read is unavailable (fixture). | The receipt shows "Request reference [key]" as a link and the resulting facts. An event time shows only under its own label (for example "Created [time] IST"). The receipt shows no command name and no accepted time: the item is partly met until P-02 is served. The status page shows "Request recorded", "Request [reference] was recorded once.", the resulting facts, "Open the result" where a page exists, and "Checked at [time] IST". When the read is unavailable, the receipt reads "Request reference [key]. The receipt cannot be checked now." and claims no acceptance. | L+T | PL §1.1 ACC, §7 (Check operation status); CMP-08; AD-04; WP-01.md §3 (Q-01, P-02), A-04; design §7.2, §7.5; review R-12 |
| WP01-A83 | TA, operator | A WP-01 form whose command the Core rejects (for example the code request at its rate limit, A36; an invalid enrolment code, A68) | Cause the rejection. Read the re-rendered form. | C2: the re-rendered form shows each reason in the error summary, with its owner or route. Safe input stays; a secret code never stays. No receipt appears. The status page never shows a rejection, because a rejected command leaves no operation record. | L | PL §1.1 REJ; UX §3.3; BS B35; design §7.2, §7.5; WP-01.md §3 (PM A83); review R-10 |
| WP01-A84 | TA | Operation status of an unresolved command | Inject a lost acknowledgement on a command (fixture). Open its status. | C4: the page shows "Checking the original result." and "Check status". It offers no new submission of the same intent and no external repeat. | T (Q-01) | PL §1.1 UNR, §1.4 C4; CMP-13; BS B35 |
| WP01-A85 | TA | Same page as A84 | Let the original resolve. Select "Check status". | The page reads the same operation key; the address does not change. It shows the final result. If the result updates in place, the polite region announces it and focus does not move. If the page reloads, the result is the first content after the `h1`. | T | PL §1.1 UNR; CMP-13; AC-09 |
| WP01-A86 | TA (`syn-ta-2`) | Operation status link of `syn-ta-1` | Signed in as `syn-ta-2`, open the link of A82. Then open a well-formed key that nobody used. Compare the two answers. | Both answer 200 with "Checking the original result" and "Nothing is recorded for request [reference] so far. It may still be recorded. Check its status again before you do anything else." The two answers are identical. No command name, result or fact of `syn-ta-1` shows. | L | BS B10; PL §2.3 SH-R05; design §7.5; WP-01.md A-08; review R-08 |
| WP01-A87 | Visitor | Operation status link of A82 | Sign out. Open the link. Sign in as `syn-ta-1`. | The link leads to sign-in, then back to the operation status page (SH-R03). The page does not answer "not found" to a signed-out owner (Q-06). | L | PL §2.3 SH-R03 |
| WP01-A88 | TA | Operation status page while the Recent operations read model is unavailable | Make the read model unavailable (fixture). Open a status link. | The page shows "Unavailable". It offers no new intent for the same purpose. It shows no "Accepted" or "Rejected". | T | AD-04; PL §6.1 (Recent operations) |
| WP01-A89 | Operator, SuperAdmin | 4652 `/ops/operations/:operationKey`, `/admin/operations/:operationKey` | Repeat A82 and A86 on the operator and SuperAdmin surfaces. As `syn-operator-1`, open the key of a `syn-superadmin-1` operation on `/ops/operations/[key]`, and the SuperAdmin's own link. | Same results as on the TA surface. On `/ops/operations/[key]` the operator gets the no-record answer of A86 (200), identical to an unknown key. No fact of the SuperAdmin's operation shows on either address. | L | BS B10; PL §7; WP-01.md A-08; review R-08 |
| WP01-A90 | Any | Every operation status address | Read the address bar. | The address holds only the opaque operation key. It holds no personal data and no search text. | L | PL §2.3 SH-R06; AD-04 |
| WP01-A91 | — | Component gallery | Render the gallery. Check each state of CMP-07 (hidden, shown with links), CMP-08 (accepted, partially accepted per item, rejected, unresolved), CMP-10 (policy pending, evidence pending, owner unknown), CMP-13 (checking, resolved accepted, resolved rejected), CMP-23 (test, production), CMP-27 (empty, filled, expired, locked) at 1440 and 390 px. | Each state renders with text, not colour alone. Each state passes the axe rule of section 2.11. CMP-10 follows the §11.3 template. Later packages reuse these components (lane PLAN §3, WP-01 lane addition). | T | PL §8.1; LP §3 (WP-01 additions) |
| WP01-A92 | Any | Every WP-01 page | Read all visible text, including buttons and errors. | No forbidden label of §11.1 appears. No logical writer name (Core, TA Delivery) appears in a button. No sender address (for example a `login@` address) appears. | L | PL §11.1 CR-01, CR-05; OC-06 |

### 2.10 Accessibility (AC-01 to AC-28 that apply) and V24

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP01-A93 | Keyboard-only TA | `/sign-in` to TA home, at 1440 and 390 px | With the keyboard only, request a code, use "Use a different address", request again, open an error-summary link, sign in, open the account menu, sign out. | Every step works with Tab, Shift+Tab, Enter, Space and Escape. No step needs a mouse or a hover. | L | AC-01, AC-12; UX §12 V24 |
| WP01-A94 | Keyboard-only operator | `/staff/sign-in` to My work, at 1440 and 390 px | With the keyboard only, sign in with the mailed code and the authenticator code, open Account, sign out. | Every step works with the keyboard only. | L | AC-01; V24 |
| WP01-A95 | Keyboard-only user | Every page in scope, at 1440 and 390 px and at 400% zoom | Tab through the page. | Every focused element shows a visible focus indicator with at least 3:1 contrast. No sticky top bar, rail, menu or label covers the focused element. | L | AC-02; PL §9 (Focus) |
| WP01-A96 | Phone user | `/sign-in`, code step, `/staff/sign-in`, staff code step, SH-02, operation status, `/account`, one shell page per role | View at 320 px width, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. All text and actions stay reachable. Only a wide table may scroll inside a labelled region. | L | AC-04; UX §7.3 |
| WP01-A97 | Any | Every form in scope | Inspect each input. | Each input has a visible label. The verification region has the visible label "Verification". | L | AC-05 |
| WP01-A98 | Any | Error states, environment label, current rail item, operation states | View in greyscale. | Each status has text (and an icon where the plan says so). No status is shown by colour alone. | L | AC-06 |
| WP01-A99 | Any | Every form in scope | Submit each form with an error. | Focus moves to the error summary. Each summary link moves focus to its field. Safe entered values stay (for example the email address). A secret field (mailed code, authenticator code, enrolment code) is empty after every re-render; the page never sends a secret value back. | L | AC-08; CMP-07; UX §3.3; WP-01.md A-12; review R-12 |
| WP01-A100 | Screen-reader user | Operation status page (A85); any in-page command result | Trigger a result that updates in place. | The polite region announces the result. Focus does not move. | L+T | AC-09; PL §2.1 (announcement region) |
| WP01-A101 | Phone user | Every page in scope at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px (WCAG 2.2 target size). Primary actions, the menu button and "Use a different address" are at least 44 × 44 CSS px. | L+T | AC-10 |
| WP01-A102 | — | Every page in scope | Measure contrast of text, focus indicators, the rail (light text on deep ink), the environment label, error and disabled states. | Normal text at least 4.5:1. Focus and non-text indicators at least 3:1. | L+T | AC-11; PL §9 (Contrast) |
| WP01-A103 | Screen-reader user | Any unavailable control on a WP-01 page (for example "Lost access to your email?") | Focus the control or the notice. | The reason is exposed to the screen reader (`aria-describedby` or the notice text in reading order). | L | AC-13; CMP-10 |
| WP01-A104 | Any | Rail menu, panels, focus transitions | Turn on "reduce motion" in the operating system. Open and close the rail menu and Help. | No transition or animation plays. | L | AC-14; PL §9 (Motion) |
| WP01-A105 | Screen-reader user | `/sign-in`, `/staff/sign-in`, one shell page per role | Read the page from the top. | The environment label is read (see A03). | L | AC-28 |
| WP01-A106 | TA and operator participants (people) | Sign-in on a phone at 390 px | Ask each participant to sign in, recover from one wrong code and say where the error is. Observe. | Record task success, errors, hesitation and the sample size. No target is invented. A participant who cannot find the error location is a finding. | L | UX §12 V24; AC-24 method |

### 2.11 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness MUST NOT take a screenshot of a page that shows a
code or an authenticator key.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP01-A107 | Visitor | 4650 `/sign-in` (fresh) | L | UX §7.5; AC-01 to AC-28 |
| WP01-A108 | Visitor | `/sign-in` (error summary shown, A27) | L | same |
| WP01-A109 | Visitor | `/sign-in` (PUB-02-S8, A34) | L | same; §14.1 |
| WP01-A110 | Visitor | `/sign-in` (PUB-02-S10, A33) | L | same; §14.1 |
| WP01-A111 | Visitor | `/sign-in/verify` (PUB-02-S9) | L | same; §14.1 |
| WP01-A112 | Visitor | `/sign-in/verify` (wrong code, A47) | L | same |
| WP01-A113 | Visitor | Sign-in not completed in this browser (A51) | L | same |
| WP01-A114 | Visitor | `/sign-in/help` (boundary notices) | L | same |
| WP01-A115 | Visitor | 4652 `/staff/sign-in` | L | same |
| WP01-A116 | Visitor | `/staff/sign-in/verify` (fresh and with errors) | L | same |
| WP01-A117 | Visitor | `/staff/enrol` | L | same |
| WP01-A118 | Operator | `/staff/enrol/setup` (the harness enrols and runs axe with screenshots off) | L (harness) | same; LD-11; architect decision WP-01.md §3 (PM Q-05) |
| WP01-A119 | TA | A TA shell page (TA home), 4650 | L | same |
| WP01-A120 | Operator | An operator shell page (My work), 4652 | L | same |
| WP01-A121 | SuperAdmin | A SuperAdmin shell page (Home), 4652 | L | same |
| WP01-A122 | Operator | `/account` (OP-10 sign-in and MFA part) | L | same |
| WP01-A123 | TA | `/ta/operations/:operationKey` (accepted) | L | same |
| WP01-A124 | Operator, SuperAdmin | `/ops/operations/:operationKey`, `/admin/operations/:operationKey` | L | same |
| WP01-A125 | TA, operator | Operation status (unresolved, unavailable) | T | same |
| WP01-A126 | TA | SH-02 denied and not found, 4650 | L | same |
| WP01-A127 | Operator | SH-02 denied and access changed, 4652 | L | same |
| WP01-A128 | Any | SH-02 maintenance, 4650 and 4652 | L or T (Q-01) | same |
| WP01-A129 | TA | Help panel open; rail menu open at 390 px | L | same |

## 3. Proof scenario V23

V23 (UX §12): "Projection outage reports uncertainty without fabricated zero/success; authoritative commands
continue only when required current evidence/controls work. Maintenance/restore remains closed." Sources: BS B33,
B38, B39, B40; UX §3.3, §8.3; PL §1.2 D7, §2.4 SH-02; LD-08.

Where each part is shown follows the architect's decision (WP-01.md §3, P-W01): part B is proven by test; part C is
proven by test until proposal P-03 gives the orchestrator an admission control on `lane-ui`. Freshness wording follows
the amended LD-08 lag form (WP-01.md §3 Q-10; design §7.4).

### Part A. Baseline (L)

| Step | Action | Observable result |
|---|---|---|
| A1 | Sign in as `syn-ta-1` on 4650. Read the rail counts, the Notices count and the freshness line of a list page. | Counts show numbers. The freshness line shows "Up to date when read at [time] IST" or "Behind by [n] s when read at [time] IST". Record the values in the run record. |
| A2 | Open the operation status page of a recent `syn-ta-1` command. | "Request recorded" with "Checked at [time] IST". |
| A3 | Sign in as `syn-operator-1` on 4652 in a second browser. Read My work counts. | Counts show numbers. |

### Part B. Projection outage (T)

| Step | Action | Observable result |
|---|---|---|
| B1 | Stop or fail the projectors of core while the other facilities stay up (the system-test pattern "core restarted with its audit projector failing" exists in `test/system/ported-pages.test.ts`). | Projection health reports degraded. |
| B2 | Reload the TA page of A1. | No rail count, Notices count or list total shows "0". Each unreadable count shows "Unavailable" (A21). The freshness line shows "Freshness unavailable" or "Behind by [n] s when read at [time] IST". It never shows an as-of time computed from the lag. |
| B3 | Open a projection-backed list (for example the TA applications list). | The page shows no "No applications" empty state and no zero total. It shows the S4 or S5 state with the known facts only. |
| B4 | Sign out and sign in again as `syn-ta-1`. | Both succeed: identity is authoritative and does not depend on a projection. |
| B5 | Open the operation status page of A2. | It still shows "Request recorded" with "Checked at [time] IST" (authoritative read). |
| B6 | Perform one command whose required controls are authoritative (for example create a group). | The command is accepted with a receipt from the writer (reference and resulting facts, A82). The page claims nothing that the writer did not confirm. |
| B7 | As `syn-superadmin-1`, try a privileged elevation while the audit projection is behind; then a containment action (for example suspend an account, then restore it). | Elevation is unavailable with the reason that the audit record is behind. Containment still works. |
| B8 | Restore the projectors. Reload. | Counts and "Up to date when read at [time] IST" return. No fact is duplicated. |

### Part C. Maintenance and restore (T until P-03 is served; then L through the orchestrator)

| Step | Action | Observable result |
|---|---|---|
| C1 | Close admission on `lane-ui` (orchestrator; `tm admission close` is not a lane step). | — |
| C2 | As the signed-in TA, reload any page on 4650. | SH-02 maintenance: "TravelMudra is closed for maintenance." No applicant, application, group, count, notice or name of another person shows. No restore, reopen, retry or resend control shows. The page has no account menu, no support-view banner and no form, also for a session resolved before maintenance began (A-09). The environment label and the "[TEST]" title prefix show. The HTTP status is 503 with `Retry-After`. |
| C3 | As the signed-in operator and SuperAdmin, reload a page on 4652. | Same as C2. The SuperAdmin sees no "Reopen" control. |
| C4 | Signed out, request a sign-in code on 4650 and on 4652. | The maintenance message shows. No code arrives in the synthetic mailbox. |
| C5 | Open the operation status link of A2. | The maintenance message shows. No result shows. |
| C6 | Open the public home page `/`. | The static public page is served and holds no case data. Its "Sign in" leads to the maintenance message (design §5; PM Q-10 agreed). |
| C7 | Restart the installation while admission is closed (`uat.py stop`, `uat.py start`, orchestrator). Reload. | Maintenance continues after the restart. |
| C8 | Open admission (orchestrator). Reload the pages of C2 to C5. | Pages return. No command made during maintenance shows as accepted. No sign-in code arrives late for the C4 requests. |
| C9 | Restore a recovery set (system test). | The restored installation stays closed. Old sessions and old codes do not work (A59). |

### Part D. Result

V23 passes when every step of parts A to C shows its result, at the integrated WP-01 commit, on `lane-ui` or in the
named test, as the architect decided (part B by test; part C by test until P-03 is served). The run record names each
test and the `lane-ui` ref.

## 4. Out of scope and boundaries

These MUST NOT appear on any WP-01 page:

- Account-existence disclosure in any text, field state, HTTP status or redirect of the sign-in, staff sign-in,
  enrolment or error pages (BS B08; CR-04).
- A sign-in code or an authenticator key in a page (other than the one-time enrolment key page), URL, title, log,
  screenshot or evidence file (BS B08; LD-11).
- Self-registration or an account-request form (AD-05; OC-10; B-01).
- A lost-mailbox recovery path. Only the boundary notice appears (BS B09, B44; B-02).
- "Sign in as", impersonation, an administrator view of codes, or a password set by an administrator (BS B08, B11).
- A password field on the TA path (BS B08).
- A bot-check bypass, a "skip verification" control, or a fixed test sign-in code (BS B08; TR §3.1 Q-1: the
  synthetic mailbox stays; UAT-03 is P2 and out of scope).
- Support hours, response times, telephone numbers or escalation promises (UX §9 C13).
- A logo image; the text wordmark stays until C01 (UX §9 C01).
- Sender addresses in the interface (OC-06).
- A "read" or "unread" marker on notices (LD-06).
- A restore, reopen, retry or resend control on the maintenance page (BS B39, B40).
- A rail destination for a PARKED capability, such as an Accounts dashboard (BS B29, B43).

Not in WP-01 (later packages): the rebuilt home pages TA-01, OP-01 and SA-01 (only their shell is checked here);
the notices list and the accounting-grant section of OP-10 (WP-15); the TA email-change pages TA-12 (WP-15); the
support view and its banner SH-R09 (WP-15); the public pages PUB-01 and the crawl check (WP-20); the bot-check
removal from the bulk and correction forms (UAT-08, bulk lane).

## 5. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P0 | How are V23 (projection outage, maintenance) and the UNR result shown? `uat.py` has no admission or fault control, and lane prompts forbid `tm` steps by hand. UI-PLAN §12 needs ACC, REJ and UNR shown on every page of the package. | The acceptance run reaches V23 step B1 or C1 and cannot cause the condition on `lane-ui`. WP-01 cannot reach "done" (V23), and later packages inherit the gap. Likelihood: certain without a decision. | Maintenance on `lane-ui` through the orchestrator (`tm admission close/open`, or a `uat.py maintenance` proposal). Projection outage and UNR through named system tests with fault injection. Record the split in `WP-01.md`. |
| Q-02 | P1 | During the transition (LD-02, LD-03), what does the rail show for a §2.2 destination whose page is not rebuilt yet (for example SuperAdmin "Work queues", operator "Incidents and follow-up")? | Max selects a rail item and lands on an old page with an old title, or on "not found". A05 to A07 then fail, or the rail reads as broken. Likelihood: high, from WP-01 until the last package. | Each §2.2 label links to the existing page that serves the purpose. A destination with no page yet is left out, and the record lists it. |
| Q-03 | P1 | When a count cannot be read, does the rail show visible "Unavailable", or only accessible text? Today `nav-counts.ts` leaves the count out ("shows none, never zero"). | During a projection outage, the TA sees no badge on Notices and concludes that nothing needs action, while a travel-risk notice waits. That is a fabricated zero in effect (D7, V23). Likelihood: low frequency, high impact. | A visible short marker (for example "–" with the accessible text "count unavailable") on each affected item, plus the freshness line. |
| Q-04 | P1 | AD-08 puts a "TravelMudra staff" path on PUB-02. Staff sign-in is served only on the staff host (private network). Does the edge sign-in page link to the staff host? | In production a public page links to a private host address. Crawlers and the public see the staff address; the link fails for them. Likelihood: certain if AD-08 is built literally. | No staff link on the edge host. Staff use their own bookmarked staff address. Record this as a change to AD-08. |
| Q-05 | P1 | How is the authenticator enrolment (A67 to A69, A118) proven? The setup page shows a new key. LD-11 forbids any screenshot, log or storage of a key. A new staff account on `lane-ui` is also needed. | The harness takes the axe screenshot of `/staff/enrol/setup` and stores a key in the evidence folder. Likelihood: medium if not stated. | Max runs enrolment by hand on `lane-ui` once. The harness runs axe on that page with screenshots disabled. Tests cover the refusals. |
| Q-06 | P2 | A signed-out request for an operation status page answers "not found" today (`src/apps/shared/common-routes.ts` line 37). SH-R03 says a signed-out deep link goes to sign-in. Which applies? | A TA bookmarks a status link, the session expires, and the TA sees "not found" for their own operation. Likelihood: medium. | Apply SH-R03 (A87). |
| Q-07 | P2 | The plan has a distinct "This code has expired" message. The built text merges "invalid or expired". Which passes A47 and A48? | A distinct "expired" message for a code that was never sent (unknown address) is misleading; a merged message is less specific. Likelihood: every expired code. | Keep one neutral message that offers "Request a new code" in one action. |
| Q-08 | P2 | Do PUB-02-S8, S9 and S10 apply to the staff path too? §14.1 speaks of "the TA". | Staff press Back and get "form already used" with no recovery. Likelihood: medium. | S8 and S10 apply (same form design). S9 MAY apply; the record says which. |
| Q-09 | P2 | Does "Use a different address" show an empty field or the previous address? | The TA wants to fix one typo and has to retype the address. Likelihood: high, low impact. | Prefill the previous address in a fresh form. |
| Q-10 | P2 | During maintenance, do the static public pages stay served? | A visitor sees the home page but "Sign in" leads to maintenance. Harmless; it only needs one stated behaviour for C6. | Serve the static pages. Sign-in pages show maintenance. |
| Q-11 | P2 | Is A56 (signed out after email change) a test only, or also a `lane-ui` step with `syn-ta-3` and a change back? | The change alters a shared synthetic account during other testers' work. Likelihood: low. | Test only. |

## 6. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Browsers and versions | |
| Assistive technology used | |
| V23 result (parts A, B, C; where shown) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP01-A01 | | | |
| WP01-A02 | | | |
| WP01-A03 | | | |
| WP01-A04 | | | |
| WP01-A05 | | | |
| WP01-A06 | | | |
| WP01-A07 | | | |
| WP01-A08 | | | |
| WP01-A09 | | | |
| WP01-A10 | | | |
| WP01-A11 | | | |
| WP01-A12 | | | |
| WP01-A13 | | | |
| WP01-A14 | | | |
| WP01-A15 | | | |
| WP01-A16 | | | |
| WP01-A17 | | | |
| WP01-A18 | | | |
| WP01-A19 | | | |
| WP01-A20 | | | |
| WP01-A21 | | | |
| WP01-A22 | | | |
| WP01-A23 | | | |
| WP01-A24 | | | |
| WP01-A25 | | | |
| WP01-A26 | | | |
| WP01-A27 | | | |
| WP01-A28 | | | |
| WP01-A29 | | | |
| WP01-A30 | | | |
| WP01-A31 | | | |
| WP01-A32 | | | |
| WP01-A33 | | | |
| WP01-A34 | | | |
| WP01-A35 | | | |
| WP01-A36 | | | |
| WP01-A37 | | | |
| WP01-A38 | | | |
| WP01-A39 | | | |
| WP01-A40 | | | |
| WP01-A41 | | | |
| WP01-A42 | | | |
| WP01-A43 | | | |
| WP01-A44 | | | |
| WP01-A45 | | | |
| WP01-A46 | | | |
| WP01-A47 | | | |
| WP01-A48 | | | |
| WP01-A49 | | | |
| WP01-A50 | | | |
| WP01-A51 | | | |
| WP01-A52 | | | |
| WP01-A53 | | | |
| WP01-A54 | | | |
| WP01-A55 | | | |
| WP01-A56 | | | |
| WP01-A57 | | | |
| WP01-A58 | | | |
| WP01-A59 | | | |
| WP01-A60 | | | |
| WP01-A61 | | | |
| WP01-A62 | | | |
| WP01-A63 | | | |
| WP01-A64 | | | |
| WP01-A65 | | | |
| WP01-A66 | | | |
| WP01-A67 | | | |
| WP01-A68 | | | |
| WP01-A69 | | | |
| WP01-A70 | | | |
| WP01-A71 | | | |
| WP01-A72 | | | |
| WP01-A73 | | | |
| WP01-A74 | | | |
| WP01-A75 | | | |
| WP01-A76 | | | |
| WP01-A77 | | | |
| WP01-A78 | | | |
| WP01-A79 | | | |
| WP01-A80 | | | |
| WP01-A81 | | | |
| WP01-A82 | | | |
| WP01-A83 | | | |
| WP01-A84 | | | |
| WP01-A85 | | | |
| WP01-A86 | | | |
| WP01-A87 | | | |
| WP01-A88 | | | |
| WP01-A89 | | | |
| WP01-A90 | | | |
| WP01-A91 | | | |
| WP01-A92 | | | |
| WP01-A93 | | | |
| WP01-A94 | | | |
| WP01-A95 | | | |
| WP01-A96 | | | |
| WP01-A97 | | | |
| WP01-A98 | | | |
| WP01-A99 | | | |
| WP01-A100 | | | |
| WP01-A101 | | | |
| WP01-A102 | | | |
| WP01-A103 | | | |
| WP01-A104 | | | |
| WP01-A105 | | | |
| WP01-A106 | | | |
| WP01-A107 | | | |
| WP01-A108 | | | |
| WP01-A109 | | | |
| WP01-A110 | | | |
| WP01-A111 | | | |
| WP01-A112 | | | |
| WP01-A113 | | | |
| WP01-A114 | | | |
| WP01-A115 | | | |
| WP01-A116 | | | |
| WP01-A117 | | | |
| WP01-A118 | | | |
| WP01-A119 | | | |
| WP01-A120 | | | |
| WP01-A121 | | | |
| WP01-A122 | | | |
| WP01-A123 | | | |
| WP01-A124 | | | |
| WP01-A125 | | | |
| WP01-A126 | | | |
| WP01-A127 | | | |
| WP01-A128 | | | |
| WP01-A129 | | | |
| WP01-A130 | | | |
| WP01-A131 | | | |
| V23 proof | | | |
