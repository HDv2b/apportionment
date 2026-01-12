import { bench, describe } from "vitest";
import { adams, hamilton, huntingtonHill, jefferson, webster } from "../src";

const INPUT = [21878, 9713, 4167, 3252, 1065];
const SEATS = 44;
// Increase warmup to let the JIT stabilize and reduce first-run noise
const WARMUP_REPS = 50000;
// Increase iterations so each measured sample does more work (reduces relative noise)
const BENCH_ITERATIONS = 200000;
// Batch multiple calls per measured iteration to increase per-sample time and reduce timer noise
const BATCH = 100;

function warmup(fn: () => void, reps = WARMUP_REPS) {
	for (let i = 0; i < reps; i++) fn();
}

function maybeGc() {
	if (
		typeof globalThis !== "undefined" &&
		typeof globalThis.gc === "function"
	) {
		globalThis.gc();
	}
}

describe("hamilton", () => {
	warmup(() => hamilton(INPUT, SEATS));
	maybeGc();
	bench(
		"5 states",
		() => {
			for (let i = 0; i < BATCH; i++) hamilton(INPUT, SEATS);
		},
		{ iterations: BENCH_ITERATIONS },
	);
});

describe("jefferson", () => {
	warmup(() => jefferson(INPUT, SEATS));
	maybeGc();
	bench(
		"5 states",
		() => {
			for (let i = 0; i < BATCH; i++) jefferson(INPUT, SEATS);
		},
		{ iterations: BENCH_ITERATIONS },
	);
});

describe("adams", () => {
	warmup(() => adams(INPUT, SEATS));
	maybeGc();
	bench(
		"5 states",
		() => {
			for (let i = 0; i < BATCH; i++) adams(INPUT, SEATS);
		},
		{ iterations: BENCH_ITERATIONS },
	);
});

describe("webster", () => {
	warmup(() => webster(INPUT, SEATS));
	maybeGc();
	bench(
		"5 states",
		() => {
			for (let i = 0; i < BATCH; i++) webster(INPUT, SEATS);
		},
		{ iterations: BENCH_ITERATIONS },
	);
});

describe("huntingtonHill", () => {
	warmup(() => huntingtonHill(INPUT, SEATS));
	maybeGc();
	bench(
		"5 states",
		() => {
			for (let i = 0; i < BATCH; i++) huntingtonHill(INPUT, SEATS);
		},
		{ iterations: BENCH_ITERATIONS },
	);
});
