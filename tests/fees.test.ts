import assert from "node:assert/strict";
import { test } from "node:test";
import { applyServiceFee, feeScheduleFor } from "../src/ledger/index.ts";

test("proportional fee above the minimum", () => {
  assert.equal(applyServiceFee(100_000, feeScheduleFor("eu-west")), 250);
});

test("minimum fee applies to small amounts", () => {
  assert.equal(applyServiceFee(100, feeScheduleFor("eu-west")), 30);
});

test("non-positive amounts carry no fee", () => {
  assert.equal(applyServiceFee(0, feeScheduleFor("us-east")), 0);
  assert.equal(applyServiceFee(-500, feeScheduleFor("us-east")), 0);
});

test("unknown region is rejected", () => {
  assert.throws(() => feeScheduleFor("mars"), /no fee schedule/);
});
