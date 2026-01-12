import { adjustDivisor, type DivisorMethodResult, type LogFn } from "./common";

/**
 * Huntington–Hill apportionment method.
 * Huntington–Hill — divisor method; geometric-mean rounding and divisor adjustment.
 *
 * Method:
 * 1. Compute the standard divisor = total population / seats.
 * 2. For each state compute quota = population / divisor.
 * 3. Apply the geometric-mean rounding rule: round up if quota > sqrt(floor*ceil), otherwise round down.
 * 4. Adjust the divisor until allocations sum to the target seats.
 *
 * Example:
 * - Populations: [6000, 4000, 2000, 1000, 500], seats: 11
 * - Standard divisor = 13500/11 ≈ 1227.27
 * - Quotients ≈ [4.89, 3.26, 1.63, 0.81, 0.41]
 * - Apply geometric-mean thresholds -> Final allocation: [4, 3, 2, 1, 1]
 *
 * Favours: reduced bias.
 *
 * Pros:
 * - Reduces bias compared to Jefferson and Adams.
 *
 * Cons:
 * - Can still violate the quota rule in some cases.
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
export function huntingtonHill(
	populations: number[],
	seats: number,
	logFn?: LogFn,
): DivisorMethodResult {
	return adjustDivisor(
		populations,
		seats,
		(n) =>
			Math.sqrt(Math.floor(n) * Math.ceil(n)) < n
				? Math.floor(n) + 1
				: Math.floor(n),
		logFn,
	);
}
