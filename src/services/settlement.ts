import { region as configuredRegion } from "../config/index.ts";
import { feeScheduleFor, feesOwedBy, type Ledger } from "../ledger/index.ts";
import type { AccountId } from "../models/entry.ts";

export interface SettlementResult {
  account: AccountId;
  region: string;
  gross: number;
  fees: number;
  net: number;
}

export function settle(ledger: Ledger, account: AccountId): SettlementResult {
  const region = configuredRegion();
  const schedule = feeScheduleFor(region);
  let gross = 0;
  for (const entry of ledger.entries) {
    for (const line of entry.lines) {
      if (line.account === account && line.amount > 0) gross += line.amount;
    }
  }
  const fees = feesOwedBy(ledger, account, schedule);
  return { account, region, gross, fees, net: gross - fees };
}
