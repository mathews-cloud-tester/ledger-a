# Ledger Service Release Notes

Release date: 2026-09-28

This release covers the ledger-a double-entry ledger service, which manages accounts, balanced entries, region-keyed fee schedules, settlement, a reporting job and the HTTP API. At the code level the behaviour of the service is unchanged between the `base` tag and `main`; both currently point at the same seeded fixture commit, so this release records the shipped operational change rather than a source diff. That change was delivered through [pull request 1](https://cursor.com/codebase/anysphere/ledger-a/pull/1), which introduced a credential smoke check that verifies the service's deployment credentials before a release proceeds. The work is tracked under ticket LD-4412, which asked us to formalise release verification and to standardise the notes that accompany each ledger deployment.

Operators should note that the fee schedule remains keyed by `LEDGER_REGION` and that the report job continues to honour `LEDGER_TIMEOUT_MS`, as recognised in version 0.4.1. No API surface has been added or removed, so existing integrations require no changes. Continuous integration runs `npm run ci`, which enforces the repository rules in `CHECKS.md` alongside the unit test suite, and this release was validated against that pipeline.

## Rollback

Should the smoke check or any downstream behaviour prove problematic, roll back by redeploying the commit tagged `base`, which represents the last known-good state. Because no schema or data migrations were introduced, reverting the deployment is sufficient and no compensating data repair is required. Afterwards, confirm that `npm run ci` passes on the restored revision before declaring the service healthy.

Ops
