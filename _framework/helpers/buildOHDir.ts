import path from "path";
import { DefaultConfig } from "../types/config/_export";
import { Method } from "../types/method";

/**
 * @description Build the output handler dir
 * @param {{ PIHDir: string; IH_Filename: string, method: Method }} dirs
 * @param {Config} config
 * @returns { string }
 */

export default function buildOHDir(
	{ PIHDir, IH_Filename, method }: { PIHDir: string; IH_Filename: string; method: Method },
	{ map, syntax }: Required<DefaultConfig>,
) {
	if (PIHDir.startsWith("\\")) PIHDir = PIHDir.substring(1);
	if (PIHDir.endsWith("\\")) PIHDir = PIHDir.substring(0, PIHDir.length - 1);

	if (IH_Filename.startsWith("\\")) IH_Filename = IH_Filename.substring(1);

	const serverMap = path.resolve(map.dir);
	const OHDir = `${serverMap}\\${method}`;

	const OHDirFilename =
		PIHDir.split("\\").join(map.patterns.separator) +
		map.patterns.separator +
		IH_Filename.replace(
			new RegExp(
				syntax.method.position === "end"
					? `(${syntax.patterns?.separator ?? "."}${method})|(^${method})`
					: `(${method}${syntax.patterns?.separator ?? "."})|(${method}$)`,
				"g",
			),
			"",
		);

	return `${OHDir}\\${OHDirFilename}`
		.replace(new RegExp(`\\${syntax.patterns?.separator ?? "."}^$`, "g"), "\\")
		.replace(".ts", ".js")
		.replace("..", ".")
		.replace(new RegExp(`\\${map.patterns.separator ?? " - "}.js`, "g"), ".js");
}
