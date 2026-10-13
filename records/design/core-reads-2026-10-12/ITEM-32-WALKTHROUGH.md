# ITEM-32 walk-through for Max: evidence on every gate exception grant, on `lane-max`

What changed (built, held): every new gate exception grant names one to five evidence references. Each reference is
an outside record (`external_reference`) or the SuperAdmin's own statement (`attestation`); a statement alone is
accepted (your decision of 13 October 2026). Core refuses a grant without evidence. The exception row and its grant
fact keep the list, and it never changes. Only the SuperAdmin reads the evidence, the grantor, the grant time and the
reason, on the SuperAdmin case read (`exceptionRecords` of `core.admin_case`). The operator's case read never carries
them. Exceptions granted before the change keep an empty list and read as "evidence not recorded".

The Core commit is held on branch `held/gate-exception-evidence`. Walk this through only after the UI lane's two grant
forms (the new grant form and the carried generic form on the old case page) are integrated with it. Before that, the
old form posts no evidence and every grant is refused with a field error on `evidence` (the system tests that post the
form fail for that reason).

## Before you start

- The orchestrator deploys the integrated commit (Core commit plus the UI forms) to `lane-max` with `uat.py deploy`.
  Data and accounts stay. The migration `1190_core_gate_exception_evidence` runs during that deploy.
- Tunnel: `ssh -N -L 4620:127.0.0.1:4620 -L 4622:127.0.0.1:4622 max-stravion@100.95.27.21`.
  Staff `http://127.0.0.1:4622/staff/sign-in`.
- Accounts: `syn-superadmin-1@synthetic.test`, `syn-operator-1@synthetic.test`.
- You need two submitted applications of `syn-ta-1` with no service payment recorded and no operator (`app_A`,
  `app_B`). An exception granted on the earlier build, if one is still open on `lane-max`, shows part D.

## A. A grant needs evidence

| # | Who, where | Do | Expect (the facts to look for) |
|---|---|---|---|
| A1 | SuperAdmin, `/admin/applications/<app_A>` | Grant a Gate 1 exception for assignment with a reason and no evidence row. | Refused. The form shows a field error on the evidence ("required"). No exception appears. No `core.gate_exception_granted` fact on `/admin/audit`. |
| A2 | Same page | Grant it again with one external reference, for example id `SYN-BANK-REF-1`, note `Transfer slip seen`. | Accepted. The exception appears with its evidence: one external reference, id and note as typed (spaces trimmed). |
| A3 | SuperAdmin, `/admin/audit/gate_exception/<gex>` | Open the exception's audit record. | One `core.gate_exception_granted` fact. Its evidence count is 1. |

## B. A statement alone is accepted

| # | Who, where | Do | Expect |
|---|---|---|---|
| B1 | SuperAdmin, `/admin/applications/<app_B>` | Grant a Gate 1 exception for assignment with one statement only, for example id `SYN-CALL-TA-1`, note `Agent said the transfer is on its way`. | Accepted. The evidence shows the kind "statement" (attestation), so a reader sees that the basis is a statement, not an outside record. |
| B2 | Same page | Look at the service payment. | Still not received. A statement documents the exception decision only; it records no payment. |
| B3 | Same page | Try a sixth evidence row, or a note with a mail address or a link. | Refused with a field error on that row; nothing recorded. |

## C. Who sees the evidence

| # | Who, where | Do | Expect |
|---|---|---|---|
| C1 | SuperAdmin, `/admin/applications/<app_A>` | Assign `syn-operator-1` (the exception from A2 is consumed). | Accepted. The SuperAdmin case still shows the exception with its evidence, grantor, time and reason. |
| C2 | Operator, `/ops/applications/<app_A>` | Open the case. | The exception may be listed (gate, action, state, expiry). No evidence, no reason and no grantor of it appear. |

## D. An exception granted before the change

| # | Who, where | Do | Expect |
|---|---|---|---|
| D1 | SuperAdmin, the case of an exception granted on the earlier build | Open the case. | The exception reads "Evidence: not recorded. This exception was granted before evidence was required." It never reads as "no evidence needed". |
| D2 | Same case, if that exception is still open and not expired | Assign, or revoke it. | Both still work. Its evidence stays empty. |

If no earlier exception exists on `lane-max`, part D is covered by automated tests only.

## Facts for the release record

- The expiry bound of the earlier open exceptions is read from the stored rows at the cutover, not computed from today's
  time to live: `SELECT max(expires_at) FROM core_gate_exceptions WHERE state = 'granted' AND evidence = '[]'::jsonb;`
  An expired earlier exception keeps `state = 'granted'` (no sweep writes `expired`) and still blocks a new grant for the
  same gate and action until a SuperAdmin revokes it.
- Recovery after admission reopens is fix-forward only. A code rollback to an earlier release is refused
  (`schema_incompatible`); an earlier writer also fails the NOT NULL evidence column.

## Not in this walk-through

- The page words, the evidence rows of the two forms, the receipt and the legacy text are the UI lane's.
- A replay of a grant the earlier build committed, under its operation key, is proven by an automated test only.
