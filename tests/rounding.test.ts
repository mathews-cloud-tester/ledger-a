import assert from "node:assert/strict";
import { test } from "node:test";
import { roundCents } from "../src/ledger/index.ts";

test("positive non-half rounds toward nearest", () => {
  assert.equal(roundCents(2.3), 2);
});

test("positive half rounds away from zero", () => {
  assert.equal(roundCents(2.5), 3);
});

test("negative non-half rounds toward nearest", () => {
  assert.equal(roundCents(-2.3), -2);
});

test("negative half rounds away from zero", () => {
  assert.equal(roundCents(-2.5), -3);
});

test("zero returns positive zero", () => {
  assert.equal(roundCents(0), 0);
  assert.ok(!Object.is(roundCents(0), -0));
});
