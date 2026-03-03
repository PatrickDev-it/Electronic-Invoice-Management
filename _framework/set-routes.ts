import type { Config } from "./types/config/_export";
import type { FileRoute } from "./types/skeleton/route";
import type { Server } from "./types/server";

export default async (server: Server, routes: FileRoute[], config: Config) => {
	return await Promise.all(
		routes.map(async ({ OHDir, IHDir, PIHDirFilename, pattern, method }) => {
			try {
				return server[method](pattern, ...require(OHDir).default);
			} catch (e) {
				console.log(e);
			}
		}),
	);
};
