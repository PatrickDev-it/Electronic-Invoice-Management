import { build } from "esbuild";
import { BuildConfig, Esbuild } from "../types/esbuilder/_export";

/**
 * @param {string} entryPoint
 * @param {string} outfile
 * @param {BuildConfig} config
 * @returns {ReturnType<typeof build>}
 */
export default (async (entryPoint, outfile, config = {}) => {
	return await build({
		entryPoints: [entryPoint],
		outfile,
		...defaultConfig,
		...config,
	});
}) satisfies Esbuild;

/** @type {BuildConfig} */
export const defaultConfig: BuildConfig = {
	bundle: true,
	minify: true,
	sourcemap: false,
	minifySyntax: true,
	platform: "node",
	format: "cjs",
	packages: "external",
};
