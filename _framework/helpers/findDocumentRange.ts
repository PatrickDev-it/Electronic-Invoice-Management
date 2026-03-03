import { parse } from "@babel/parser";

/**
 *
 * @param {string} code
 * @param {(val: ReturnType<typeof parse>['program']['body'][0]) => boolean} predicate
 * @returns
 */

export default (function documentRange(code, predicate) {
	const parseResult = parse(code, {
		sourceType: "module",
	});

	return parseResult.program.body.find(predicate);
} satisfies FindDocumentRange);

type FindDocumentRange = (code: string, predicate: (val: ReturnType<typeof parse>["program"]["body"][0]) => boolean) => any;
