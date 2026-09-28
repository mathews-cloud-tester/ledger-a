const DEFAULT_TIMEOUT_MS = 5000;

export function region(): string {
  const value = process.env.LEDGER_REGION;
  if (!value) throw new Error("LEDGER_REGION is not set");
  return value;
}

export function optionalRegion(): string | undefined {
  return process.env.LEDGER_REGION;
}

export function timeoutMs(): number {
  const raw = process.env.LEDGER_TIMEOUT_MS;
  const parsed = raw === undefined ? DEFAULT_TIMEOUT_MS : Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`LEDGER_TIMEOUT_MS is invalid: ${raw}`);
  }
  return parsed;
}
