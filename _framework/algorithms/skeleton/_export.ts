import { readdir, stat } from "node:fs/promises";
import route from "./route";

import type { Config } from "../../types/config/_export";
import type { PatternSetting } from "../../types/patterns";
import type { FileRoute } from "../../types/skeleton/route";
import path from "node:path";

export default class Skeleton {
	#config: Config;
	public routes: FileRoute[];
	public toReplace: PatternSetting<{ pattern: string }, { action: "toReplace"; with: string }>[];

	constructor() {}

	set config(config: Config) {
		this.#config = config;

		// @ts-ignore
		this.toReplace = [
			this.#config.syntax.patterns.singularizer,
			this.#config.syntax.patterns.identity,
			...(this.#config.syntax.patterns.custom ?? []),
		].filter(x => x.action === "toReplace");
	}

	async build() {
		const routes: FileRoute[] = [];

		const build = async (input: string, output: string, PIHDir = "") => {
			try {
				if (!(await stat(input)).isDirectory()) return;
				const directorys = await readdir(input);

				await Promise.all(
					// IH = Input Handler
					// OH = Output Handler
					// PIHDir = Parent Input Handler Dir
					directorys.map(async IH_Filename => {
						if ((await stat(`${input}\\${IH_Filename}`)).isDirectory())
							return await build(
								`${input}\\${IH_Filename}`,
								output,
								`${PIHDir}\\${IH_Filename}`,
							);

						const IHDir = `${input}\\${IH_Filename}`;
						const PIHDirFilename = `${PIHDir}\\${IH_Filename}`;

						const fileRoute = await route(
							{ IH_Filename, PIHDir, IHDir, PIHDirFilename },
							this.#config,
						);

						fileRoute.forEach((_, i) =>
							this.toReplace.forEach(
								x =>
									(fileRoute[i].OHDir = fileRoute[i].OHDir.replace(
										x.pattern,
										x.with,
									)),
							),
						);

						if (fileRoute) routes.push(...fileRoute);
						return await build(IHDir, output, PIHDirFilename);
					}),
				);
			} catch (e) {
				console.error("skeleton build error => ", e);
			}
		};

		await build(
			path.resolve(require.main.path, this.#config.skeleton.handlers),
			path.resolve(require.main.path, this.#config.map.dir),
		);

		this.routes = routes;
	}
}
