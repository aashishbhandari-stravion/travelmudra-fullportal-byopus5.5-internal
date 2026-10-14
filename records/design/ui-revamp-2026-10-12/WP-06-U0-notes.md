# WP-06 U0 notes: queue components and the SuperAdmin application context

Unit U0 of WP-06. Author: the U0 engineer, 13 October 2026. Input for the architect's integration, the gallery
registration and the `DESIGN.md` update. U0 commits nothing; the architect integrates. Base: lane commit b2a6341.
Binding inputs: `WP-06-design.md` §1.6 (CMP-06, CMP-26, inbox group), §2.0, §2.1 (caps), §2.2.1, §2.3, §2.5, §2.7.2
to §2.7.4, §4.6, §4.7, §5, §7.1 (U0 row); `WP-06.md` §3 and §4.1 to §4.5 (D-13: partition truncation parked; the
brief adds "a part of a capped list says shown").

## 1. Files

| File | Change |
|---|---|
| `src/web/ui/queues.ts` (new) | CMP-06 `queueTable`, CMP-26 `batchBar`, `inboxGroup`; the count helpers. |
| `src/web/ui/index.ts` | One `export * from './queues.ts'` line appended. |
| `static/css/components.css` | One marked block appended at the end, in its own `@layer components { }` block (about 200 lines). No existing rule changed. Tokens only; no new colour. |
| `src/apps/staff/core/admin-context.ts` (new) | Header facts, status facts, the Gate 1 code table and gate exception words, from `core.admin_case`. |
| `scripts/dev/gallery/queues.ts` (new) | 3 gallery pages; `queuesGalleryPages()`; exports the fixture `galleryAdminCase`. Not registered. |
| `test/unit/web/queues.test.ts` (new) | 42 tests. |

## 2. APIs

```ts
// Counts (src/web/ui/queues.ts)
type CountUnit = { one: string; other: string };              // APPLICATIONS = application / applications
type QueueCount = { state: 'exact'; n } | { state: 'at_cap'; max } | { state: 'shown'; n; max } | { state: 'unavailable' };
listCount(rows: readonly unknown[] | null | undefined, max): QueueCount   // null → unavailable; length ≥ max → at_cap
partCount(n, source: readonly unknown[] | null | undefined, max): QueueCount // source at max → shown, else exact
knownCount(n: number | null | undefined): QueueCount          // a count Core computes (monitors); null → unavailable
countText(c, unit?): string   // "3 applications", "200 or more applications", "37 applications shown", "Unavailable"
countState(c); isKnownZero(c) // only an exact 0 is a known zero; "0 shown" is not

queueTable<Row>(o: {
  id; caption; captionVisible?; rows;
  application: (row) => { id; applicant; href; service; group?: { label; href? } };
  reason?: { header? /* "Why it waits" */; render };  facts?: { key; header; render }[];
  action?: (row) => { label; href } | null;  moreActions?: (row) => { label; href }[];
  selection?: { name /* "item" */; selected?: string[] };
  empty: { title; body };  filter?: { active; clearHref };
  cap?: { max; read; order? /* "oldest" */; more? };  unit?: CountUnit;
}): SafeHtml
batchBar(o: { id; queueId; name; title; unit?; fields: SafeHtml; actions: SafeHtml }): SafeHtml
inboxGroup(o: {
  id; title; count?: { value: QueueCount; unit }; total?: { value: number | null; unit? };
  lines?: ({ label; count: QueueCount; unit?; link? } | { text })[];
  items?: { label; href?; details?; action?: { label; href; context } }[];   // at most INBOX_ITEM_LIMIT = 5
  notes?: Renderable[]; links?: { label; href }[]; headingLevel?: 2 | 3;
}): SafeHtml
```

