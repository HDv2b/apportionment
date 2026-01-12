import { test } from "vitest";
import { adams, hamilton, huntingtonHill, jefferson, webster } from "../src";

const example = [6000, 4000, 2000, 1000, 500];
const seats = 11;

console.log("--- NEW EXAMPLE COMPUTE ---");
console.log("Populations:", example, "seats=", seats);
console.log("jefferson:", jefferson(example, seats));
console.log("adams:", adams(example, seats));
console.log("webster:", webster(example, seats));
console.log("huntingtonHill:", huntingtonHill(example, seats));
console.log("hamilton:", hamilton(example, seats));

// trivial test to keep vitest happy
test("compute new example", () => {
	// pass
});
