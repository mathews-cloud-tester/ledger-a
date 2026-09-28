/** Rounds `amount` (in cents) to a whole number of cents, half away from zero. */
export function roundCents(amount: number): number {
  return Math.sign(amount) * Math.round(Math.abs(amount));
}
