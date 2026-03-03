import { Config } from "../types/config/_export";

/**
 * @param {string} PIHDir
 * @param {string} IH_Filename
 * @param {Omit<Config, "serverMap">} config
 * @returns {string}
 */

export default function buildRoutePattern(PIHDir: string, IH_Filename: string, { syntax }: Config): string {
	if (PIHDir.endsWith("/")) PIHDir = PIHDir.substring(0, PIHDir.length - 1);
	if (IH_Filename.startsWith("/")) IH_Filename = IH_Filename.substring(1);

	if (/\[(.*?)\]/g.test(PIHDir)) PIHDir = PIHDir.replace(/\[(.*?)\]/g, m => `:${m.replace(/[\[|\]]/g, "").trim()}`);
	if (/\[(.*?)\]/g.test(IH_Filename))
		IH_Filename = IH_Filename.replace(/\[(.*?)\]/g, m => `:${m.replace(/[\[|\]]/g, "").trim()}`);

	const slice = [syntax.method.position === "begin" ? -2 : 0, syntax.method.position === "begin" ? 0 : -2];
	let route = `${PIHDir}/${IH_Filename.split(syntax.patterns.separator)
		.slice(...slice)
		.join("/")
		.trim()}`;

	if (route.endsWith("/")) route = route.substring(0, route.length - 1);
	if (!route.startsWith("/")) route = `/${route}`;

	route = route
		.replace(/\/\//g, "/")
		.replace("/" + syntax.patterns.identity.pattern, "")
		.replace(syntax.patterns.mixed.pattern, "");

	if (route.endsWith("/")) route = route.substring(0, route.length - 1);
	if (!route.startsWith("/")) route = `/${route}`;

	return route.replace(/\\/g, "/").replace(/\/\//g, "/");
}
