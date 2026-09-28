# Ledger Service Release — 0.4.1

Release date: 2026-09-28

This release refines the double-entry ledger service, which covers accounts, balanced entries, the regional fee catalogue, settlement, the reporting job and the HTTP API. The work is tracked under ticket LD-4412 and is delivered through the shipped change captured in the accompanying [pull request](https://cursor.com/codebase/anysphere/ledger-a/pull/1).

## What changed

Settlement now behaves more resiliently: when the region service times out, the settlement path retries once before surfacing an error, which stabilises behaviour across the eu-west, us-east and ap-south fee schedules. The reporting job no longer relies on a hardcoded five-second limit; instead it initialises its timeout from the LEDGER_TIMEOUT_MS environment variable and validates the value, so operators can optimise report duration per environment. Fee computation continues to honour each region's basis points and minimum, while account balances and fees owed are derived directly from posted, balanced entries. The invoicing endpoints under the HTTP API remain available for creating and listing invoices, and the health endpoint continues to report the configured region.

## Rollback

Should this release misbehave, roll it back by redeploying the previous 0.4.0 artefact and reverting the merge associated with LD-4412. No schema change or data migration accompanies this release, so a redeploy alone is sufficient and no state needs to be reinitialised. If the new timeout proves problematic, restore the earlier behaviour by unsetting LEDGER_TIMEOUT_MS, at which point the reporting job returns to its former default and settlement resumes its single-attempt path.

Ops.
