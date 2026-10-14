# ITEM-04 walk-through for Max: a passport is shared only with its own applicant's applications

## What changed

When an operator receives a physical passport, Core records it once in the group, keyed to the applicant's passport.
The operator can then share that record with another application of the group, so that the passport also holds that
application's completion. Before this change the share accepted any application of the group: a passport could be
shared with another person's application, and Core then counted that person as holding a passport that is not theirs.

Now a passport record is shared only with an application of the applicant whose passport it is. A share to another
applicant's application is refused with `passport_identity_mismatch`, and nothing is written. Other items (any type that
is not a passport) are shared as before. The other refusals of the share (preparation-only service, a service without
a physical route, another operator's application) are unchanged.

Only the guard is built. The corrections of a wrong record (unlink, move, void and the others) wait for your decisions
on Q1 to Q8.

## What you can try on `lane-max` after the package deploy

You need one group with three applications of a paper service (the synthetic business paper or paper-return offering),
all assigned to `syn-operator-1@synthetic.test`:

- applicant A with two applications (two different paper offerings, the same passport number);
- applicant B with one application.

1. As the operator (`http://127.0.0.1:4622/staff/sign-in`), open A's first application and record the receipt of A's
   passport (attest possession).
2. From the passport record, share it with A's second application. Expected: accepted; the second application now shows
   the passport as held.
3. Share the same record with B's application. Expected: refused. The page shows the code
   `passport_identity_mismatch` with a general message until the UI lane adds its sentence (package message).
4. Optional: the record is unchanged after the refusal (same links; B's application holds no original).

If creating two applications of one applicant on `lane-max` is awkward, the test transcript is enough:

```bash
export TMPDIR=/tmp/claude-1000/walk && mkdir -p $TMPDIR && node --test --test-reporter=spec --test-global-setup=test/support/global-setup.ts test/operations/original-link-identity.test.ts
```

## What is not covered

- A passport number corrected after the receipt: a share to the same person's other application is refused, because
  the record keeps the receipt's key. The move correction that would fix this is not built; the operator records a new
  receipt on the other application meanwhile (ITEM-04.md §5).
- Records that an earlier release already shared with the wrong applicant stay as they are; only a correction can end
  such a link.
