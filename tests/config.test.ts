import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_TIMEOUT_MS, optionalRegion, region, timeoutMs } from "../src/config/index.ts";

test("region reads LEDGER_REGION", () => {
  process.env.LEDGER_REGION = "eu-west";
  assert.equal(region(), "eu-west");
  assert.equal(optionalRegion(), "eu-west");
});

test("region throws when LEDGER_REGION is unset", () => {
  delete process.env.LEDGER_REGION;
  assert.equal(optionalRegion(), undefined);
  assert.throws(() => region(), /LEDGER_REGION is not set/);
});

test("timeoutMs defaults when LEDGER_TIMEOUT_MS is unset", () => {
  delete process.env.LEDGER_TIMEOUT_MS;
  assert.equal(timeoutMs(), DEFAULT_TIMEOUT_MS);
});

test("timeoutMs reads and validates LEDGER_TIMEOUT_MS", () => {
  process.env.LEDGER_TIMEOUT_MS = "1200";
  assert.equal(timeoutMs(), 1200);
  process.env.LEDGER_TIMEOUT_MS = "nope";
  assert.throws(() => timeoutMs(), /LEDGER_TIMEOUT_MS is invalid/);
  delete process.env.LEDGER_TIMEOUT_MS;
});
