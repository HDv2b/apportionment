import { describe, expect, test } from "vitest";
import { adams, hamilton, huntingtonHill, jefferson, webster } from "../src";

const main = [21878, 9713, 4167, 3252, 1065];
const small = [50, 21, 1, 1, 1];

describe("example allocations (standardized)", () => {
	test("standard example (seats=44)", () => {
		expect(jefferson(main, 44)).toEqual({ exact: [25, 11, 4, 3, 1] });
		expect(adams(main, 44)).toEqual({ exact: [23, 10, 5, 4, 2] });
		expect(webster(main, 44)).toEqual({ exact: [24, 10, 5, 4, 1] });
		expect(huntingtonHill(main, 44)).toEqual({ exact: [24, 10, 5, 4, 1] });
		expect(hamilton(main, 44)).toEqual({ exact: [24, 11, 5, 3, 1] });
	});

	test("small illustrative example (seats=10)", () => {
		expect(jefferson(small, 10)).toEqual({ exact: [7, 3, 0, 0, 0] });
		expect(adams(small, 10)).toEqual({ exact: [5, 2, 1, 1, 1] });
		expect(webster(small, 10)).toEqual({ exact: [7, 3, 0, 0, 0] });
		expect(huntingtonHill(small, 10)).toEqual({ exact: [5, 2, 1, 1, 1] });
		expect(hamilton(small, 10)).toEqual({ exact: [7, 3, 0, 0, 0] });
	});
});
