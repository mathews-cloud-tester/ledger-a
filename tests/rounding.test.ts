import assert from "node:assert/strict";
import { test } from "node:test";
import { roundCents } from "../src/ledger/index.ts";

test("positive amounts round to the nearest cent", () => {
  assert.equal(roundCents(2.4), 2);
  assert.equal(roundCents(2.6), 3);
  assert.equal(roundCents(5), 5);
});

test("negative amounts round to the nearest cent", () => {
  assert.equal(roundCents(-2.4), -2);
  assert.equal(roundCents(-2.6), -3);
  assert.equal(roundCents(-5), -5);
});

test("halves round away from zero for both signs", () => {
  assert.equal(roundCents(2.5), 3);
  assert.equal(roundCents(-2.5), -3);
  assert.equal(roundCents(0.5), 1);
  assert.equal(roundCents(-0.5), -1);
});

test("zero rounds to zero", () => {
  assert.equal(roundCents(0), 0);
});
