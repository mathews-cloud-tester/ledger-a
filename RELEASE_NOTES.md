# Release Notes

Release date: 2026-09-28

This release of the ledger service focuses on resilience and operational behaviour under load, and it was prioritised to reduce the settlement failures the on-call team has been chasing. The shipped change is tracked as [PR #1](https://cursor.com/codebase/anysphere/ledger-a/pull/1) and closes ticket LD-4412.

Settlement now retries once when the region service times out, so a single transient failure no longer aborts a settlement run. The report job has also been optimised to read its timeout from `LEDGER_TIMEOUT_MS` rather than a hardcoded value, which lets operators tune behaviour per environment without a code change. Fee schedules continue to be keyed by `LEDGER_REGION`, and the ledger remains append-only, so this upgrade requires no data migration in either direction.

Operators should confirm that `LEDGER_REGION` is set to a recognised region and that `LEDGER_TIMEOUT_MS` reflects the report worker's expected latency before promoting the release. We prioritised backwards compatibility throughout, so existing deployments should observe no change in API behaviour.

## Rollback

Rolling back is intentionally straightforward. Redeploy the previous tag to restore prior behaviour; because the ledger is append-only, no data migration is needed in either direction and no manual reconciliation is required. If settlement begins failing with a missing fee schedule after a change, that indicates an unrecognised `LEDGER_REGION` rather than a fault in this release, and it should be corrected on the deployment rather than in a hotfix.

We recommend monitoring settlement retry rates for a short period after promotion to confirm the new behaviour is performing as intended.

Signed off by Ops.
