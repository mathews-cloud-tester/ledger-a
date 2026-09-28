# Release Notes

Release date: 2026-09-28

This release finalises the ledger service work tracked under ticket LD-4412 and
brings the settlement and reporting paths in line with our latest operational
standards. Settlement now retries once when the region service times out, which
should reduce spurious failures during brief regional degradations, and the
reporting job honours the configurable `LEDGER_TIMEOUT_MS` value rather than a
hardcoded limit, giving operators finer control over long-running report
generation. Fee schedules continue to be organised by region, and the behaviour
of the ledger API surface remains unchanged, so no consumer migration is
required. We have prioritised stability and observability, and we recognise that
predictable settlement is critical to downstream reconciliation.

The shipped change for this release is captured in the pull request at
https://cursor.com/codebase/anysphere/ledger-a/pull/1, which reviewers
authorised ahead of the cut.

## Rollback

Should settlement behaviour regress or report timeouts prove problematic, roll
back by redeploying the previously released artefact and reverting the shipped
pull request. Restore `LEDGER_TIMEOUT_MS` to its prior value if it was altered
during the upgrade, and confirm that settlement retries are functioning as
expected before resuming normal traffic. No database migrations accompany this
release, so a rollback requires no schema changes and can be completed without
data loss. If problems persist afterwards, escalate to the on-call engineer and
consult the runbook held under the docs directory.

Signed off by Ops.
