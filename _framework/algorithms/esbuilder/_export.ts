import path from "path";
import { existsSync } from "fs";
import { rm } from "fs/promises";

import { build } from "esbuild";
import cleaner from "./cleaner";
import params from "./params";

import { defaultConfig } from "../../helpers/esbuild";
import replaceRange from "../../helpers/replaceRange";

import type { Config } from "../../types/config/_export";
import type { FileRoute } from "../../types/skeleton/route";
import type { Plugin } from "../../types/plugin";

export default async function esbuilder(routes: FileRoute[], config: Config, plugins: Plugin[]) {
	try {
		await rm(path.resolve(config.map.dir), {
			recursive: true,
			force: true,
		});

		plugins.forEach(async p => {
			await build({
				...defaultConfig,
				entryPoints: [path.resolve(p.plugin)],
				outfile: path.resolve(config.map.dir) + `/_plugins/${p.identifier}.js`,
			});

			p.plugin = path.resolve(config.map.dir) + `/_plugins/${p.identifier}.js`;
		});

		const handlerParams = await params.build(config.syntax.route.handler);
		if (!handlerParams) throw new Error("Handler params not found => config.syntax.route.handler = { ctx, plugins }");

		const serverMap = path.resolve(config.map.dir);
		const main = serverMap.split("\\").slice(0, -1).join("\\");
		const distDir = `${serverMap}\\dist`;

		return await Promise.all(
			routes.map(async route => {
				const entryPoints = [];
				const handler = await cleaner(route, config);

				let outfile = distDir + route.IHDir.split(main)[1];

				await build({
					...defaultConfig,
					minify: false,
					minifyIdentifiers: false,
					format: "esm",
					allowOverwrite: true,
					outfile,
					stdin: {
						contents: replaceRange(
							handler.code,
							{
								start: handler.export.parsed.start,
								end: handler.export.parsed.end,
							},
							await params.minify(route, handlerParams, handler, plugins),
						),
						resolveDir: path.dirname(route.IHDir),
						sourcefile: route.IHDir,
						loader: "ts",
					},
				});
				entryPoints.push(outfile);

				if (config.skeleton.middlewares?.import === "auto") {
					const dir = config.skeleton.middlewares.dir.split("/").slice(1).join("/");
					const IHDir = path.resolve(
						dir +
							route.IHDir.split(config.skeleton.handlers.split("/").slice(1).join("/"))
								.slice(1)
								.join("/"),
					);

					outfile = distDir + IHDir.split(main)[1];

					try {
						if (existsSync(IHDir) && require(IHDir).default) {
							const middleware = await cleaner({ ...route, IHDir }, config);

							const middlewareParams = await params.build(
								config.syntax.route.middleware,
							);

							await build({
								...defaultConfig,
								minify: false,
								minifyIdentifiers: false,
								format: "esm",
								outfile,
								stdin: {
									contents: replaceRange(
										middleware.code,
										{
											start: middleware.export.parsed.start,
											end: middleware.export.parsed.end,
										},
										await params.minify(
											{ ...route, IHDir },
											middlewareParams,
											middleware,
											plugins,
										),
									),
									resolveDir: path.dirname(IHDir),
									sourcefile: IHDir,
									loader: "ts",
								},
							});

							entryPoints.push(outfile);
						}
					} catch (error) {
						// console.error(`Export default middleware not found for ${route.IHDir}`);
					}
				}

				try {
					await build({
						...defaultConfig,
						outfile: route.OHDir,
						stdin: {
							contents: `export default [${entryPoints
								.reverse()
								.map(e => `require("${e.replace(/\\/g, "/")}").default`)
								.join(",")}]`,
							resolveDir: path.dirname(route.IHDir),
							loader: "ts",
						},
					});
				} catch (e) {
					console.log("\n\n", "route => ", route, "\n\n");
					console.log(e);
				}
			}),
		);
	} catch (e) {
		console.log(e);
	}
}
