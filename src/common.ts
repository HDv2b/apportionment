export type Only<T, U> = {
	[P in keyof T]: T[P];
} & {
	[P in keyof U]?: never;
};
type Either<T, U> = Only<T, U> | Only<U, T>;

const LOG_KEYS = {
	SUM_POP: "SUM_POP",
	INIT_DIVISOR: "INIT_DIVISOR",
	INIT_QUOTIENTS: "INIT_QUOTIENTS",
	INIT_ALLOCATION: "INIT_ALLOCATION",
	INIT_SEATS: "INIT_SEATS",
	INC_DIVISOR: "INC_DIVISOR",
	DEC_DIVISOR: "DEC_DIVISOR",
	UPDATE_QUOTIENTS: "UPDATE_QUOTIENTS",
	UPDATE_ALLOCATION: "UPDATE_ALLOCATION",
	UPDATE_SEATS: "UPDATE_SEATS",
	REMAINDERS: "REMAINDERS",
	REMAINDER_SEATS: "REMAINDER_SEATS",
	ALLOCATE_REMAINDER_SEAT: "ALLOCATE_REMAINDER_SEAT",
	FINAL_SEATS: "FINAL_SEATS",
	FINAL_DIVISOR: "FINAL_DIVISOR",
	FINAL_ALLOCATION: "FINAL_ALLOCATION",
	MAX_ITERATIONS: "MAX_ITERATIONS",
	HIGH_DIVISOR: "HIGH_DIVISOR",
	LOW_DIVISOR: "LOW_DIVISOR",
	HIGH_ALLOCATION: "HIGH_ALLOCATION",
	LOW_ALLOCATION: "LOW_ALLOCATION",
} as const;

type LogKey = keyof typeof LOG_KEYS;

export type RemainderLookup = { r: number; i: number }[];

// biome-ignore-start lint/suspicious/noExplicitAny: This is an API function, user can do what they want with the return, so long as nothing is used internally with it.
export type LogFn = (
	msgType: LogKey,
	data: number | number[] | RemainderLookup,
) => any;
// biome-ignore-end lint/suspicious/noExplicitAny: /end

/**
 * The number of allocated seats exactly matches the number of given seats
 */
export interface DivisorMethodResultExact {
	exact: number[];
}

/**
 * No divisor could be found for which the seat allocation matches the given number of seats
 */
export interface DivisorMethodResultRough {
	low: number[];
	high: number[];
}

/**
 * If a divisor is found such that the seat allocation matches the total number of available seats, then the result will be given with `exact`.
 *
 * @example
 * ```ts
 * // e.g. 44 seats available
 * {
 *   exact: [24, 11, 5, 3, 1] // sum = 44
 * }
 * ```
 *
 * Otherwise, the closest possible solutions above and below the target are given:
 *
 * @example
 * ```ts
 * // 4 states with populations [6000, 4000, 2000, 1000]
 * // 10 available seats
 * // divisor = (6000 + 4000 + 2000 + 1000) / 10 = 1300
 * // preallocation = [6000/1300, 4000/1300, 2000/1300, 1000/1300]
 * // rounded down = [4, 3, 1, 0], which sums to 8, which is less than 10
 * // attempt to decrease the divisor until sum of allocation = 10...
 * {
 *   low: [ 5, 3, 1, 0 ], // result of divisor = 1000.0000000000001: sum = 9
 *   high: [ 6, 4, 2, 1 ], // result of divisor = 1000: sum = 13
 * }
 * ```
 *
 *
 */
export type DivisorMethodResult = Either<
	DivisorMethodResultExact,
	DivisorMethodResultRough
>;

/**
 * Sum of all numbers in the array.
 *
 * @example
 * ```ts
 * const n = sum([11, 13, 17])
 * // n === 41
 * ```
 *
 * @param a
 */
export function sum(a: number[]): number {
	return a.reduce((a, n) => a + n, 0);
}

/**
 * Total population divided by number of seats (not rounded)
 *
 * @example
 * ```ts
 * const n = getDivisor([11, 13, 17], 6)
 * // = (11 + 13 + 17) / 6
 * // = 41 / 6
 * // n === 6.8333...
 * ```
 *
 * @param populations
 * @param seats
 */
export function getDivisor(populations: number[], seats: number): number {
	return sum(populations) / seats;
}

/**
 * Divide each population by the divisor
 *
 * @example
 * ```ts
 * const populations = [5, 6, 8, 9, 12, 15];
 * const seats = 7;
 * const divisor = getDivisor(population, seats); // === 7
 *
 * const qs = getQuotients(populations, divisor)
 * // qs === [5/7, 6/7, 8/7, 9/7, 12/7, 15/7]
 * ```
 *
 * @param populations
 * @param divisor
 */
export function getQuotients(populations: number[], divisor: number): number[] {
	return populations.map((pop) => pop / divisor);
}

/**
 * Round the quotients according to a function, to give a seat allocation.
 * @param quotients
 * @param roundingFn
 */
export function roundQuotients(
	quotients: number[],
	roundingFn: (x: number) => number,
): number[] {
	return quotients.map(roundingFn);
}

