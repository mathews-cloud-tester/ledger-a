/** Default report timeout, in milliseconds, when `LEDGER_TIMEOUT_MS` is unset. */
export const DEFAULT_TIMEOUT_MS = 5000;

/** The configured region, or `undefined` when `LEDGER_REGION` is unset. */
export function optionalRegion(): string | undefined {
  return process.env.LEDGER_REGION;
}

/** The configured region. Throws when `LEDGER_REGION` is unset. */
export function region(): string {
  const value = optionalRegion();
  if (!value) throw new Error("LEDGER_REGION is not set");
  return value;
}

/** The configured report timeout in milliseconds, defaulting to `DEFAULT_TIMEOUT_MS`. */
export function timeoutMs(): number {
  const raw = process.env.LEDGER_TIMEOUT_MS;
  const parsed = raw === undefined ? DEFAULT_TIMEOUT_MS : Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`LEDGER_TIMEOUT_MS is invalid: ${raw}`);
  return parsed;
}
