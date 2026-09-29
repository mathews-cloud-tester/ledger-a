import assert from "node:assert/strict";
import { test } from "node:test";
import { balanceFor, feesOwedBy, feeScheduleFor, openJournal, postEntry } from "../src/ledger/index.ts";
import type { LedgerEntry } from "../src/models/entry.ts";
import { summarize } from "../src/services/report.ts";
import { settle } from "../src/services/settlement.ts";

const entry = (id: string, amount: number): LedgerEntry => ({
  id,
  ledgerId: "L1",
  postedAt: `2026-09-0${id.length}T00:00:00Z`,
  memo: `entry ${id}`,
  lines: [
    { account: "cash", amount },
    { account: "revenue", amount: -amount },
  ],
});

test("balances follow posted entries", () => {
  let journal = openJournal("L1");
  journal = postEntry(journal, entry("a", 1000));
  journal = postEntry(journal, entry("bb", 250));
  assert.equal(balanceFor(journal, "cash"), 1250);
  assert.equal(balanceFor(journal, "revenue"), -1250);
  assert.equal(summarize(journal).entries, 2);
});

test("unbalanced entries are rejected", () => {
  const bad = { ...entry("z", 10), lines: [{ account: "cash", amount: 10 }] };
  assert.throws(() => postEntry(openJournal("L1"), bad), /not balanced/);
});

test("fees owed and settlement agree", () => {
  process.env.LEDGER_REGION = "us-east";
  let journal = openJournal("L1");
  journal = postEntry(journal, entry("a", 100_000));
  const fees = feesOwedBy(journal, "cash", feeScheduleFor("us-east"));
  assert.equal(fees, 300);
  assert.deepEqual(settle(journal, "cash"), {
    account: "cash",
    region: "us-east",
    gross: 100_000,
    fees: 300,
    net: 99_700,
  });
});
