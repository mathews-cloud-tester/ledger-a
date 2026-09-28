import assert from "node:assert/strict";
import { test } from "node:test";
import { roundCents } from "../src/ledger/index.ts";

test("positive values round to the nearest cent", () => {
  assert.equal(roundCents(2.4), 2);
  assert.equal(roundCents(2.6), 3);
});

test("negative values round to the nearest cent", () => {
  assert.equal(roundCents(-2.4), -2);
  assert.equal(roundCents(-2.6), -3);
});

test("halves round away from zero", () => {
  assert.equal(roundCents(2.5), 3);
  assert.equal(roundCents(-2.5), -3);
});

test("zero stays zero", () => {
  assert.equal(roundCents(0), 0);
});
