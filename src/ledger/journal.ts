import { entryIsBalanced, type AccountId, type LedgerEntry, type LedgerId } from "../models/entry.ts";
import { applyFee, type FeeSchedule } from "./fees.ts";

export interface Journal {
  id: LedgerId;
  entries: LedgerEntry[];
}

export function openJournal(id: LedgerId): Journal {
  return { id, entries: [] };
}

export function postEntry(journal: Journal, entry: LedgerEntry): Journal {
  if (entry.ledgerId !== journal.id) {
    throw new Error(`entry ${entry.id} belongs to journal ${entry.ledgerId}, not ${journal.id}`);
  }
  if (!entryIsBalanced(entry)) {
    throw new Error(`entry ${entry.id} is not balanced`);
  }
  return { ...journal, entries: [...journal.entries, entry] };
}

export function balanceFor(journal: Journal, account: AccountId): number {
  let total = 0;
  for (const entry of journal.entries) {
    for (const line of entry.lines) {
      if (line.account === account) total += line.amount;
    }
  }
  return total;
}

/** Fee owed on everything debited to `account`, under `schedule`. */
export function feesOwedBy(journal: Journal, account: AccountId, schedule: FeeSchedule): number {
  let fees = 0;
  for (const entry of journal.entries) {
    for (const line of entry.lines) {
      if (line.account === account && line.amount > 0) fees += applyFee(line.amount, schedule);
    }
  }
  return fees;
}
