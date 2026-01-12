import { adjustDivisor, type DivisorMethodResult, type LogFn } from "./common";

/**
 * Jefferson apportionment method.
 * Jefferson — divisor method; rounds quotas down and adjusts divisor.
 *
 * Method:
 * 1. Compute the "standard divisor" = (total population) / (number of seats).
 * 2. For each state compute quota = population / divisor.
 * 3. Apply rounding rule for this method to get an allocation for a given divisor.
 * 4. Adjust the divisor until allocations sum to the target seats.
 *
 * Example:
 * - Populations: [6000, 4000, 2000, 1000, 500], seats: 11
 * - Standard divisor = 13500/11 ≈ 1227.27
 * - Quotients ≈ [4.89, 3.26, 1.63, 0.81, 0.41]
 * - Initial (floor) = [4, 3, 1, 0, 0] (sum = 8) → adjust divisor to reach 11
 * - Result: no single exact allocation returned; algorithm yields bounds:
 *   low:  [5, 3, 1, 0, 0]
 *   high: [6, 4, 2, 1, 0]
 *
 * Notes:
 * - "Standard divisor" is the average people per seat; quota = population / divisor.
 * - Jefferson uses floor rounding for a given divisor (D'Hondt/highest-averages in party lists).
 *
 * Favours: larger states.
 *
 * Pros:
 * - House-monotone: increasing total seats will not reduce any state's allocation.
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
 * @returns DivisorMethodResult - exact allocation or closest low/high bounds
 */
export function jefferson(
	populations: number[],
	seats: number,
	logFn?: LogFn,
): DivisorMethodResult {
	return adjustDivisor(populations, seats, Math.floor, logFn);
}
