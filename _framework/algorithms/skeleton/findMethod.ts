import * as path from "path";
import { parse } from "@babel/parser";
import { Config } from "../../types/config/_export";

import { Method, GlobalHTTPMethod, MiddlewareRegister, HTTPMethod } from "../../types/method";
import { readFile } from "fs/promises";
import hasExportName from "./has-export-name";

/**
 *
 * @param {string} IHDir
 * @param {Config} config
 * @returns {Promise<{method: Method | undefined, config: Config}>}
 */

export default (async function findMethod(IHDir, config) {
	const { syntax, exceptions } = config;
	const dir = moduleDir(IHDir);

	if (exceptions.length) {
		const exception = exceptions.find(exception => moduleDir(exception.dir) === dir);
		if (exception)
			return await findMethod(exception.dir, {
				...config,
				exceptions: [],
			});
	}

	if (syntax.method?.position === "export") {
		try {
			const moduleString = await readFile(dir, "utf-8");

			const parsedModule = parse(moduleString, {
				sourceType: "module",
				errorRecovery: false,
				plugins: ["typescript"],
			});

			const methodExported = hasExportName(parsedModule, "method");
			if (!methodExported) return { method: undefined, config };
			return validateMethod(methodExported.extra!.name, config);
		} catch (error) {
			console.log(error);
			return { method: undefined, config };
		}
	}

	const method = IHDir.trim()
		.replace(/\\\\/g, "/")
		.replace(/\\/g, "/")
		.split("/")
		.slice(-1)[0]
		.split(syntax.patterns?.separator ?? ".")
		.splice(syntax.method?.position === "begin" ? 0 : -2, 1)[0]
		.trim() as Method;

	return validateMethod(method, config);
} satisfies FindMethod);

type FindMethod = (IHDir: string, config: Config) => Promise<{ method: Method | undefined; config: Config }>;

/**
 * @param {Method} method
 * @param {Omit<Config, "serverMap">} config
 * @returns { { method: Method | undefined, config: Omit<Config, "serverMap"> } }
 */
export const validateMethod = (method: any, config: Config): { method: Method | undefined; config: Config } => {
	if (methods.has(method) || globalMethods.has(method) || middlewareRegister.has(method))
		return {
			method,
			config,
		};

	if (config.syntax.patterns?.mixed.action === "methods" && config.syntax.patterns?.mixed.pattern === method)
		return { method, config };
	return {
		method: undefined,
		config,
	};
};

const methods: Set<HTTPMethod> = new Set(["get", "put", "post", "delete", "patch", "head", "options", "trace", "connect"]);
const globalMethods: Set<GlobalHTTPMethod> = new Set(["all", "any"]);
const middlewareRegister: Set<MiddlewareRegister> = new Set(["use"]);

/**
 *
 * @param {string} dir
 * @returns {string}
 */
export const moduleDir: (s: string) => string = dir => path.resolve(dir);
