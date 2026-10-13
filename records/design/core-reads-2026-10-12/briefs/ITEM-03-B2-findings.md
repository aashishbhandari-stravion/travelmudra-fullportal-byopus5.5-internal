# Addendum to ITEM-03-B2: findings of the first attempt (read from source; verify only where you depend on them)

The first engineer stopped at the context limit after reading; nothing was written. Use these findings; do not repeat
the survey.

1. `startOpsKit()` calls `useTestDatabase()` itself (a clone of the head template). The kit cannot run on a database you
   migrate yourself. For the product cases (L2, L3, L4, L6, V2) use the fallback: drop C4, write the legacy mark, re-add
   C4 `NOT VALID` with the exact text of `1170`.
2. Write the legacy resolution through a real command: define in the test a `CommandDef` named
   `core.resolve_protection_mark` that copies the earlier resolver (`git show e41d64f:src/modules/core/commands/admin.ts`,
   `resolveProtectionMark`: input `{ applicationId, markId, evidence, reason }`, the UPDATE without the filing columns,
   the application revision + 1, the fact `after: { state: 'resolved' }`). Run it with `runCommand` (as the kit runs
   commands) as SuperAdmin `sa1` while C4 is dropped, then re-add C4 `NOT VALID`. This writes a real `sys_operations` row,
   fact and revision. L6 then sends the same input and key to the product's `core.resolve_protection_mark` and expects a
   replay (`replayed: true`); the earlier input has no `filing` key, so the content hash is unchanged.
3. An active mark with `possibly_filed = true`: insert it with Core's `recordProtectionMark` in a harness transaction or
   by SQL; it needs a `sys_restores` row (`test/delivery/kit.ts` `protect()` shows the pattern).
4. L1 needs a database migrated to `1160`: `createEmptyDatabase()` plus a copy of the migrations tree without `1170`
   (`treeWith` in `test/ops-tooling/migrate-to-target.test.ts` copies the whole tree; filter `1170` out). A real
   application chain at `1160` is heavy: in that scratch database, drop the foreign keys of `core_applications` and
   `core_protection_marks`, insert minimal rows, then `migrate()` with the full tree. Say so in a test comment.
5. The fee act: the default `evisa` offering has `timing: separate_act`, so `authorize_government_fee_payment` needs a
   `feeAmountPaise`. `kit.authorize` expects acceptance; for refusals call `c.authorizeExternalAct` through `kit.run`, with
   the input from `kit.basisDigest` and `digestFor` as in `test/operations/kit.ts`. Call `kit.setCeiling(ta1,
   50_000_000n)` first.
6. S3: in `test/ops-tooling/restore-reopen.test.ts`, add a legacy-marked application and capture its mark row in the
   top-level setup before `kit.srv.stop()`; add a new `describe` at the end that uses `nq` / `nOne` on the restored
   namespace. A new violating write is refused with SQLSTATE 23514 on C4.
7. S6 is NOT built (it needs a `1160` backup, a release manifest at that schema head and a product run after migrating:
   new harness code). Do not attempt it.

## Split (two engineers in parallel, disjoint files)

- **Engineer B2a:** `test/operations/protection-mark-legacy.test.ts` (NEW): L2, L3, L4, L6, V2. TMPDIR
  `/tmp/claude-1000/cr9`. Do not touch any other file.
- **Engineer B2b:** `test/ops-tooling/mark-filing-migration.test.ts` (NEW): L1; and S3 in
  `test/ops-tooling/restore-reopen.test.ts` (additions only; do not change existing tests or `resolveMark`). TMPDIR
  `/tmp/claude-1000/cr10`. Do not touch any other file.
