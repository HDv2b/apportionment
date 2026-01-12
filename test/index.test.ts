import { describe, expect, test } from "vitest";
import {
	adams,
	getDivisor,
	hamilton,
	huntingtonHill,
	jefferson,
	type RemainderLookup,
	webster,
} from "../src";

// Used for examples from US' census.gov: https://www.census.gov/history/www/reference/apportionment/methods_of_apportionment.html
// const numSeats = 20;
// const populations = [2560, 3315, 995, 5012];

// Used for examples from Matt Parker's video: https://www.youtube.com/watch?v=GVhFBujPlVo
const shapes = {
	"New Triangle": 21878,
	Circula: 9713,
	Squaryland: 4167,
	Octiana: 3252,
	"Rhombus Island": 1065,
};

const badNumSeats = 20;
const badPopulations = [9, 5, 9, 1, 3, 5, 8];

describe("hamilton", () => {
	test("correctly returns apportionment", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];
		expect(
			hamilton(Object.values(shapes), 43, (msg, data) =>
				log.push({ msg, data }),
			),
		).toEqual({
			exact: [24, 10, 4, 4, 1],
		});
		expect(log).toEqual([
			{ data: 40075, msg: "SUM_POP" },
			{ data: 931.9767441860465, msg: "INIT_DIVISOR" },
			{
				data: [
					23.47483468496569, 10.421933873986276, 4.4711416094822205,
					3.489357454772302, 1.1427323767935123,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [24, 10, 4, 4, 1], msg: "INIT_ALLOCATION" },
			{
				data: [
					{ i: 3, r: 0.4893574547723021 },
					{ i: 0, r: 0.47483468496568904 },
					{ i: 2, r: 0.4711416094822205 },
					{ i: 1, r: 0.42193387398627635 },
					{ i: 4, r: 0.14273237679351225 },
				],
				msg: "REMAINDERS",
			},
			{ data: 2, msg: "REMAINDER_SEATS" },
			{ data: 3, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: 0, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: [24, 10, 4, 4, 1], msg: "FINAL_SEATS" },
		]);
	});

	test("errors with invalid input", () => {
		expect(() =>
			// @ts-expect-error "nope" is not a number
			hamilton(["nope", 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error "nope" is not a number
			hamilton([true, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error undefined is not a number
			hamilton([undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		// @ts-expect-error "nope" is not a number
		expect(() => hamilton([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "nope")).toThrowError(
			"Every input must be a number.",
		);
		expect(() =>
			// @ts-expect-error undefined is not a number
			hamilton([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], undefined),
		).toThrowError("Every input must be a number.");
		expect(() => hamilton([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0)).toThrowError(
			"Cannot divide by 0 seats or other indivisibles.",
		);
	});
});

describe("jefferson", () => {
	test("correctly returns exact apportionment", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];

		expect(
			jefferson(Object.values(shapes), 43, (msg, data) =>
				log.push({ msg, data }),
			),
		).toEqual({
			exact: [24, 11, 4, 3, 1],
		});

		expect(log).toEqual([
			{ data: 40075, msg: "SUM_POP" },
			{ data: 931.9767441860465, msg: "INIT_DIVISOR" },
			{
				data: [
					23.47483468496569, 10.421933873986276, 4.4711416094822205,
					3.489357454772302, 1.1427323767935123,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [23, 10, 4, 3, 1], msg: "INIT_ALLOCATION" },
			{ data: 41, msg: "INIT_SEATS" },
			{ data: 465.98837209302326, msg: "DEC_DIVISOR" },
			{
				data: [
					46.94966936993138, 20.843867747972553, 8.942283218964441,
					6.978714909544604, 2.2854647535870245,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [46, 20, 8, 6, 2], msg: "UPDATE_ALLOCATION" },
			{ data: 82, msg: "UPDATE_SEATS" },
			{ data: 698.9825581395348, msg: "INC_DIVISOR" },
			{
				data: [
					31.299779579954254, 13.895911831981701, 5.961522145976295,
					4.65247660636307, 1.5236431690580163,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [31, 13, 5, 4, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 54, msg: "UPDATE_SEATS" },
			{ data: 815.4796511627907, msg: "INC_DIVISOR" },
			{
				data: [
					26.828382497103647, 11.91078157027003, 5.109876125122538,
					3.987837091168345, 1.3059798591925853,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [26, 11, 5, 3, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 46, msg: "UPDATE_SEATS" },
			{ data: 873.7281976744187, msg: "INC_DIVISOR" },
			{
				data: [
					25.0398236639634, 11.11672946558536, 4.769217716781036,
					3.7219812850904552, 1.2189145352464128,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [25, 11, 4, 3, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 44, msg: "UPDATE_SEATS" },
			{ data: 902.8524709302326, msg: "INC_DIVISOR" },
			{
				data: [
					24.232087416738775, 10.758125289276155, 4.615371983981647,
					3.6019173726681823, 1.1795947115287868,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [24, 10, 4, 3, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 42, msg: "UPDATE_SEATS" },
			{ data: 888.2903343023256, msg: "DEC_DIVISOR" },
			{
				data: [
					24.629334751439412, 10.93448799893642, 4.691033819784625,
					3.6609651984496283, 1.19893232975057,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [24, 10, 4, 3, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 42, msg: "UPDATE_SEATS" },
			{ data: 881.0092659883721, msg: "DEC_DIVISOR" },
			{
				data: [
					24.832882972525688, 11.024855668349117, 4.729802694328299,
					3.6912211091806166, 1.2088408614014012,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [24, 11, 4, 3, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 43, msg: "FINAL_SEATS" },
			{ data: 881.0092659883721, msg: "FINAL_DIVISOR" },
			{ data: [24, 11, 4, 3, 1], msg: "FINAL_ALLOCATION" },
		]);
	});

	test("correctly returns closest possible apportionment", () => {
		expect(jefferson(badPopulations, badNumSeats)).toEqual({
			low: [5, 2, 5, 0, 1, 2, 4],
			high: [5, 3, 5, 0, 1, 3, 4],
		});
	});

	test("errors with invalid input", () => {
		expect(() =>
			// @ts-expect-error "nope" is not a number
			jefferson(["nope", 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error undefined is not a number
			jefferson([undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error "nope" is not a number
			jefferson([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "nope"),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error undefined is not a number
			jefferson([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], undefined),
		).toThrowError("Every input must be a number.");
		expect(() => jefferson([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0)).toThrowError(
			"Cannot divide by 0 seats or other indivisibles.",
		);
	});
});

describe("adams", () => {
	test("correctly returns apportionment", () => {
		expect(adams(Object.values(shapes), 43)).toEqual({
			exact: [22, 10, 5, 4, 2],
		});
	});

	test("correctly logs calculation", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];

		expect(
			adams(Object.values(shapes), 43, (msg, data) => log.push({ msg, data })),
		).toEqual({
			exact: [22, 10, 5, 4, 2],
		});

		expect(log).toEqual([
			{ data: 40075, msg: "SUM_POP" },
			{ data: 931.9767441860465, msg: "INIT_DIVISOR" },
			{
				data: [
					23.47483468496569, 10.421933873986276, 4.4711416094822205,
					3.489357454772302, 1.1427323767935123,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [24, 11, 5, 4, 2], msg: "INIT_ALLOCATION" },
			{ data: 46, msg: "INIT_SEATS" },
			{ data: 1863.953488372093, msg: "INC_DIVISOR" },
			{
				data: [
					11.737417342482845, 5.210966936993138, 2.2355708047411103,
					1.744678727386151, 0.5713661883967561,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [12, 6, 3, 2, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 24, msg: "UPDATE_SEATS" },
			{ data: 1397.9651162790697, msg: "DEC_DIVISOR" },
			{
				data: [
					15.649889789977127, 6.947955915990851, 2.9807610729881473,
					2.326238303181535, 0.7618215845290082,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [16, 7, 3, 3, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 30, msg: "UPDATE_SEATS" },
			{ data: 1164.9709302325582, msg: "DEC_DIVISOR" },
			{
				data: [
					18.77986774797255, 8.33754709918902, 3.5769132875857763,
					2.7914859638178413, 0.9141859014348097,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [19, 9, 4, 3, 1], msg: "UPDATE_ALLOCATION" },
			{ data: 36, msg: "UPDATE_SEATS" },
			{ data: 1048.4738372093025, msg: "DEC_DIVISOR" },
			{
				data: [
					20.8665197199695, 9.263941221321133, 3.974348097317529,
					3.101651070908712, 1.015762112705344,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [21, 10, 4, 4, 2], msg: "UPDATE_ALLOCATION" },
			{ data: 41, msg: "UPDATE_SEATS" },
			{ data: 990.2252906976745, msg: "DEC_DIVISOR" },
			{
				data: [
					22.093962056438293, 9.808878940222376, 4.208133279512678,
					3.284101133903343, 1.075512825217423,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [23, 10, 5, 4, 2], msg: "UPDATE_ALLOCATION" },
			{ data: 44, msg: "UPDATE_SEATS" },
			{ data: 1019.3495639534885, msg: "INC_DIVISOR" },
			{
				data: [
					21.462705997682914, 9.528625256216023, 4.08790090009803,
					3.1902696729346753, 1.044783887354068,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [22, 10, 5, 4, 2], msg: "UPDATE_ALLOCATION" },
			{ data: 43, msg: "FINAL_SEATS" },
			{ data: 1019.3495639534885, msg: "FINAL_DIVISOR" },
			{ data: [22, 10, 5, 4, 2], msg: "FINAL_ALLOCATION" },
		]);
	});

	test("correctly returns closest possible apportionment", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];
		expect(
			adams(badPopulations, badNumSeats, (msg, data) =>
				log.push({ msg, data }),
			),
		).toEqual({
			low: [4, 2, 4, 1, 2, 2, 4],
			high: [4, 3, 4, 1, 2, 3, 4],
		});

		expect(log).toEqual([
			{ data: 40, msg: "SUM_POP" },
			{ data: 2, msg: "INIT_DIVISOR" },
			{ data: [4.5, 2.5, 4.5, 0.5, 1.5, 2.5, 4], msg: "INIT_QUOTIENTS" },
			{ data: [5, 3, 5, 1, 2, 3, 4], msg: "INIT_ALLOCATION" },
			{ data: 23, msg: "INIT_SEATS" },
			{ data: 4, msg: "INC_DIVISOR" },
			{
				data: [2.25, 1.25, 2.25, 0.25, 0.75, 1.25, 2],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [3, 2, 3, 1, 1, 2, 2], msg: "UPDATE_ALLOCATION" },
			{ data: 14, msg: "UPDATE_SEATS" },
			{ data: 3, msg: "DEC_DIVISOR" },
			{
				data: [
					3, 1.6666666666666667, 3, 0.3333333333333333, 1, 1.6666666666666667,
					2.6666666666666665,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [3, 2, 3, 1, 1, 2, 3], msg: "UPDATE_ALLOCATION" },
			{ data: 15, msg: "UPDATE_SEATS" },
			{ data: 2.5, msg: "DEC_DIVISOR" },
			{ data: [3.6, 2, 3.6, 0.4, 1.2, 2, 3.2], msg: "UPDATE_QUOTIENTS" },
			{ data: [4, 2, 4, 1, 2, 2, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 19, msg: "UPDATE_SEATS" },
			{ data: 2.25, msg: "DEC_DIVISOR" },
			{
				data: [
					4, 2.2222222222222223, 4, 0.4444444444444444, 1.3333333333333333,
					2.2222222222222223, 3.5555555555555554,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.375, msg: "INC_DIVISOR" },
			{
				data: [
					3.789473684210526, 2.1052631578947367, 3.789473684210526,
					0.42105263157894735, 1.263157894736842, 2.1052631578947367,
					3.3684210526315788,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4375, msg: "INC_DIVISOR" },
			{
				data: [
					3.6923076923076925, 2.051282051282051, 3.6923076923076925,
					0.41025641025641024, 1.2307692307692308, 2.051282051282051,
					3.282051282051282,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.46875, msg: "INC_DIVISOR" },
			{
				data: [
					3.6455696202531644, 2.0253164556962027, 3.6455696202531644,
					0.4050632911392405, 1.2151898734177216, 2.0253164556962027,
					3.240506329113924,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.484375, msg: "INC_DIVISOR" },
			{
				data: [
					3.6226415094339623, 2.0125786163522013, 3.6226415094339623,
					0.4025157232704403, 1.2075471698113207, 2.0125786163522013,
					3.220125786163522,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4921875, msg: "INC_DIVISOR" },
			{
				data: [
					3.6112852664576804, 2.006269592476489, 3.6112852664576804,
					0.4012539184952978, 1.2037617554858935, 2.006269592476489,
					3.2100313479623823,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.49609375, msg: "INC_DIVISOR" },
			{
				data: [
					3.6056338028169015, 2.003129890453834, 3.6056338028169015,
					0.40062597809076683, 1.2018779342723005, 2.003129890453834,
					3.2050078247261347,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.498046875, msg: "INC_DIVISOR" },
			{
				data: [
					3.6028146989835808, 2.001563721657545, 3.6028146989835808,
					0.400312744331509, 1.200938232994527, 2.001563721657545,
					3.202501954652072,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4990234375, msg: "INC_DIVISOR" },
			{
				data: [
					3.601406799531067, 2.000781555295037, 3.601406799531067,
					0.40015631105900745, 1.2004689331770222, 2.000781555295037,
					3.2012504884720596,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.49951171875, msg: "INC_DIVISOR" },
			{
				data: [
					3.6007032623559287, 2.0003907013088496, 3.6007032623559287,
					0.40007814026176985, 1.2002344207853097, 2.0003907013088496,
					3.200625122094159,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499755859375, msg: "INC_DIVISOR" },
			{
				data: [
					3.6003515968356283, 2.000195331575349, 3.6003515968356283,
					0.40003906631506986, 1.2001171989452095, 2.000195331575349,
					3.200312530520559,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4998779296875, msg: "INC_DIVISOR" },
			{
				data: [
					3.600175789833488, 2.0000976610186045, 3.600175789833488,
					0.4000195322037209, 1.2000585966111628, 2.0000976610186045,
					3.200156257629767,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.49993896484375, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000878927708198, 2.000048829317122, 3.6000878927708198,
					0.4000097658634244, 1.200029297590273, 2.000048829317122,
					3.2000781269073952,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499969482421875, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000439458489484, 2.000024414360527, 3.6000439458489484,
					0.4000048828721054, 1.2000146486163161, 2.000024414360527,
					3.200039062976843,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999847412109375, msg: "INC_DIVISOR" },
			{
				data: [
					3.600021972790361, 2.0000122071057564, 3.600021972790361,
					0.40000244142115127, 1.2000073242634537, 2.0000122071057564,
					3.20001953136921,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999923706054688, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000109863616525, 2.0000061035342513, 3.6000109863616525,
					0.4000012207068503, 1.200003662120551, 2.0000061035342513,
					3.2000097656548023,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999961853027344, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000054931724446, 2.000003051762469, 3.6000054931724446,
					0.40000061035249385, 1.2000018310574814, 2.000003051762469,
					3.2000048828199508,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499998092651367, msg: "INC_DIVISOR" },
			{
				data: [
					3.600002746584127, 2.0000015258800703, 3.600002746584127,
					0.4000003051760141, 1.2000009155280422, 2.0000015258800703,
					3.2000024414081127,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999990463256836, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000013732915397, 2.0000007629397443, 3.6000013732915397,
					0.40000015258794885, 1.2000004577638466, 2.0000007629397443,
					3.200001220703591,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999523162842, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000006866456387, 2.0000003814697993, 3.6000006866456387,
					0.40000007629395984, 1.2000002288818796, 2.0000003814697993,
					3.2000006103516787,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999761581421, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000003433227867, 2.0000001907348817, 3.6000003433227867,
					0.40000003814697627, 1.200000114440929, 2.0000001907348817,
					3.20000030517581,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999998807907104, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000171661385, 2.000000095367436, 3.600000171661385,
					0.40000001907348726, 1.2000000572204617, 2.000000095367436,
					3.200000152587898,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999403953552, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000858306906, 2.000000047683717, 3.6000000858306906,
					0.4000000095367434, 1.2000000286102301, 2.000000047683717,
					3.2000000762939473,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999701976776, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000429153447, 2.0000000238418583, 3.6000000429153447,
					0.40000000476837166, 1.2000000143051148, 2.0000000238418583,
					3.2000000381469733,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999985098839, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000021457672, 2.000000011920929, 3.600000021457672,
					0.4000000023841858, 1.2000000071525574, 2.000000011920929,
					3.2000000190734865,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999925494194, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000010728836, 2.0000000059604646, 3.600000010728836,
					0.4000000011920929, 1.2000000035762788, 2.0000000059604646,
					3.200000009536743,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999962747097, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000005364418, 2.000000002980232, 3.600000005364418,
					0.40000000059604646, 1.2000000017881394, 2.000000002980232,
					3.2000000047683717,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999998137355, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000002682209, 2.000000001490116, 3.600000002682209,
					0.40000000029802324, 1.2000000008940697, 2.000000001490116,
					3.200000002384186,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999990686774, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000013411046, 2.0000000007450582, 3.6000000013411046,
					0.4000000001490116, 1.2000000004470348, 2.0000000007450582,
					3.200000001192093,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999995343387, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000000670552, 2.000000000372529, 3.600000000670552,
					0.4000000000745058, 1.2000000002235174, 2.000000000372529,
					3.2000000005960465,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999997671694, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000003352763, 2.0000000001862643, 3.6000000003352763,
					0.4000000000372529, 1.2000000001117588, 2.0000000001862643,
					3.200000000298023,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999998835847, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000000167638, 2.000000000093132, 3.600000000167638,
					0.40000000001862646, 1.2000000000558793, 2.000000000093132,
					3.2000000001490116,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999417923, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000000083819, 2.0000000000465663, 3.600000000083819,
					0.40000000000931324, 1.2000000000279396, 2.0000000000465663,
					3.200000000074506,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999970896, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000419097, 2.000000000023283, 3.6000000000419097,
					0.40000000000465663, 1.20000000001397, 2.000000000023283,
					3.200000000037253,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999985448, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000000020955, 2.0000000000116414, 3.600000000020955,
					0.4000000000023283, 1.2000000000069848, 2.0000000000116414,
					3.2000000000186266,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999992724, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000104775, 2.0000000000058207, 3.6000000000104775,
					0.40000000000116415, 1.2000000000034925, 2.0000000000058207,
					3.200000000009313,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999996362, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000052386, 2.0000000000029106, 3.6000000000052386,
					0.40000000000058206, 1.2000000000017463, 2.0000000000029106,
					3.2000000000046565,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999998181, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000026193, 2.0000000000014553, 3.6000000000026193,
					0.400000000000291, 1.200000000000873, 2.0000000000014553,
					3.200000000002328,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999990905, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000013097, 2.0000000000007274, 3.6000000000013097,
					0.4000000000001455, 1.2000000000004365, 2.0000000000007274,
					3.200000000001164,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999995453, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000006547, 2.0000000000003637, 3.6000000000006547,
					0.40000000000007274, 1.2000000000002182, 2.0000000000003637,
					3.200000000000582,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999997726, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000003274, 2.000000000000182, 3.6000000000003274,
					0.4000000000000364, 1.2000000000001092, 2.000000000000182,
					3.200000000000291,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999998863, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000001635, 2.000000000000091, 3.6000000000001635,
					0.4000000000000182, 1.2000000000000546, 2.000000000000091,
					3.2000000000001454,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999999943, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000000000082, 2.0000000000000453, 3.600000000000082,
					0.40000000000000907, 1.2000000000000273, 2.0000000000000453,
					3.2000000000000726,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999999716, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000000000041, 2.0000000000000226, 3.600000000000041,
					0.4000000000000046, 1.2000000000000137, 2.0000000000000226,
					3.2000000000000366,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999999986, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000000205, 2.0000000000000115, 3.6000000000000205,
					0.4000000000000023, 1.2000000000000068, 2.0000000000000115,
					3.2000000000000184,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999999993, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000000103, 2.0000000000000058, 3.6000000000000103,
					0.40000000000000113, 1.2000000000000035, 2.0000000000000058,
					3.200000000000009,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999999964, msg: "INC_DIVISOR" },
			{
				data: [
					3.600000000000005, 2.0000000000000027, 3.600000000000005,
					0.4000000000000006, 1.2000000000000017, 2.0000000000000027,
					3.2000000000000046,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999999982, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000000028, 2.0000000000000013, 3.6000000000000028,
					0.4000000000000003, 1.2000000000000008, 2.0000000000000013,
					3.2000000000000024,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.499999999999999, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000000014, 2.000000000000001, 3.6000000000000014,
					0.40000000000000013, 1.2000000000000004, 2.000000000000001,
					3.200000000000001,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.4999999999999996, msg: "INC_DIVISOR" },
			{
				data: [
					3.6000000000000005, 2.0000000000000004, 3.6000000000000005,
					0.4000000000000001, 1.2000000000000002, 2.0000000000000004,
					3.2000000000000006,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 21, msg: "UPDATE_SEATS" },
			{ data: 2.5, msg: "INC_DIVISOR" },
			{ data: [3.6, 2, 3.6, 0.4, 1.2, 2, 3.2], msg: "UPDATE_QUOTIENTS" },
			{ data: [4, 2, 4, 1, 2, 2, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 19, msg: "UPDATE_SEATS" },
			{ data: 2.5, msg: "DEC_DIVISOR" },
			{ data: 2.4999999999999996, msg: "LOW_DIVISOR" },
			{ data: 2.5, msg: "HIGH_DIVISOR" },
			{ data: [4, 2, 4, 1, 2, 2, 4], msg: "LOW_ALLOCATION" },
			{ data: [4, 3, 4, 1, 2, 3, 4], msg: "HIGH_ALLOCATION" },
		]);
	});

	test("errors with invalid input", () => {
		// @ts-expect-error "nope" is not a number
		expect(() => adams(["nope", 1, 2, 3, 4, 5, 6, 7, 8, 9], 10)).toThrowError(
			"Every input must be a number.",
		);
		expect(() =>
			// @ts-expect-error undefined is not a number
			adams([undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		// @ts-expect-error "nope" is not a number
		expect(() => adams([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "nope")).toThrowError(
			"Every input must be a number.",
		);
		// @ts-expect-error undefined is not a number
		expect(() => adams([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], undefined)).toThrowError(
			"Every input must be a number.",
		);
		expect(() => adams([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0)).toThrowError(
			"Cannot divide by 0 seats or other indivisibles.",
		);
	});
});

describe("webster", () => {
	test("correctly returns apportionment", () => {
		expect(webster(Object.values(shapes), 43)).toEqual({
			exact: [24, 10, 4, 4, 1],
		});
	});

	test("correctly returns closest possible apportionment", () => {
		expect(webster(badPopulations, badNumSeats)).toEqual({
			low: [4, 2, 4, 0, 1, 2, 4],
			high: [5, 3, 5, 1, 2, 3, 4],
		});
	});

	test("errors with invalid input", () => {
		// @ts-expect-error "nope" is not a number
		expect(() => webster(["nope", 1, 2, 3, 4, 5, 6, 7, 8, 9], 10)).toThrowError(
			"Every input must be a number.",
		);
		expect(() =>
			// @ts-expect-error undefined is not a number
			webster([undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		// @ts-expect-error "nope" is not a number
		expect(() => webster([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "nope")).toThrowError(
			"Every input must be a number.",
		);
		expect(() =>
			// @ts-expect-error undefined is not a number
			webster([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], undefined),
		).toThrowError("Every input must be a number.");
		expect(() => webster([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0)).toThrowError(
			"Cannot divide by 0 seats or other indivisibles.",
		);
	});
});

describe("huntingtonHill", () => {
	test("correctly returns apportionment", () => {
		expect(huntingtonHill(Object.values(shapes), 43)).toEqual({
			exact: [23, 10, 5, 4, 1],
		});
	});

	test("correctly returns closest possible apportionment", () => {
		expect(huntingtonHill(badPopulations, badNumSeats)).toEqual({
			low: [4, 2, 4, 1, 2, 2, 4],
			high: [4, 3, 4, 1, 2, 3, 4],
		});
	});

	test("errors with invalid input", () => {
		expect(() =>
			// @ts-expect-error "nope" is not a number
			huntingtonHill(["nope", 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error undefined is not a number
			huntingtonHill([undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error "nope" is not a number
			huntingtonHill([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "nope"),
		).toThrowError("Every input must be a number.");
		expect(() =>
			// @ts-expect-error undefined is not a number
			huntingtonHill([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], undefined),
		).toThrowError("Every input must be a number.");
		expect(() =>
			huntingtonHill([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0),
		).toThrowError("Cannot divide by 0 seats or other indivisibles.");
	});
});

describe("Helper funcs", () => {
	test("getDivisor", () => {
		// (12 + 56 + 31 +  75 + 26) / 5 = 200 / 5 = 40
		expect(getDivisor([12, 56, 31, 75, 26], 5)).toEqual(40);
	});
});

/*
test("hamilton.ts", (t) => {
  t.deepEquals(
    hamiltonVerbose(Object.values(shapes), 43),
    {
      divisor: 931.9767441860465,
      quotients: [
        23.47483468496569, 10.421933873986276, 4.4711416094822205,
        3.489357454772302, 1.1427323767935123,
      ],
      preallocation: [23, 10, 4, 3, 1],
      remainders: [
        0.47483468496568904, 0.42193387398627635, 0.4711416094822205,
        0.4893574547723021, 0.14273237679351225,
      ],
      preallocationSum: 41,
      preallocationLeftOver: 2,
      leftOverAllocation: [1, 0, 0, 1, 0],
      apportionment: [24, 10, 4, 4, 1],
    },
    "Matt Parker: Hamilton-Hill Example 1"
  );
  t.deepEquals(
    hamiltonVerbose(Object.values(shapes), 44),
    {
      divisor: 910.7954545454545,
      quotients: [
        24.020761072988147, 10.66430442919526, 4.57512164691204,
        3.5705053025577045, 1.1693075483468498,
      ],
      preallocation: [24, 10, 4, 3, 1],
      remainders: [
        0.020761072988147333, 0.6643044291952602, 0.5751216469120397,
        0.5705053025577045, 0.1693075483468498,
      ],
      preallocationSum: 42,
      preallocationLeftOver: 2,
      leftOverAllocation: [0, 1, 1, 0, 0],
      apportionment: [24, 11, 5, 3, 1],
    },
    "Matt Parker: Hamilton-Hill Example 2"
  );
  t.deepEquals(
    hamiltonVerbose(populations, numSeats),
    {
      divisor: 594.1,
      quotients: [
        4.30903888234304, 5.579868708971554, 1.6748022218481737,
        8.436290186837233,
      ],
      preallocation: [4, 5, 1, 8],
      remainders: [
        0.30903888234303967, 0.5798687089715537, 0.6748022218481737,
        0.4362901868372333,
      ],
      preallocationSum: 18,
      preallocationLeftOver: 2,
      leftOverAllocation: [0, 1, 1, 0],
      apportionment: [4, 6, 2, 8],
    },
    "census.gov: Hamilton-Hill example"
  );
  t.end();
});

test("jefferson", (t) => {
  t.deepEquals(
    jeffersonVerbose(Object.values(shapes), 43),
    {
      standardDivisor: 931.9767441860465,
      preallocation: [ 23, 10, 4, 3, 1 ],
      exact: {
        modifiedDivisor: 881.0092659883721,
        quotients: [
          24.832882972525688, 11.024855668349117, 4.729802694328299,
          3.6912211091806166, 1.2088408614014012,
        ],
        apportionment: [24, 11, 4, 3, 1],
      },
    },
    "Matt Parker: Jefferson Example"
  );
  t.deepEquals(
    jeffersonVerbose(populations, numSeats),
    {
      standardDivisor: 594.1,
      preallocation: [ 4, 5, 1, 8 ],
      exact: {
        modifiedDivisor: 519.8375000000001,
        quotients: [
          4.924615865534902, 6.376992810253203, 1.9140596821121982,
          9.64147449924255,
        ],
        apportionment: [4, 6, 1, 9],
      },
    },
    "census.gov: Jefferson example"
  );
  t.deepEquals(
    jeffersonVerbose(badPopulations, badNumSeats),
    {
      standardDivisor: 2,
      preallocation: [ 4, 2, 4, 0, 1, 2, 4 ],
      low: {
        modifiedDivisor: 1.666666666666667,
        quotients: [
          5.3999999999999995, 2.9999999999999996, 5.3999999999999995,
          0.5999999999999999, 1.7999999999999996, 2.9999999999999996,
          4.799999999999999,
        ],
        apportionment: [5, 2, 5, 0, 1, 2, 4],
      },
      high: {
        modifiedDivisor: 1.6666666666666667,
        quotients: [
          5.3999999999999995, 3, 5.3999999999999995, 0.6, 1.7999999999999998, 3,
          4.8,
        ],
        apportionment: [5, 3, 5, 0, 1, 3, 4],
      },
    },
    "Jefferson with no workable solution"
  );
  t.end();
});

test("adams", (t) => {
  t.deepEquals(
    adams(Object.values(shapes), 43),
    {
      standardDivisor: 931.9767441860465,
      preallocation: [ 24, 11, 5, 4, 2 ],
      exact: {
        modifiedDivisor: 1019.3495639534885,
        quotients: [
          21.462705997682914, 9.528625256216023, 4.08790090009803,
          3.1902696729346753, 1.044783887354068,
        ],
        apportionment: [22, 10, 5, 4, 2],
      },
    },
    "Matt Parker: Adams Example"
  );
  t.deepEquals(
    adams(badPopulations, badNumSeats),
    {
      standardDivisor: 2,
      preallocation: [ 5, 3, 5, 1, 2, 3, 4 ],
      low: {
        modifiedDivisor: 2.5,
        quotients: [3.6, 2, 3.6, 0.4, 1.2, 2, 3.2],
        apportionment: [4, 2, 4, 1, 2, 2, 4],
      },
      high: {
        modifiedDivisor: 2.4999999999999996,
        quotients: [
          3.6000000000000005, 2.0000000000000004, 3.6000000000000005,
          0.4000000000000001, 1.2000000000000002, 2.0000000000000004,
          3.2000000000000006,
        ],
        apportionment: [4, 3, 4, 1, 2, 3, 4],
      },
    },
    "Adams with no workable solution"
  );
  t.end();
});

test("webster", (t) => {
  t.deepEquals(
    webster(populations, numSeats),
    {
      standardDivisor: 594.1,
      preallocation: [ 4, 6, 2, 8 ],
      exact: {
        modifiedDivisor: 594.1,
        quotients: [
          4.30903888234304, 5.579868708971554, 1.6748022218481737,
          8.436290186837233,
        ],
        apportionment: [4, 6, 2, 8],
      },
    },
    "census.gov: Webster Example"
  );
  t.deepEquals(
    webster([365, 491, 253, 189, 284], 44),
    {
      standardDivisor: 35.95454545454545,
      preallocation: [ 10, 14, 7, 5, 8 ],
      exact: {
        modifiedDivisor: 35.95454545454545,
        quotients: [
          10.151706700379266, 13.65613147914033, 7.036662452591656,
          5.2566371681415935, 7.898862199747156,
        ],
        apportionment: [10, 14, 7, 5, 8],
      },
    },
    "Mathispower4u: Webster Example 1"
  );
  t.deepEquals(
    webster([145, 270, 425, 500], 15),
    {
      standardDivisor: 89.33333333333333,
      preallocation: [ 2, 3, 5, 6 ],
      exact: {
        modifiedDivisor: 92.125,
        quotients: [
          1.5739484396200814, 2.9308005427408412, 4.613297150610584,
          5.4274084124830395,
        ],
        apportionment: [2, 3, 5, 5],
      },
    },
    "Mathispower4u: Webster Example 2"
  );
  t.deepEquals(
    webster(badPopulations, badNumSeats),
    {
      standardDivisor: 2,
      preallocation: [ 5, 3, 5, 1, 2, 3, 4 ],
      low: {
        modifiedDivisor: 2.0000000000000004,
        quotients: [
          4.499999999999999, 2.4999999999999996, 4.499999999999999,
          0.4999999999999999, 1.4999999999999998, 2.4999999999999996,
          3.999999999999999,
        ],
        apportionment: [4, 2, 4, 0, 1, 2, 4],
      },
      high: {
        modifiedDivisor: 2,
        quotients: [4.5, 2.5, 4.5, 0.5, 1.5, 2.5, 4],
        apportionment: [5, 3, 5, 1, 2, 3, 4],
      },
    },
    "Webster with no workable solution"
  );
  t.end();
});

test("huntingtonHill", (t) => {
  t.deepEquals(
    huntingtonHill(populations, numSeats),
    {
      standardDivisor: 594.1,
      preallocation: [ 4, 6, 2, 8 ],
      exact: {
        modifiedDivisor: 594.1,
        quotients: [
          4.30903888234304, 5.579868708971554, 1.6748022218481737,
          8.436290186837233,
        ],
        apportionment: [4, 6, 2, 8],
      },
    },
    "census.gov: Huntington-Hill Example"
  );
  t.deepEquals(
    huntingtonHill([380, 240, 105, 55], 22),
    {
      standardDivisor: 35.45454545454545,
      preallocation: [ 11, 7, 3, 2 ],
      exact: {
        modifiedDivisor: 36.5625,
        quotients: [
          10.393162393162394, 6.564102564102564, 2.871794871794872,
          1.5042735042735043,
        ],
        apportionment: [10, 7, 3, 2],
      },
    },
    "Mathispower4u: Huntington-Hill Example"
  );
  t.deepEquals(
    huntingtonHill(badPopulations, badNumSeats),
    {
      standardDivisor: 2,
      preallocation: [ 5, 3, 5, 1, 2, 3, 4 ],
      low: {
        modifiedDivisor: 2.041241452319315,
        quotients: [
          4.409081537009721, 2.449489742783178, 4.409081537009721,
          0.4898979485566356, 1.4696938456699067, 2.449489742783178,
          3.919183588453085,
        ],
        apportionment: [4, 2, 4, 1, 2, 2, 4],
      },
      high: {
        modifiedDivisor: 2.0412414523193148,
        quotients: [
          4.409081537009722, 2.4494897427831783, 4.409081537009722,
          0.4898979485566357, 1.4696938456699071, 2.4494897427831783,
          3.9191835884530857,
        ],
        apportionment: [4, 3, 4, 1, 2, 3, 4],
      },
    },
    "Huntington-Hill with no workable solution"
  );
  t.end();
});*/