/**
 * Shortcut function combining `getQuotients` and `roundQuotients` as a single step, to allocate seats given a population, divisor, and rounding method.
 *
 * For given population and divisor, fill seats with a given rounding function.
 *
 * This will typically be used as a pre-allocation, and then refined by adjusting the divisor according the method's rules.
 *
 * @example
 * ```ts
 * // Jefferson works by rounding down:
 * const populations = [5, 6, 8, 9, 12, 15];
 * const seats = 7;
 * const divisor = getDivisor(population, seats); // === 7
 *
 * const allocation = fillSeats(population, divisor, Math.floor);
 *
 * // returns:
 * // {
 * //    quotients: [5/7, 6/7, 8/7, 9/7, 12/7, 15/7]
 * //    apportionment: [0, 0, 1, 1, 1, 2] // quotients but with given rounding function Math.floor applied
 * // }
 *
 * // In this case, only 5 (1 + 1 + 1 + 2) of the total seats are allocated
 * // so the Jefferson method would call this function again with a decreasing divisor
 * // until a result is given where all seats are allocated
 * ```
 *
 * @param populations
 * @param divisor
 * @param roundingFn
 * @param wrappedLogFn
 */
export function fillSeats(
	populations: number[],
	divisor: number,
	roundingFn: (x: number) => number,
	wrappedLogFn?: {
		stage: "INIT" | "UPDATE";
		logFn: LogFn;
	},
): number[] {
	const quotients = getQuotients(populations, divisor);
	const rounded = roundQuotients(quotients, roundingFn);

	if (wrappedLogFn) {
		const { logFn, stage } = wrappedLogFn;
		logFn(`${stage}_QUOTIENTS`, quotients);
		logFn(`${stage}_ALLOCATION`, rounded);
	}

	return rounded;
}

export function adjustDivisor(
	populations: number[],
	seats: number,
	method: (x: number) => number, //eg. Math.ceil
	logFn?: LogFn,
): DivisorMethodResult {
	sanityCheck(populations, seats);

	const totalPopulation = sum(populations);
	if (logFn) {
		logFn("SUM_POP", totalPopulation);
	}

	let modifiedDivisor = totalPopulation / seats;
	if (logFn) {
		logFn("INIT_DIVISOR", modifiedDivisor);
	}

	let divMax: number | undefined; // divisor that produced too few seats (upper bound)
	let divMin: number | undefined; // divisor that produced too many seats (lower bound)
	let filledSeats: number | undefined;

	// store the allocation results associated with the recorded bounds
	let allocationResultLow: number[] = [];
	let allocationResultHigh: number[] = [];

	const MAX_ITERATIONS = 1000; // safety to avoid infinite loops in pathological cases
	let iteration = 0;

	while (filledSeats !== seats) {
		if (++iteration > MAX_ITERATIONS) break;

		let change = false;
		const apportionment = fillSeats(
			populations,
			modifiedDivisor,
			method,
			logFn && { stage: iteration === 1 ? "INIT" : "UPDATE", logFn },
		);
		filledSeats = sum(apportionment);

		if (logFn) {
			if (seats === filledSeats) {
				logFn("FINAL_SEATS", filledSeats);
			} else {
				logFn(iteration === 1 ? "INIT_SEATS" : "UPDATE_SEATS", filledSeats);
			}
		}

		if (filledSeats < seats) {
			// too few seats allocated -> divisor is too large; record as an upper bound
			if (divMax === undefined || divMax !== modifiedDivisor) {
				change = true;
				divMax = modifiedDivisor;
				allocationResultLow = apportionment;
			}

			// move the divisor downwards: average with known lower bound if available, otherwise halve
			if (typeof divMin !== "undefined") {
				modifiedDivisor = (modifiedDivisor + divMin) / 2;
			} else {
				modifiedDivisor = modifiedDivisor / 2;
			}
			if (logFn) {
				logFn("DEC_DIVISOR", modifiedDivisor);
			}
		} else if (filledSeats > seats) {
			// too many seats allocated -> divisor is too small; record as a lower bound
			if (divMin === undefined || divMin !== modifiedDivisor) {
				change = true;
				divMin = modifiedDivisor;
				allocationResultHigh = apportionment;
			}

			// move the divisor upwards: average with known upper bound if available, otherwise double
			if (typeof divMax !== "undefined") {
				modifiedDivisor = (modifiedDivisor + divMax) / 2;
			} else {
				modifiedDivisor = modifiedDivisor * 2;
			}
			if (logFn) {
				logFn("INC_DIVISOR", modifiedDivisor);
			}
		} else {
			// exact match
			if (logFn) {
				logFn("FINAL_DIVISOR", modifiedDivisor);
				logFn("FINAL_ALLOCATION", apportionment);
			}
			return { exact: apportionment };
		}

		// if we didn't make progress this iteration, we cannot converge further
		if (!change && filledSeats !== seats) {
			if (logFn) {
				divMin && logFn("LOW_DIVISOR", divMin);
				divMax && logFn("HIGH_DIVISOR", divMax);
				logFn("LOW_ALLOCATION", allocationResultLow);
				logFn("HIGH_ALLOCATION", allocationResultHigh);
			}
			return {
				low: allocationResultLow,
				high: allocationResultHigh,
			};
		}
	}

	// If loop exited without finding an exact match (max iterations or break), return the best known bounds
	if (logFn) {
		logFn("MAX_ITERATIONS", MAX_ITERATIONS);
		divMin && logFn("LOW_DIVISOR", divMin);
		divMax && logFn("HIGH_DIVISOR", divMax);
		logFn("LOW_ALLOCATION", allocationResultLow);
		logFn("HIGH_ALLOCATION", allocationResultHigh);
	}
	return {
		low: allocationResultLow,
		high: allocationResultHigh,
	};
}

/**
 * Run-time checks for valid inputs
 * @param populations
 * @param seats
 */
export function sanityCheck(populations: number[], seats: number) {
	const isValidNumber = (v: unknown): v is number =>
		typeof v === "number" && !Number.isNaN(v);

	if (!populations.every(isValidNumber) || !isValidNumber(seats)) {
		throw new Error("Every input must be a number.");
	}

	if (seats === 0) {
		throw new Error("Cannot divide by 0 seats or other indivisibles.");
	}
}
