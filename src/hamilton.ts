import {
	type DivisorMethodResultExact,
	getQuotients,
	type LogFn,
	type RemainderLookup,
	sanityCheck,
	sum,
} from "./common";

/**
 * Hamilton (largest remainders) apportionment method.
 * Hamilton — largest-remainders method; floor quotas then distribute remaining seats by largest fractional remainders.
 *
 * Method:
 * 1. Compute the standard divisor = total population / seats.
 * 2. For each state compute quota = population / divisor.
 * 3. Assign floor(quota) to each state as initial allocation.
 * 4. Award remaining seats to states with the largest fractional remainders until all seats are assigned.
 *
 * Example:
 * - Populations: [6000, 4000, 2000, 1000, 500], seats: 11
 * - Quotients ≈ [4.89, 3.26, 1.63, 0.81, 0.41] -> floor -> [4,3,1,0,0], remaining seats = 3 -> award to the highest remainders
 * - Final allocation: [5, 3, 2, 1, 0]
 * - Compare: Adams/Huntington–Hill → [4, 3, 2, 1, 1]; Jefferson/Webster → [5, 3, 2, 1, 0]
 *
 * Favours: preserves quota (no systematic size bias).
 *
 * Paradoxes (uniform notes):
 * - Alabama paradox: yes — may occur: increasing total seats can reduce some state's allocation.
 * - Population paradox: no — a state's relative population increase does not cause it to lose a seat.
 * - New-states paradox: yes — admitting a new state can cause different allocations among existing states.
 *
 * @param populations - array of populations per state
 * @param seats - total number of seats to allocate
 * @param logFn
 * @returns DivisorMethodResultExact with `exact` array of allocations
 */
export function hamilton(
	populations: number[],
	seats: number,
	logFn?: LogFn,
): DivisorMethodResultExact {
	// eg. population: [21878, 9713, 4167, 3252, 1065], seats: 44
	sanityCheck(populations, seats);

	const totalPopulation = sum(populations); // 40075

	const divisor = totalPopulation / seats; // 40075 / 44 = 910.795454..

	const quotients = getQuotients(populations, divisor); // [24.02, 10.66, 4.57, 3.57, 1.17]

	// standard preallocation by rounding down each state's quotient
	const apportionment = quotients.map(Math.floor); // [24, 10, 4, 3, 1]

	// count remaining seats and sort states by highest remainder
	const sortedRemainders: RemainderLookup = quotients
		.map((q, i) => ({ r: q - apportionment[i], i })) // [{r: 0.2, i: 0}, {r: 0.66, i: 1}, {r: 0.57, i: 2}, {r: 0.37, i: 3}, {r: 0.17, i: 4}]
		.sort((a, b) => b.r - a.r); // [{r: 0.66, i: 1}, {r: 0.57, i: 2}, {r: 0.37, i: 3}, {r: 0.2, i: 0}, {r: 0.17, i: 4}]

	const preallocationLeftOver = seats - sum(apportionment); // 44 - 42 = 2
	if (logFn) {
		logFn("SUM_POP", totalPopulation);
		logFn("INIT_DIVISOR", divisor);
		logFn("INIT_QUOTIENTS", quotients);
		logFn("INIT_ALLOCATION", [...apportionment]);
		logFn("REMAINDERS", sortedRemainders);
		logFn("REMAINDER_SEATS", preallocationLeftOver);
	}

	// distribute remaining seats
	for (let i = 0; i < preallocationLeftOver; i++) {
		const i2 = sortedRemainders[i].i;
		apportionment[i2] += 1;
		if (logFn) {
			logFn("ALLOCATE_REMAINDER_SEAT", i2);
		}

		// i = 0 to 1
		// i = 0: i2 = 1, apportionment[1] += 1 => [24, 11, 4, 3, 1]
		// i = 1: i2 = 2, apportionment[2] += 1 => [24, 11, 5, 3, 1]
	}

	if (logFn) {
		logFn("FINAL_SEATS", apportionment);
	}

	return { exact: apportionment }; // { exact: [24, 11, 5, 3, 1] }
}
