/**
 * @param {string} str
 * @param {{start: number, end: number}} range
 * @param {string} substitute
 */

export default (function replaceRange(str, { start, end }, substitute) {
	return str.substring(0, start) + substitute + str.substring(end);
} satisfies ReplaceRange);

type ReplaceRange = (str: string, range: { start: number; end: number }, substitute: string) => string;
