import { applyFee, feeScheduleFor } from "../ledger/index.ts";

export interface InvoiceRequest {
  customerId?: string;
  amount?: number;
  currency?: string;
  region?: string;
  memo?: string;
}

export interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

export interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  fee: number;
  currency: string;
  memo: string;
}

const invoices: Invoice[] = [];

/** Fields a well-formed invoice request may contain. Anything else is rejected. */
const ALLOWED_FIELDS = new Set(["customerId", "amount", "currency", "region", "memo"]);
/** Amounts are minor units; guard against absurd/overflowing values. */
const MAX_AMOUNT = 1_000_000_000_000;
const MAX_MEMO_LENGTH = 500;
/** ISO 4217 codes are three letters. */
const CURRENCY_PATTERN = /^[A-Za-z]{3}$/;

/**
 * Validates a raw request body for `POST /invoices`. Returns a human-readable
 * error message describing the first problem found, or `null` when the body is
 * a well-formed invoice request.
 */
export function validateInvoice(body: unknown): string | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return "request body must be a JSON object";
  }
  const record = body as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    if (!ALLOWED_FIELDS.has(key)) return `unexpected field: ${key}`;
  }

  if (record.customerId === undefined) return "customerId is required";
  if (typeof record.customerId !== "string") return "customerId must be a string";
  if (record.customerId.trim().length === 0) return "customerId must not be empty";

  if (record.amount === undefined) return "amount is required";
  if (typeof record.amount !== "number" || Number.isNaN(record.amount)) return "amount must be a number";
  if (!Number.isFinite(record.amount)) return "amount must be a finite number";
  if (!Number.isInteger(record.amount)) return "amount must be an integer number of minor units";
  if (record.amount <= 0) return "amount must be a positive number of minor units";
  if (record.amount > MAX_AMOUNT) return `amount must not exceed ${MAX_AMOUNT} minor units`;

  if (record.currency !== undefined) {
    if (typeof record.currency !== "string") return "currency must be a string";
    if (!CURRENCY_PATTERN.test(record.currency)) return "currency must be a three-letter ISO 4217 code";
  }

  if (record.region !== undefined) {
    if (typeof record.region !== "string") return "region must be a string";
    try {
      feeScheduleFor(record.region);
    } catch {
      return `region ${JSON.stringify(record.region)} is not a supported region`;
    }
  }

  if (record.memo !== undefined) {
    if (typeof record.memo !== "string") return "memo must be a string";
    if (record.memo.length > MAX_MEMO_LENGTH) return `memo must be at most ${MAX_MEMO_LENGTH} characters`;
  }

  return null;
}

export function createInvoice(body: unknown): ApiResponse {
  const problem = validateInvoice(body);
  if (problem) return { status: 400, body: { error: problem } };

  const request = body as InvoiceRequest;
  const customerId = (request.customerId as string).trim();
  const amount = request.amount as number;
  const region = request.region ?? "eu-west";
  const fee = applyFee(amount, feeScheduleFor(region));
  const invoice: Invoice = {
    id: `inv_${invoices.length + 1}`,
    customerId,
    amount,
    fee,
    currency: request.currency ?? "EUR",
    memo: request.memo ?? "",
  };
  invoices.push(invoice);
  return { status: 201, body: { ...invoice } };
}

export function listInvoices(): ApiResponse {
  return { status: 200, body: { invoices: [...invoices] } };
}
