import { Config } from "../../types/config/_export";
import { FileRoute, InitFileRoute } from "../../types/skeleton/route";
import buildOHDir from "../../helpers/buildOHDir";
import buildRoutePattern from "../../helpers/buildRoutePattern";
import findMethod from "./findMethod";
import path from "node:path";
import particularMethod from "./particular-method";

/**
 *
 * @param {{ input: string; PIHDir: string, IH_Filename: string }} inputs
 * @param {Config} config
 * @returns {Promise<Route>}
 */

export default (async function route({ PIHDirFilename, IHDir, PIHDir, IH_Filename }, config): Promise<FileRoute[]> {
	const { method, config: usedConfig } = await findMethod(IHDir, config);

	// IH = Input Handler
	// OH = Output Handler
	// PIHDir = Parent Input Handler Dir
	const fileRoute: InitFileRoute = {
		exceptions: false,
		OHDir: buildOHDir({ PIHDir, IH_Filename, method }, { ...config, ...usedConfig }),
		IHDir: path.resolve(IHDir),
		PIHDirFilename,
		pattern: buildRoutePattern(PIHDir, IH_Filename, usedConfig),
		method,
	};

	if (config.exceptions.some(({ dir }) => dir === IHDir))
		fileRoute.exceptions = config.exceptions.find(e => {
			delete e.dir;
			return e;
		});

	delete fileRoute.exceptions;
	return await particularMethod(fileRoute, config);
} satisfies BuildRoute);

type BuildRoute = (
	inputs: { PIHDirFilename: string; IHDir: string; PIHDir: string; IH_Filename: string },
	config: Config,
) => Promise<FileRoute[]>;