Queue table states (`data-queue-state`): `rows`, `empty` (S2, the page's copy), `no_match` (S3 "No application matches
this filter." and "Clear the filter"); `data-queue-capped="true"` at the limit. The line above the table:

| Situation | Line |
|---|---|
| Rows, below the limit | "[n] applications shown." |
| Whole list at the limit (`rows.length = read ≥ max`) | "This list shows the oldest [max] applications. More may be waiting. [more]" |
| Part of a list at the limit (filter or partition) | "[n] applications shown, from the oldest [max] applications read. More may be waiting." |
| No rows, list at the limit | "None shown, from the oldest [max] applications read. More may be waiting." (never the S2 copy) |

No line states a total. Each row: the applicant link (row header), service, group link, the reference with copy; each
selection box is labelled "Select[ hidden: [applicant], application [reference]]" (visible word "Select"); action
links carry the applicant as hidden context. On a narrow container a selectable row is a card with the box beside the
applicant. A `selected` id that is not a row is ignored, never echoed.

Batch bar: `role="group"` labelled by its `h3`; `output[data-batch-count]` reads "Selected applications are listed on
the next page." without JavaScript; a "Select every application on this page" box is rendered `hidden` with an empty
name (never submitted); hooks `data-batch-bar`, `data-batch-for` (the queue id), `data-batch-name`, `data-unit-one`,
`data-unit-other`. Never fixed or sticky (test reads the CSS).

Inbox group: `h2`; count line (`data-count-state`); "Unavailable" with "This count cannot be read now." (items hidden,
links kept, `data-inbox-state="unavailable"`); "[max] or more" at the limit; lines "[label]: [count]" each standing
alone; one note when any count is "shown": "Counts marked “shown” cover only the first [max] read. More may be
waiting."; "[n] [unit] in total" or "In total: Unavailable". Nothing is ever summed.

```ts
// src/apps/staff/core/admin-context.ts
type AdminCase = QueryView<'core.admin_case'>;
applicantName(v); accountName(v, id); applicationHref(id)
WORK_QUEUE_CRUMBS; assignmentCrumbs(v)            // Work queues › Assignment › [applicant → /admin/applications/<id>]
applicationMeta(v): MetaItem[]                    // Application (reference, copy), Service, Group (link), Travel agent (+ "(account suspended)")
type ApplicationFactKey = 'progress' | 'operator' | 'operator_now' | 'service_payment' | 'help_request' | 'next' | 'readiness'
applicationFact(v, key, label?); applicationFacts(v, keys | { key, label }[])
ASSIGN_FACTS (SA-03a), REASSIGN_FACTS (SA-03c), GATE1_EVIDENCE_FACTS (SA-09g)
servicePaymentText(status)                        // Received / Not received / Not recorded / Unrecognised state
GATE1_CODES; isGate1Code(code); codeWords(code): { code; text; known }; codeLine(w)   // unknown: sentence + "Reference code: [code]"
splitGate1(codes): { gate1; other }; assignBlockers(assignOffer): { state: 'allowed' | 'blocked' | 'not_offered'; gate1; other }
exceptionWords(row): { id; gate; action; state; expiresAt }; grantedException(v, gate, action); exceptionOf(v, gexId)
```

Fact words: Operator "None" or the name ("An account" when Core sends no name); Operator now adds "Not active" only when
`pending.reasonCode = assigned_operator_inactive`; Service payment `unrecorded` is a not-recorded fact, an unknown value
or `null` an unavailable fact ("Unrecognised state (reference code …)"); Help request None / Requested / Approved /
Declined / Help given; Next "[owner label] ([name]): [reason sentence]"; Readiness Recorded and current / Not recorded /
Out of date / Held / Recorded by the previous operator. Exception states: Granted, not used / Used / Expired / Revoked;
unknown values read "Unrecognised (reference code …)". The Gate 1 table holds the four codes Core reports for Gate 1
(`gate1_payment_not_received`, `gate_exception_stale`, `_expired`, `_grantor_inactive`); a test pins them to
`REASON_CODES`.

## 3. Decisions within the unit

- `queueTable` adds a "[n] applications shown." line below the limit (not in the design's CMP-06 text). Reason: the
  acceptance rows A13, A25 and A120 ask for a result count; "shown" is always true and is never a total.
- The cap wording is the design's ("This list shows the oldest …"); the page passes `order: 'oldest'` (Core orders the
  four queues by `created_at`). Without `order` the line names no order.
- An empty part of a capped list never shows the S2 copy (it could claim "nothing waits" while more wait).
- `inboxGroup` takes the total as `number | null` (null → "In total: Unavailable"); the page omits it when the
  monitors read failed (design §2.1).
- The CSS block sits after the back/forward-cache rule, in a second `@layer components` block. It sets no
  `visibility`, so the cache rule still wins. The architect MAY move it before that rule to keep the earlier
  convention ("that rule stays last").

## 4. Items for the page units

| Unit | Item |
|---|---|
| U1 (SA-01) | Use `listCount`/`partCount`/`knownCount`; zero groups by `isKnownZero` only. Group 1/2 partitions of a capped assignment queue read "shown". Lag line: build it from `freshnessText` as text (a note is a `<p>`; do not pass `freshness()`, which is a `<p>`). Group 10 incidents filtered by the reader rule is a part of a 500-row read → `partCount`. |
| U2 (SA-02) | Wrap the "Waiting" `queueTable` (with `selection: { name: 'item', selected }` from the address) and `batchBar` in one GET `form` to `/admin/assignments/selection/preview`; fields via `choiceGroup` (radio `mode` none preselected, checkbox `operator`). Pass `cap: { max: 200, read: rows.length (Core's, before the filter), order: 'oldest', more }` to both sections; `filter: { active, clearHref }`. Payment column: `servicePaymentText`. No `selection` on "Operator no longer active" or when `operators` is empty. |
| U3 (SA-03) | Header: `assignmentCrumbs`, `applicationMeta`; facts `ASSIGN_FACTS` / `REASSIGN_FACTS`; item 4 groups from `assignBlockers(v.assignOffer)` (`codeLine` per blocker); plan rows: `splitGate1(row.blockers)`. Exception sentence on SA-03a: `grantedException(v, 'gate1_service_payment', 'assign')`. |
| U4 (SA-09) | Evidence facts `GATE1_EVIDENCE_FACTS`; revoke evidence `applicationFacts(v, [{ key: 'service_payment', label: 'Service payment now' }, { key: 'operator', label: 'Operator now' }])`; subject by `exceptionOf`; table rows by `exceptionWords`. |

## 5. Open items for the architect

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| Batch bar script | P2 | With JavaScript the line still reads "Selected applications are listed on the next page." and the "select every" box stays hidden; no "[n] selected on this page" announcement (design CMP-26, AC-16; acceptance A22 and A120 word it "Selected on this page: [n] applications"). | `static/js/enhance.js` (not U0's file): for `[data-batch-bar]`, show `[data-batch-select-all]`; count the checked `input[name=<data-batch-name>]` inside `#<data-batch-for>`; set the output to "[n] selected on this page" with the unit; announce through `#toast-region`; the select-every box toggles only those boxes. The architect settles the wording difference with the acceptance. |
| "Synthetic" header fact | P2 | Acceptance A31 lists "Synthetic" in the SA-03a meta; `core.admin_case` returns no synthetic flag, so the context cannot state it (only facts Core returns). The environment label already says "Test environment. Synthetic data only." | Park, or a Kind 1 request for a synthetic flag on the staff case. |
| Breadcrumb hrefs | P2 | "Work queues" and "Assignment" both link to `/admin/queues/assignment` (the destination has no page of its own). | Keep (design §1.3), or drop the "Work queues" crumb at integration. |
| Crawl record | — | Any change to `static/css/*.css` makes `test/unit/seo-record.test.ts` stale until the record is regenerated from the integration commit (as after earlier style sheet changes). | The architect regenerates it after the commit. |
| Gallery registration | — | `queuesGalleryPages()` (queue-table.html, inbox-groups.html, application-context.html) is not in `scripts/dev/gallery-pages.ts`. | Register it. |

## 6. Checks run

- `npm run typecheck`: pass. `npx eslint --max-warnings=0` on the five changed TypeScript files: pass.
- `node --test test/unit/web/queues.test.ts`: 42 tests, 42 pass.
- `node --test "test/static/**/*.test.ts"`: 74 tests, 74 pass.
- Gallery rendered once through a local script (outside the repository) with the product CSP: the three pages at 1440,
  390, 360 and 320 px in light and dark: no horizontal overflow, no CSP violation, no script error; axe (WCAG 2.2 A/AA
  and best practice) at 1440 and 390 px: no violation of any impact. Screenshots inspected at 1440 and 390 px.
- `npm run test:ui` (after the CSS change): 2139 tests, 2138 pass, 0 fail, 1 todo (the existing passport-number todo
  in `individual-intake.test.ts`). During that run about 27 files outside this unit (edge and shared travel-agent
  pages, their tests, three gallery modules) changed in the working tree by another writer; the run saw a mixed tree.
  `npm run typecheck` and the 42 unit tests pass again on the tree after those changes. U0 touched none of them.
