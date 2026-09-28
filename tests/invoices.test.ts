import assert from "node:assert/strict";
import { test } from "node:test";
import { createInvoice, listInvoices } from "../src/api/invoices.ts";

test("creates an invoice with the region fee", () => {
  const response = createInvoice({ customerId: "c_1", amount: 100_000, region: "eu-west" });
  assert.equal(response.status, 201);
  assert.equal(response.body.fee, 250);
  assert.equal(listInvoices().status, 200);
});

test("creates an invoice from a minimal body and applies defaults", () => {
  const response = createInvoice({ customerId: "  c_min  ", amount: 5_000 });
  assert.equal(response.status, 201);
  assert.equal(response.body.customerId, "c_min");
  assert.equal(response.body.currency, "EUR");
  assert.equal(response.body.memo, "");
  assert.match(String(response.body.id), /^inv_\d+$/);
});

test("creates an invoice with an explicit currency and memo", () => {
  const response = createInvoice({
    customerId: "c_full",
    amount: 12_345,
    currency: "USD",
    region: "us-east",
    memo: "March services",
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.currency, "USD");
  assert.equal(response.body.memo, "March services");
});

test("rejects a non-numeric amount", () => {
  const response = createInvoice({ customerId: "c_2", amount: "12" as unknown as number });
  assert.equal(response.status, 400);
});

for (const [name, body] of [
  ["a non-object body", 42],
  ["a null body", null],
  ["an array body", []],
] as const) {
  test(`rejects ${name}`, () => {
    const response = createInvoice(body);
    assert.equal(response.status, 400);
    assert.equal(response.body.error, "request body must be a JSON object");
  });
}

test("rejects unexpected fields", () => {
  const response = createInvoice({ customerId: "c_x", amount: 1_000, hacker: true });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "unexpected field: hacker");
});

test("rejects a missing customerId", () => {
  const response = createInvoice({ amount: 1_000 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "customerId is required");
});

test("rejects a non-string customerId", () => {
  const response = createInvoice({ customerId: 7 as unknown as string, amount: 1_000 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "customerId must be a string");
});

test("rejects a blank customerId", () => {
  const response = createInvoice({ customerId: "   ", amount: 1_000 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "customerId must not be empty");
});

test("rejects a missing amount", () => {
  const response = createInvoice({ customerId: "c_3" });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount is required");
});

test("rejects a NaN amount", () => {
  const response = createInvoice({ customerId: "c_4", amount: Number.NaN });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount must be a number");
});

test("rejects an infinite amount", () => {
  const response = createInvoice({ customerId: "c_5", amount: Number.POSITIVE_INFINITY });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount must be a finite number");
});

test("rejects a fractional amount", () => {
  const response = createInvoice({ customerId: "c_6", amount: 10.5 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount must be an integer number of minor units");
});

test("rejects a zero amount", () => {
  const response = createInvoice({ customerId: "c_7", amount: 0 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount must be a positive number of minor units");
});

test("rejects a negative amount", () => {
  const response = createInvoice({ customerId: "c_8", amount: -1 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount must be a positive number of minor units");
});

test("rejects an absurdly large amount", () => {
  const response = createInvoice({ customerId: "c_9", amount: 5_000_000_000_000 });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /amount must not exceed/);
});

test("rejects a non-string currency", () => {
  const response = createInvoice({ customerId: "c_10", amount: 1_000, currency: 978 as unknown as string });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "currency must be a string");
});

test("rejects a malformed currency code", () => {
  const response = createInvoice({ customerId: "c_11", amount: 1_000, currency: "euros" });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "currency must be a three-letter ISO 4217 code");
});

test("rejects an unsupported region instead of crashing", () => {
  const response = createInvoice({ customerId: "c_12", amount: 1_000, region: "mars-1" });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /not a supported region/);
});

test("rejects a non-string region", () => {
  const response = createInvoice({ customerId: "c_13", amount: 1_000, region: 1 as unknown as string });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "region must be a string");
});

test("rejects a non-string memo", () => {
  const response = createInvoice({ customerId: "c_14", amount: 1_000, memo: {} as unknown as string });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "memo must be a string");
});

test("rejects an over-long memo", () => {
  const response = createInvoice({ customerId: "c_15", amount: 1_000, memo: "x".repeat(501) });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /memo must be at most/);
});
