import type { DivisorMethodResult } from "../../src";

interface MockShape {
	populations: number[];
	seats: number;
	results: {
		hamilton: DivisorMethodResult;
		jefferson: DivisorMethodResult;
		adams: DivisorMethodResult;
		webster: DivisorMethodResult;
		huntingdonHill: DivisorMethodResult;
	};
}

export const DISTINCT_RESULTS: MockShape = {
	populations: [19312, 7301, 16520, 11292, 9648, 8597],
	seats: 54,
	results: {
		hamilton: { exact: [14, 6, 12, 9, 7, 6] },
		jefferson: { exact: [15, 5, 13, 8, 7, 6] },
		adams: { exact: [14, 6, 12, 8, 7, 7] },
		webster: { exact: [15, 5, 12, 9, 7, 6] },
		huntingdonHill: { exact: [15, 6, 12, 8, 7, 6] },
	},
} as const;

export const SKIPPED_HOUSE: MockShape = {
	populations: [9102, 5211, 8820, 15119, 11986, 8820],
	seats: 64,
	results: {
		hamilton: { exact: [10, 6, 10, 16, 13, 9] },
		jefferson: {
			low: [10, 5, 9, 17, 13, 9],
			high: [10, 5, 10, 17, 13, 10],
		},
		adams: {
			low: [10, 6, 9, 16, 13, 9],
			high: [10, 6, 10, 16, 13, 10],
		},
		webster: {
			low: [10, 6, 9, 16, 13, 9],
			high: [10, 6, 10, 16, 13, 10],
		},
		huntingdonHill: {
			low: [10, 6, 9, 16, 13, 9],
			high: [10, 6, 10, 16, 13, 10],
		},
	},
};
