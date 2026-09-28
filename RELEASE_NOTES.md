# Ledger-a Release Notes

## Release 0.4.1 — 2026-09-28

This release of the ledger-a double-entry ledger service, tracked under ticket LD-4412, packages the accounts, entries, fees, settlement, reporting and HTTP layers into a dependency-free TypeScript service that runs directly on Node 22 through type stripping. The shipped change is captured in the [pull request](https://cursor.com/codebase/anysphere/ledger-a/pull/1).

## What changed

The report job now reads its timeout from the `LEDGER_TIMEOUT_MS` environment variable, falling back to five seconds, rather than the previously hardcoded value, so operators can tune reporting behaviour per worker without touching code. Settlement now retries once when the regional service times out, which improves resilience during transient outages. Fee schedules remain keyed by `LEDGER_REGION`, covering eu-west, us-east and ap-south, and the invoice endpoint applies the matching regional schedule when it prices each invoice. The healthcheck echoes the configured region so a deployment can be verified at a glance.

## Rollback

Rolling back is straightforward and needs no data migration in either direction, because the ledger is append-only. To revert, redeploy the previously released tag; no schema or fee-schedule changes accompany this release, so behaviour returns to the prior version at once. Should settlement afterwards report a missing schedule, confirm that `LEDGER_REGION` names a known region rather than adding a schedule in a hotfix.

Ops
