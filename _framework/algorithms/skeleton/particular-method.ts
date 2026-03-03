import { Config } from "../../types/config/_export";
import { Method } from "../../types/method";
import { FileRoute, InitFileRoute } from "../../types/skeleton/route";
import { validateMethod } from "./findMethod";

/**
 * @param {FileRoute} route
 * @param {Config} config
 * @returns {Promise<Omit<FileRoute, "type">[]>}
 */
export default (async function particularMethod(route, config) {
	const { syntax, map } = config;
	const {
		singularizer: { pattern: _id, action: _idAction },
		identity: { pattern: _self, action: _selfAction },
		mixed: { pattern: _mix, action: _mixAction },
	} = syntax.patterns;

	const reg = new RegExp(`${_id}|${_mix}|${_self}`, "g");
	const matchs = route.IHDir.split("\\").pop().match(reg);

	if (!matchs) return [route];

	switch (matchs[0]) {
		case _self:
			route.OHDir = route.OHDir.replace(
				syntax.method.position === "end"
					? `${_self}${map.patterns.separator}`
					: `${_self}${map.patterns.separator}`,
				"",
			).trim();
			route.pattern = route.pattern.replace(_self, "").trim();

		case _id:
			if (!_idAction) {
				route.OHDir = route.OHDir.replace(new RegExp(_id, "g"), "id").trim();
				route.pattern = route.pattern.replace(new RegExp(_id, "g"), "id").trim();
			}
			if (_idAction === "s-less") {
				const sLess = route.PIHDirFilename.split("\\")
					.reverse()
					.slice(1)
					.find((x: string) => x.endsWith("s"));

				const reformat = (str: string) =>
					str
						.replace(
							new RegExp(_id, "g"),
							sLess ? sLess.substring(0, sLess.length - 1) : "id",
						)
						.trim();

				route.OHDir = reformat(route.OHDir);
				route.pattern = reformat(route.pattern);
			}
			if (!matchs.includes("_mix")) return [route];

		case _mix:
			const mixedHandler = require(route.IHDir).default;
			if (route.method === "_mix" && _mixAction === "methods") {
				return await Promise.all(
					Object.keys(mixedHandler)
						.filter(method => validateMethod(method, config).method)
						.flatMap(async method => {
							return {
								particular: { pattern: "_mix", case: "methods" },
								OHDir: route.OHDir.replace(_mix, method),
								IHDir: route.IHDir,
								PIHDirFilename: route.PIHDirFilename,
								pattern: route.pattern,
								method: method as Exclude<Method, "_mix">,
							};
						}),
				);
			}

			return await Promise.all(
				Object.keys(mixedHandler).flatMap(async path => {
					return {
						...route,
						particular: { pattern: "_mix", case: "subpaths", path },
						pattern: route.pattern + path,
					};
				}),
			);
		default:
			return [route as any];
	}
} satisfies ParticularMethod);

type ParticularMethod = (route: InitFileRoute, config: Config) => Promise<FileRoute[]>;
