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
import { DISTINCT_RESULTS, SKIPPED_HOUSE } from "./mocks/examples";

describe("hamilton", () => {
	test("correctly returns apportionment and logs output", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];
		expect(
			hamilton(
				DISTINCT_RESULTS.populations,
				DISTINCT_RESULTS.seats,
				(msg, data) => log.push({ msg, data }),
			),
		).toEqual(DISTINCT_RESULTS.results.hamilton);

		expect(log).toEqual([
			{ data: 72670, msg: "SUM_POP" },
			{ data: 1345.7407407407406, msg: "INIT_DIVISOR" },
			{
				data: [
					14.350460988028074, 5.425264896105683, 12.275767166643734,
					8.390917847805147, 7.169285812577405, 6.388303288839962,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [14, 5, 12, 8, 7, 6], msg: "INIT_ALLOCATION" },
			{
				data: [
					{ i: 1, r: 0.4252648961056833 },
					{ i: 3, r: 0.39091784780514693 },
					{ i: 5, r: 0.38830328883996224 },
					{ i: 0, r: 0.3504609880280736 },
					{ i: 2, r: 0.2757671666437336 },
					{ i: 4, r: 0.16928581257740483 },
				],
				msg: "REMAINDERS",
			},
			{ data: 2, msg: "REMAINDER_SEATS" },
			{ data: 1, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: 3, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: [14, 6, 12, 9, 7, 6], msg: "FINAL_SEATS" },
		]);
	});

	test("returns apportionment when divisor methods would fail,  and logs output", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];
		expect(
			hamilton(SKIPPED_HOUSE.populations, SKIPPED_HOUSE.seats, (msg, data) =>
				log.push({ msg, data }),
			),
		).toEqual(SKIPPED_HOUSE.results.hamilton);

		expect(log).toEqual([
			{ data: 59058, msg: "SUM_POP" },
			{ data: 922.78125, msg: "INIT_DIVISOR" },
			{
				data: [
					9.863659453418673, 5.647058823529412, 9.55806156659555,
					16.38416471942836, 12.988993870432456, 9.55806156659555,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [9, 5, 9, 16, 12, 9], msg: "INIT_ALLOCATION" },
			{
				data: [
					{ i: 4, r: 0.9889938704324557 },
					{ i: 0, r: 0.8636594534186735 },
					{ i: 1, r: 0.6470588235294121 },
					{ i: 2, r: 0.5580615665955495 },
					{ i: 5, r: 0.5580615665955495 },
					{ i: 3, r: 0.38416471942835884 },
				],
				msg: "REMAINDERS",
			},
			{ data: 4, msg: "REMAINDER_SEATS" },
			{ data: 4, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: 0, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: 1, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: 2, msg: "ALLOCATE_REMAINDER_SEAT" },
			{ data: [10, 6, 10, 16, 13, 9], msg: "FINAL_SEATS" },
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
	test("correctly returns exact apportionment and logs output", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];

		expect(
			jefferson(
				DISTINCT_RESULTS.populations,
				DISTINCT_RESULTS.seats,
				(msg, data) => log.push({ msg, data }),
			),
		).toEqual(DISTINCT_RESULTS.results.jefferson);

		expect(log).toEqual([
			{ data: 72670, msg: "SUM_POP" },
			{ data: 1345.7407407407406, msg: "INIT_DIVISOR" },
			{
				data: [
					14.350460988028074, 5.425264896105683, 12.275767166643734,
					8.390917847805147, 7.169285812577405, 6.388303288839962,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [14, 5, 12, 8, 7, 6], msg: "INIT_ALLOCATION" },
			{ data: 52, msg: "INIT_SEATS" },
			{ data: 672.8703703703703, msg: "DEC_DIVISOR" },
			{
				data: [
					28.700921976056147, 10.850529792211367, 24.551534333287467,
					16.781835695610294, 14.33857162515481, 12.776606577679924,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [28, 10, 24, 16, 14, 12], msg: "UPDATE_ALLOCATION" },
			{ data: 104, msg: "UPDATE_SEATS" },
			{ data: 1009.3055555555554, msg: "INC_DIVISOR" },
			{
				data: [
					19.13394798403743, 7.233686528140912, 16.36768955552498,
					11.187890463740198, 9.559047750103208, 8.517737718453283,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [19, 7, 16, 11, 9, 8], msg: "UPDATE_ALLOCATION" },
			{ data: 70, msg: "UPDATE_SEATS" },
			{ data: 1177.523148148148, msg: "INC_DIVISOR" },
			{
				data: [
					16.400526843460657, 6.200302738406496, 14.029448190449981,
					9.589620397491597, 8.193469500088463, 7.300918044388528,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [16, 6, 14, 9, 8, 7], msg: "UPDATE_ALLOCATION" },
			{ data: 60, msg: "UPDATE_SEATS" },
			{ data: 1261.6319444444443, msg: "INC_DIVISOR" },
			{
				data: [
					15.307158387229945, 5.786949222512729, 13.094151644419982,
					8.950312370992156, 7.647238200082565, 6.814190174762626,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [15, 5, 13, 8, 7, 6], msg: "UPDATE_ALLOCATION" },
			{ data: 54, msg: "FINAL_SEATS" },
			{ data: 1261.6319444444443, msg: "FINAL_DIVISOR" },
			{ data: [15, 5, 13, 8, 7, 6], msg: "FINAL_ALLOCATION" },
		]);
	});

	test("correctly returns closest possible apportionment", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];

		expect(
			jefferson(SKIPPED_HOUSE.populations, SKIPPED_HOUSE.seats, (msg, data) =>
				log.push({ msg, data }),
			),
		).toEqual(SKIPPED_HOUSE.results.jefferson);

		expect(log).toEqual([
			{ data: 59058, msg: "SUM_POP" },
			{ data: 922.78125, msg: "INIT_DIVISOR" },
			{
				data: [
					9.863659453418673, 5.647058823529412, 9.55806156659555,
					16.38416471942836, 12.988993870432456, 9.55806156659555,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [9, 5, 9, 16, 12, 9], msg: "INIT_ALLOCATION" },
			{ data: 60, msg: "INIT_SEATS" },
			{ data: 461.390625, msg: "DEC_DIVISOR" },
			{
				data: [
					19.727318906837347, 11.294117647058824, 19.1161231331911,
					32.76832943885672, 25.97798774086491, 19.1161231331911,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [19, 11, 19, 32, 25, 19], msg: "UPDATE_ALLOCATION" },
			{ data: 125, msg: "UPDATE_SEATS" },
			{ data: 692.0859375, msg: "INC_DIVISOR" },
			{
				data: [
					13.151545937891564, 7.529411764705882, 12.744082088794066,
					21.84555295923781, 17.318658493909943, 12.744082088794066,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [13, 7, 12, 21, 17, 12], msg: "UPDATE_ALLOCATION" },
			{ data: 82, msg: "UPDATE_SEATS" },
			{ data: 807.43359375, msg: "INC_DIVISOR" },
			{
				data: [
					11.272753661049911, 6.453781512605042, 10.923498933252057,
					18.724759679346697, 14.844564423351379, 10.923498933252057,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [11, 6, 10, 18, 14, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 69, msg: "UPDATE_SEATS" },
			{ data: 865.107421875, msg: "INC_DIVISOR" },
			{
				data: [
					10.521236750313252, 6.023529411764706, 10.195265671035253,
					17.47644236739025, 13.854926795127954, 10.195265671035253,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 66, msg: "UPDATE_SEATS" },
			{ data: 893.9443359375, msg: "INC_DIVISOR" },
			{
				data: [
					10.181842016432178, 5.829222011385199, 9.866386133259923,
					16.912686161990564, 13.407993672704471, 9.866386133259923,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 62, msg: "UPDATE_SEATS" },
			{ data: 879.52587890625, msg: "DEC_DIVISOR" },
			{
				data: [
					10.34875745932451, 5.924783027965285, 10.028130168231398,
					17.18994331218713, 13.62779684766684, 10.028130168231398,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 886.735107421875, msg: "INC_DIVISOR" },
			{
				data: [
					10.264621219817807, 5.87661406025825, 9.94660065466854,
					17.05018767550268, 13.517001751344345, 9.94660065466854,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 883.1304931640625, msg: "DEC_DIVISOR" },
			{
				data: [
					10.30651763295992, 5.900600240096038, 9.987199024687595,
					17.119780278259835, 13.572173187064118, 9.987199024687595,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.3281860351562, msg: "DEC_DIVISOR" },
			{
				data: [
					10.327594356135707, 5.912666907253699, 10.007622744574482,
					17.15479005388, 13.599928142456887, 10.007622744574482,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.2293395996094, msg: "INC_DIVISOR" },
			{
				data: [
					10.317045230133525, 5.9066274109235115, 9.997400453722005,
					17.137267285694218, 13.586036489604531, 9.997400453722005,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.7787628173828, msg: "DEC_DIVISOR" },
			{
				data: [
					10.322317097905694, 5.909645616038955, 10.002508987423447,
					17.146024192840713, 13.592978766809233, 10.002508987423447,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.0040512084961, msg: "INC_DIVISOR" },
			{
				data: [
					10.319680490728706, 5.908136128014424, 9.999954068141857,
					17.14164462088852, 13.589506741581442, 9.999954068141857,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.8914070129395, msg: "DEC_DIVISOR" },
			{
				data: [
					10.320998625929974, 5.90889077562306, 10.001231364612433,
					17.143834127162744, 13.591242532454041, 10.001231364612433,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9477291107178, msg: "INC_DIVISOR" },
			{
				data: [
					10.3203395162406, 5.908513427722452, 10.000592675592406,
					17.142739304113558, 13.590374581593037, 10.000592675592406,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9758901596069, msg: "INC_DIVISOR" },
			{
				data: [
					10.320009992963476, 5.908324771844943, 10.000273361671924,
					17.142191945024695, 13.58994064773239, 10.000273361671924,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9899706840515, msg: "INC_DIVISOR" },
			{
				data: [
					10.319845239215923, 5.908230448423882, 10.00011371235821,
					17.14191827858773, 13.589723691193369, 10.00011371235821,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9970109462738, msg: "INC_DIVISOR" },
			{
				data: [
					10.319762864314788, 5.908183287842712, 10.00003388961288,
					17.141781448645933, 13.589615215521539, 10.00003388961288,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.000531077385, msg: "INC_DIVISOR" },
			{
				data: [
					10.319721677357368, 5.908159707834459, 9.999993978718082,
					17.14171303449418, 13.589560978335026, 9.999993978718082,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.9987710118294, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319742270794983, 5.908171497815058, 10.00001393412566,
					17.141747241501797, 13.589588096874166, 10.00001393412566,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9996510446072, msg: "INC_DIVISOR" },
			{
				data: [
					10.3197319740659, 5.908165602818876, 10.000003956411915,
					17.14173013798092, 13.589574537591067, 10.000003956411915,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.000091060996, msg: "INC_DIVISOR" },
			{
				data: [
					10.319726825709067, 5.908162655325197, 9.99999896756251,
					17.141721586233285, 13.589567757959664, 9.99999896756251,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.9998710528016, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319729399886842, 5.908164129071669, 10.00000146198659,
					17.14172586210604, 13.589571147774521, 10.00000146198659,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9999810568988, msg: "INC_DIVISOR" },
			{
				data: [
					10.319728112797794, 5.908163392198341, 10.000000214774394,
					17.141723724169395, 13.589569452866881, 10.000000214774394,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.0000360589474, msg: "INC_DIVISOR" },
			{
				data: [
					10.31972746925339, 5.908163023761746, 9.999999591168413,
					17.141722655201274, 13.58956860541322, 9.999999591168413,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000085579231, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727791025581, 5.908163207980038, 9.999999902971394,
					17.14172318968532, 13.589569029140037, 9.999999902971394,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.999994807411, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727951911684, 5.908163300089188, 10.000000058872892,
					17.141723456927352, 13.589569241003456, 10.000000058872892,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.0000016826671, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727871468633, 5.908163254034613, 9.999999980922142,
					17.141723323306334, 13.589569135071745, 9.999999980922142,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.999998245039, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727911690158, 5.908163277061901, 10.000000019897517,
					17.141723390116844, 13.5895691880376, 10.000000019897517,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.999999963853, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891579396, 5.908163265548256, 10.000000000409829,
					17.141723356711587, 13.589569161554673, 10.000000000409829,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.00000082326, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727881524013, 5.908163259791435, 9.999999990665986,
					17.141723340008962, 13.58956914831321, 9.999999990665986,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000003935565, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727886551705, 5.908163262669845, 9.999999995537907,
					17.141723348360276, 13.58956915493394, 9.999999995537907,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000001787048, msg: "DEC_DIVISOR" },
			{
				data: [
					10.31972788906555, 5.908163264109051, 9.999999997973868,
					17.14172335253593, 13.589569158244307, 9.999999997973868,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000000712789, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727890322472, 5.908163264828653, 9.999999999191848,
					17.14172335462376, 13.58956915989949, 9.999999999191848,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.000000017566, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727890950935, 5.908163265188455, 9.999999999800838,
					17.141723355667676, 13.589569160727082, 9.999999999800838,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.9999999907095, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891265165, 5.908163265368356, 10.000000000105334,
					17.141723356189633, 13.589569161140878, 10.000000000105334,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.0000000041377, msg: "INC_DIVISOR" },
			{
				data: [
					10.31972789110805, 5.9081632652784055, 9.999999999953086,
					17.141723355928654, 13.58956916093398, 9.999999999953086,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.9999999974236, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891186607, 5.90816326532338, 10.00000000002921,
					17.141723356059142, 13.589569161037428, 10.00000000002921,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.0000000007807, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891147329, 5.908163265300893, 9.999999999991148,
					17.141723355993896, 13.589569160985704, 9.999999999991148,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.9999999991021, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891166968, 5.908163265312137, 10.00000000001018,
					17.14172335602652, 13.589569161011568, 10.00000000001018,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9999999999413, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891157148, 5.9081632653065155, 10.000000000000664,
					17.14172335601021, 13.589569160998636, 10.000000000000664,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.0000000003611, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891152239, 5.9081632653037035, 9.999999999995905,
					17.141723356002053, 13.58956916099217, 9.999999999995905,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000000001512, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891154693, 5.9081632653051095, 9.999999999998286,
					17.141723356006132, 13.589569160995403, 9.999999999998286,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000000000463, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891155921, 5.908163265305813, 9.999999999999476,
					17.14172335600817, 13.58956916099702, 9.999999999999476,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.9999999999939, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891156534, 5.908163265306164, 10.00000000000007,
					17.14172335600919, 13.589569160997828, 10.00000000000007,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.00000000002, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891156228, 5.908163265305989, 9.999999999999773,
					17.141723356008683, 13.589569160997424, 9.999999999999773,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000000000069, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891156381, 5.908163265306076, 9.999999999999922,
					17.141723356008935, 13.589569160997625, 9.999999999999922,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000000000005, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891156457, 5.908163265306119, 9.999999999999995,
					17.141723356009063, 13.589569160997726, 9.999999999999995,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 881.9999999999972, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891156496, 5.9081632653061416, 10.000000000000032,
					17.141723356009127, 13.589569160997776, 10.000000000000032,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9999999999989, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891156475, 5.90816326530613, 10.000000000000012,
					17.14172335600909, 13.58956916099775, 10.000000000000012,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 881.9999999999997, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891156466, 5.908163265306125, 10.000000000000004,
					17.141723356009077, 13.589569160997737, 10.000000000000004,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882, msg: "INC_DIVISOR" },
			{
				data: [
					10.319727891156463, 5.908163265306122, 10, 17.14172335600907,
					13.589569160997732, 10,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882.0000000000002, msg: "INC_DIVISOR" },
			{
				data: [
					10.31972789115646, 5.908163265306121, 9.999999999999998,
					17.141723356009066, 13.589569160997728, 9.999999999999998,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882.0000000000001, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891156461, 5.908163265306122, 9.999999999999998,
					17.141723356009066, 13.58956916099773, 9.999999999999998,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 9, 17, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 882, msg: "DEC_DIVISOR" },
			{
				data: [
					10.319727891156463, 5.908163265306122, 10, 17.14172335600907,
					13.589569160997732, 10,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 5, 10, 17, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 882, msg: "INC_DIVISOR" },
			{ data: 882, msg: "LOW_DIVISOR" },
			{ data: 882.0000000000001, msg: "HIGH_DIVISOR" },
			{ data: [10, 5, 9, 17, 13, 9], msg: "LOW_ALLOCATION" },
			{ data: [10, 5, 10, 17, 13, 10], msg: "HIGH_ALLOCATION" },
		]);
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
	test("correctly logs calculation", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];

		expect(
			adams(DISTINCT_RESULTS.populations, DISTINCT_RESULTS.seats, (msg, data) =>
				log.push({ msg, data }),
			),
		).toEqual(DISTINCT_RESULTS.results.adams);

		expect(log).toEqual([
			{ data: 72670, msg: "SUM_POP" },
			{ data: 1345.7407407407406, msg: "INIT_DIVISOR" },
			{
				data: [
					14.350460988028074, 5.425264896105683, 12.275767166643734,
					8.390917847805147, 7.169285812577405, 6.388303288839962,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [15, 6, 13, 9, 8, 7], msg: "INIT_ALLOCATION" },
			{ data: 58, msg: "INIT_SEATS" },
			{ data: 2691.4814814814813, msg: "INC_DIVISOR" },
			{
				data: [
					7.175230494014037, 2.7126324480528416, 6.137883583321867,
					4.1954589239025735, 3.5846429062887024, 3.194151644419981,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [8, 3, 7, 5, 4, 4], msg: "UPDATE_ALLOCATION" },
			{ data: 31, msg: "UPDATE_SEATS" },
			{ data: 2018.6111111111109, msg: "DEC_DIVISOR" },
			{
				data: [
					9.566973992018715, 3.616843264070456, 8.18384477776249,
					5.593945231870099, 4.779523875051604, 4.2588688592266415,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 4, 9, 6, 5, 5], msg: "UPDATE_ALLOCATION" },
			{ data: 39, msg: "UPDATE_SEATS" },
			{ data: 1682.1759259259256, msg: "DEC_DIVISOR" },
			{
				data: [
					11.48036879042246, 4.340211916884547, 9.820613733314987,
					6.712734278244119, 5.735428650061925, 5.11064263107197,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [12, 5, 10, 7, 6, 6], msg: "UPDATE_ALLOCATION" },
			{ data: 46, msg: "UPDATE_SEATS" },
			{ data: 1513.958333333333, msg: "DEC_DIVISOR" },
			{
				data: [
					12.755965322691623, 4.822457685427275, 10.911793037016652,
					7.458593642493465, 6.372698500068806, 5.678491812302189,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [13, 5, 11, 8, 7, 6], msg: "UPDATE_ALLOCATION" },
			{ data: 50, msg: "UPDATE_SEATS" },
			{ data: 1429.849537037037, msg: "DEC_DIVISOR" },
			{
				data: [
					13.506316224026422, 5.106131666922996, 11.55366321566469,
					7.89733444499308, 6.747563117719911, 6.012520742437611,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [14, 6, 12, 8, 7, 7], msg: "UPDATE_ALLOCATION" },
			{ data: 54, msg: "FINAL_SEATS" },
			{ data: 1429.849537037037, msg: "FINAL_DIVISOR" },
			{ data: [14, 6, 12, 8, 7, 7], msg: "FINAL_ALLOCATION" },
		]);
	});

	test("correctly returns closest possible apportionment", () => {
		const log: { msg: string; data: number | number[] | RemainderLookup }[] =
			[];
		expect(
			adams(SKIPPED_HOUSE.populations, SKIPPED_HOUSE.seats, (msg, data) =>
				log.push({ msg, data }),
			),
		).toEqual(SKIPPED_HOUSE.results.adams);

		expect(log).toEqual([
			{ data: 59058, msg: "SUM_POP" },
			{ data: 922.78125, msg: "INIT_DIVISOR" },
			{
				data: [
					9.863659453418673, 5.647058823529412, 9.55806156659555,
					16.38416471942836, 12.988993870432456, 9.55806156659555,
				],
				msg: "INIT_QUOTIENTS",
			},
			{ data: [10, 6, 10, 17, 13, 10], msg: "INIT_ALLOCATION" },
			{ data: 66, msg: "INIT_SEATS" },
			{ data: 1845.5625, msg: "INC_DIVISOR" },
			{
				data: [
					4.931829726709337, 2.823529411764706, 4.779030783297775,
					8.19208235971418, 6.494496935216228, 4.779030783297775,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [5, 3, 5, 9, 7, 5], msg: "UPDATE_ALLOCATION" },
			{ data: 34, msg: "UPDATE_SEATS" },
			{ data: 1384.171875, msg: "DEC_DIVISOR" },
			{
				data: [
					6.575772968945782, 3.764705882352941, 6.372041044397033,
					10.922776479618905, 8.659329246954972, 6.372041044397033,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [7, 4, 7, 11, 9, 7], msg: "UPDATE_ALLOCATION" },
			{ data: 45, msg: "UPDATE_SEATS" },
			{ data: 1153.4765625, msg: "DEC_DIVISOR" },
			{
				data: [
					7.890927562734938, 4.517647058823529, 7.64644925327644,
					13.107331775542686, 10.391195096345966, 7.64644925327644,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [8, 5, 8, 14, 11, 8], msg: "UPDATE_ALLOCATION" },
			{ data: 54, msg: "UPDATE_SEATS" },
			{ data: 1038.12890625, msg: "DEC_DIVISOR" },
			{
				data: [
					8.767697291927709, 5.019607843137255, 8.496054725862711,
					14.563701972825207, 11.545772329273294, 8.496054725862711,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [9, 6, 9, 15, 12, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 60, msg: "UPDATE_SEATS" },
			{ data: 980.455078125, msg: "DEC_DIVISOR" },
			{
				data: [
					9.283444191452869, 5.314878892733564, 8.995822650913459,
					15.420390324167867, 12.224935407465841, 8.995822650913459,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 951.6181640625, msg: "DEC_DIVISOR" },
			{
				data: [
					9.564760682102955, 5.475935828877005, 9.268423337304776,
					15.887674879445681, 12.595387995570867, 9.268423337304776,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 966.03662109375, msg: "INC_DIVISOR" },
			{
				data: [
					9.422003059982016, 5.394205443371378, 9.130088660628585,
					15.650545403633059, 12.40739712996533, 9.130088660628585,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 973.245849609375, msg: "INC_DIVISOR" },
			{
				data: [
					9.35221044472289, 5.3542483660130715, 9.06245837425356,
					15.534615437680221, 12.31549048455818, 9.06245837425356,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 976.8504638671875, msg: "INC_DIVISOR" },
			{
				data: [
					9.317700443081847, 5.334490991968743, 9.029017568444505,
					15.47729213348214, 12.270045870224017, 9.029017568444505,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 978.6527709960938, msg: "INC_DIVISOR" },
			{
				data: [
					9.30054077375757, 5.324666883327917, 9.012389543456578,
					15.448788833052154, 12.247449100665595, 9.012389543456578,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.5539245605469, msg: "INC_DIVISOR" },
			{
				data: [
					9.291984618491924, 5.319768385735159, 9.004098476719268,
					15.434576515818435, 12.236181898181082, 9.004098476719268,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0045013427734, msg: "INC_DIVISOR" },
			{
				data: [
					9.287712441655836, 5.3173225152129815, 8.999958661327671,
					15.427480158799668, 12.230556067423297, 8.999958661327671,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.7792129516602, msg: "DEC_DIVISOR" },
			{
				data: [
					9.28984803890616, 5.318545169274884, 9.002028093073205,
					15.431027521448277, 12.233368336006286, 9.002028093073205,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.8918571472168, msg: "INC_DIVISOR" },
			{
				data: [
					9.288780117531415, 5.317933771968381, 9.000993258253908,
					15.42925363622912, 12.231962040071581, 9.000993258253908,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9481792449951, msg: "INC_DIVISOR" },
			{
				data: [
					9.28824624891152, 5.317628126024823, 9.000475930059284,
					15.42836684654947, 12.231259013343603, 9.000475930059284,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9763402938843, msg: "INC_DIVISOR" },
			{
				data: [
					9.287979337613812, 5.317475316227815, 9.000217288261243,
					15.427923489934436, 12.230907530283362, 9.000217288261243,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9904208183289, msg: "INC_DIVISOR" },
			{
				data: [
					9.287845887717442, 5.317398914622674, 9.000087972936479,
					15.427701821182156, 12.230731796328417, 9.000087972936479,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9974610805511, msg: "INC_DIVISOR" },
			{
				data: [
					9.287779164207302, 5.317360714643403, 9.00002331666759,
					15.427590989194705, 12.230643931244641, 9.00002331666759,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0009812116623, msg: "INC_DIVISOR" },
			{
				data: [
					9.287745802811736, 5.317341614859587, 8.999990988881512,
					15.427535573798137, 12.230599999176167, 8.999990988881512,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9992211461067, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287762483479561, 5.317351164734344, 9.000007152745521,
					15.427563281446659, 12.230621965170954, 9.000007152745521,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0001011788845, msg: "INC_DIVISOR" },
			{
				data: [
					9.287754143138159, 5.317346389792677, 8.99999907080626,
					15.427549427609957, 12.230610982163698, 8.99999907080626,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9996611624956, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287758313306988, 5.317348777262438, 9.000003111774076,
					15.427556354525198, 12.23061647366486, 9.000003111774076,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9998811706901, msg: "INC_DIVISOR" },
			{
				data: [
					9.287756228222106, 5.317347583527289, 9.000001091289713,
					15.4275528910668, 12.230613727913664, 9.000001091289713,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9999911747873, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755185680016, 5.317346986659917, 9.000000081047872,
					15.427551159338185, 12.230612355038526, 9.000000081047872,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000461768359, msg: "INC_DIVISOR" },
			{
				data: [
					9.287754664409059, 5.31734668822628, 8.999999575927037,
					15.427550293474022, 12.230611668601073, 8.999999575927037,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000186758116, msg: "DEC_DIVISOR" },
			{
				data: [
					9.28775492504453, 5.317346837443094, 8.999999828487448,
					15.427550726406091, 12.23061201181979, 8.999999828487448,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000049252994, msg: "DEC_DIVISOR" },
			{
				data: [
					9.28775505536227, 5.317346912051504, 8.999999954767658,
					15.427550942872134, 12.230612183429155, 8.999999954767658,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999980500434, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755120521142, 5.31734694935571, 9.000000017907766,
					15.427551051105159, 12.230612269233841, 9.000000017907766,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000014876714, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755087941706, 5.317346930703607, 8.999999986337711,
					15.427550996988646, 12.230612226331498, 8.999999986337711,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999997688574, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755104231424, 5.317346940029658, 9.000000002122738,
					15.427551024046902, 12.23061224778267, 9.000000002122738,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000006282644, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755096086565, 5.317346935366633, 8.999999994230224,
					15.427551010517774, 12.230612237057084, 8.999999994230224,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000001985609, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755100158995, 5.3173469376981455, 8.99999999817648,
					15.427551017282338, 12.230612242419877, 8.99999999817648,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999837091, msg: "DEC_DIVISOR" },
			{
				data: [
					9.28775510219521, 5.317346938863902, 9.00000000014961,
					15.427551020664621, 12.230612245101273, 9.00000000014961,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.000000091135, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755101177103, 5.317346938281024, 8.999999999163046,
					15.42755101897348, 12.230612243760575, 8.999999999163046,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000000374221, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755101686155, 5.317346938572463, 8.999999999656328,
					15.42755101981905, 12.230612244430924, 8.999999999656328,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000000105656, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755101940682, 5.317346938718183, 8.999999999902968,
					15.427551020241836, 12.230612244766098, 8.999999999902968,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999971374, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102067946, 5.317346938791043, 9.00000000002629,
					15.427551020453228, 12.230612244933685, 9.00000000002629,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000000038515, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102004315, 5.317346938754612, 8.99999999996463,
					15.427551020347531, 12.230612244849892, 8.99999999996463,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000000004944, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102036131, 5.317346938772827, 8.99999999999546,
					15.42755102040038, 12.23061224489179, 8.99999999999546,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999988158, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102052039, 5.317346938781935, 9.000000000010875,
					15.427551020426804, 12.230612244912738, 9.000000000010875,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9999999996551, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102044086, 5.317346938777382, 9.000000000003167,
					15.427551020413594, 12.230612244902265, 9.000000000003167,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000000000748, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102040107, 5.3173469387751044, 8.999999999999313,
					15.427551020406986, 12.230612244897026, 8.999999999999313,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999998649, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102042096, 5.317346938776243, 9.00000000000124,
					15.42755102041029, 12.230612244899644, 9.00000000000124,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 979.9999999999699, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102041102, 5.317346938775674, 9.000000000000277,
					15.427551020408638, 12.230612244898335, 9.000000000000277,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000000000223, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102040606, 5.3173469387753896, 8.999999999999796,
					15.427551020407812, 12.230612244897682, 8.999999999999796,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999999961, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102040853, 5.317346938775531, 9.000000000000036,
					15.427551020408224, 12.230612244898007, 9.000000000000036,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000000000092, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102040729, 5.317346938775461, 8.999999999999915,
					15.427551020408018, 12.230612244897845, 8.999999999999915,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000000000027, msg: "DEC_DIVISOR" },
			{
				data: [
					9.28775510204079, 5.317346938775495, 8.999999999999975,
					15.42755102040812, 12.230612244897925, 8.999999999999975,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999999994, msg: "DEC_DIVISOR" },
			{
				data: [
					9.28775510204082, 5.317346938775513, 9.000000000000005,
					15.427551020408172, 12.230612244897966, 9.000000000000005,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980.0000000000011, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102040805, 5.317346938775504, 8.99999999999999,
					15.427551020408146, 12.230612244897944, 8.99999999999999,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980.0000000000002, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102040814, 5.317346938775509, 8.999999999999998,
					15.42755102040816, 12.230612244897957, 8.999999999999998,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999999998, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102040819, 5.317346938775511, 9.000000000000002,
					15.427551020408167, 12.230612244897962, 9.000000000000002,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102040816, 5.31734693877551, 9, 15.427551020408163,
					12.230612244897959, 9,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 979.9999999999999, msg: "DEC_DIVISOR" },
			{
				data: [
					9.287755102040817, 5.317346938775511, 9.000000000000002,
					15.427551020408165, 12.23061224489796, 9.000000000000002,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 10, 16, 13, 10], msg: "UPDATE_ALLOCATION" },
			{ data: 65, msg: "UPDATE_SEATS" },
			{ data: 980, msg: "INC_DIVISOR" },
			{
				data: [
					9.287755102040816, 5.31734693877551, 9, 15.427551020408163,
					12.230612244897959, 9,
				],
				msg: "UPDATE_QUOTIENTS",
			},
			{ data: [10, 6, 9, 16, 13, 9], msg: "UPDATE_ALLOCATION" },
			{ data: 63, msg: "UPDATE_SEATS" },
			{ data: 980, msg: "DEC_DIVISOR" },
			{ data: 979.9999999999999, msg: "LOW_DIVISOR" },
			{ data: 980, msg: "HIGH_DIVISOR" },
			{ data: [10, 6, 9, 16, 13, 9], msg: "LOW_ALLOCATION" },
			{ data: [10, 6, 10, 16, 13, 10], msg: "HIGH_ALLOCATION" },
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
		expect(
			webster(DISTINCT_RESULTS.populations, DISTINCT_RESULTS.seats),
		).toEqual(DISTINCT_RESULTS.results.webster);
	});

	test("correctly returns closest possible apportionment", () => {
		expect(webster(SKIPPED_HOUSE.populations, SKIPPED_HOUSE.seats)).toEqual(
			SKIPPED_HOUSE.results.webster,
		);
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
		expect(
			huntingtonHill(DISTINCT_RESULTS.populations, DISTINCT_RESULTS.seats),
		).toEqual(DISTINCT_RESULTS.results.huntingdonHill);
	});

	test("correctly returns closest possible apportionment", () => {
		expect(
			huntingtonHill(SKIPPED_HOUSE.populations, SKIPPED_HOUSE.seats),
		).toEqual(SKIPPED_HOUSE.results.huntingdonHill);
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
