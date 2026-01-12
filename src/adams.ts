import { adjustDivisor, type DivisorMethodResult, type LogFn } from "./common";

/**
 * Adams apportionment method.
 * Adams — divisor method; rounds quotas up and adjusts divisor.
 *
 * Method:
 * 1. Compute standard divisor = total population / seats.
 * 2. For each state compute quota = population / divisor.
 * 3. Apply rounding rule for this method to get an allocation for a given divisor.
 * 4. Adjust the divisor until allocations sum to the target seats.
 *
 * Example:
 * - Populations: [6000, 4000, 2000, 1000, 500], seats: 11
 * - Standard divisor = 13500/11 ≈ 1227.27
 * - Quotients ≈ [4.89, 3.26, 1.63, 0.81, 0.41]
 * - Initial (ceil) = [5, 4, 2, 1, 1] (sum = 13) → increase divisor until sum = 11
 * - Final allocation: [4, 3, 2, 1, 1]
 *
 * Favours: smaller states.
 *
 * Pros:
 * - Provides a consistent rounding rule when preferring smaller constituencies.
 *
 * Cons:
 * - Can violate the quota rule.
 *
 * Paradoxes (uniform notes):
 * - Alabama paradox: no — house-monotone: increasing seats cannot decrease a state's allocation.
 * - Population paradox: no — a state's relative population increase does not cause it to lose a seat.
 * - New-states paradox: no — admitting a new state does not force counterintuitive reapportionments among existing states.
 *
 * quota rule: each state's allocation should be either floor(quota) or ceil(quota), where quota = state population / standard divisor.
 *
 * @param populations - array of populations per state
 * @param seats - total number of seats to allocate
 * @param logFn
 * @returns DivisorMethodResult
 */
export function adams(
	populations: number[],
	seats: number,
	logFn?: LogFn,
): DivisorMethodResult {
	return adjustDivisor(populations, seats, Math.ceil, logFn);
}
