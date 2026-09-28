/** Rounds a monetary amount in cents to the nearest whole cent, rounding exact halves away from zero. */
export function roundCents(amount: number): number {
  return Math.sign(amount) * Math.round(Math.abs(amount)) || 0;
}
