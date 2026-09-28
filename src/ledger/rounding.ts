/** Rounds `amount` to whole cents, rounding halves away from zero. */
export function roundCents(amount: number): number {
  return Math.sign(amount) * Math.round(Math.abs(amount));
}
