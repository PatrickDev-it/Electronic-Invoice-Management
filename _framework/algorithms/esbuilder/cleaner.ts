import { readFile } from "fs/promises";
import { FileRoute } from "../../types/skeleton/route";
import { parse } from "@babel/parser";
import { ArrowFunctionExpression, Identifier, Statement, VariableDeclarator } from "@babel/types";
import removeExportName from "./remove-export-name";
import { Config } from "../../types/config/_export";
import replaceRange from "../../helpers/replaceRange";
import { transform } from "esbuild";
import { Param } from "../../types/esbuilder/ctx";

export default async (route: FileRoute, config: Config) => {
	try {
		let code = await readFile(route.IHDir, "utf-8");

		let parsed = parse(code, {
			sourceFilename: route.IHDir,
			sourceType: "module",
			plugins: ["typescript"],
		});

		const exportDefault = parsed.program.body.find(b => b.type === "ExportDefaultDeclaration");

		if (route.particular) {
			switch (route.particular.case) {
				case "methods": {
					code = replaceRange(
						code,
						{ start: exportDefault.start, end: exportDefault.end },
						`export default ${require(route.IHDir).default[route.method].toString()}`,
					);
					break;
				}
				case "subpaths": {
					code = replaceRange(
						code,
						{ start: exportDefault.start, end: exportDefault.end },
						`export default ${require(route.IHDir).default[
							route.particular.path
						].toString()}`,
					);
					break;
				}
			}
		}

		["middlewares", "body"].forEach(identifier => {
			code = removeExportName(parsed, code, identifier);
		});

		code = (
			await transform(code, {
				platform: "node",
				minifyIdentifiers: false,
				minifySyntax: true,
				minifyWhitespace: true,
				keepNames: false,
				format: "esm",
				loader: "ts",
				sourcefile: route.IHDir,
			})
		).code;

		parsed = parse(code, {
			sourceFilename: route.IHDir,
			sourceType: "module",
			plugins: ["typescript"],
		});

		let exportIdentifier = {
			type: "Identifier",
		} as Identifier;

		parsed.program.body.forEach(b => {
			if (b.type === "ExportDefaultDeclaration") {
				console.log("b => ", b);
			}
			if (b.type === "ExportNamedDeclaration") {
				b.specifiers.forEach(
					s =>
						s.type === "ExportSpecifier" &&
						s.exported.type === "Identifier" &&
						s.exported.name === "default" &&
						(exportIdentifier = s.local),
				);
			}
		});

		const predicate = (state: Statement) => {
			if (state.type === "FunctionDeclaration" && state.id.name === exportIdentifier.name) {
				code = replaceRange(
					code,
					{ start: state.start!, end: state.end! },
					`const ${exportIdentifier.name} = ${state.async ? "async " : ""} (${code.substring(
						state.params[0].start!,
						state.params.slice(-1)[0]!.end!,
					)}) => ${code.substring(state.body.start!, state.body.end!)};`,
				);

				parsed = parse(code, {
					sourceFilename: route.IHDir,
					sourceType: "module",
					plugins: ["typescript"],
				});

				for (const state of parsed.program.body) {
					const findIt = predicate(state);
					if (findIt) return findIt;
				}
			}
			if (state.type === "VariableDeclaration") {
				for (const d of state.declarations) {
					if (
						d.init.type === "ArrowFunctionExpression" &&
						"name" in d.id &&
						d.id.name === exportIdentifier.name
					) {
						return {
							code: code.substring(d.init.start!, d.init.end!),
							parsed: d.init,
							params: d.init.params,
						};
					}
				}
			}
		};

		return parsed.program.body.reduce(
			(acc, state) => {
				if (!acc.export) {
					acc.export = predicate(state);
					acc.code = code;
					return acc;
				}

				if (state.type === "VariableDeclaration") {
					for (const d of state.declarations) {
						if (
							d.type === "VariableDeclarator" &&
							"name" in d.id &&
							d.id.name !== exportIdentifier.name
						) {
							acc.external.push({
								code: code.substring(state.start!, state.end!),
								parsed: d,
							});
						}
					}
				}

				return acc;
			},
			{ external: [] } as Cleaned,
		);
	} catch (error) {
		console.log("| cleaner ERROR => ", error, route);
	}
};

type Cleaned = {
	code: string;
	export: {
		code: string;
		parsed: ArrowFunctionExpression;
		params: Param[];
	};
	external: {
		code: string;
		parsed: VariableDeclarator | ArrowFunctionExpression;
	}[];
};
