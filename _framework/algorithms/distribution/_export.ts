import path from "path";
import { mkdir, readFile, rm, writeFile } from "fs/promises";

import type { Config } from "../../types/config/_export";
import type { FileRoute } from "../../types/skeleton/route";

export default async function distBuilder(routes: FileRoute[], config: Config) {
	const serverMap = path.resolve(config.map.dir);
	const main = serverMap.split("\\").slice(0, -1).join("\\");

	const distDir = `${main}\\dist`;
	const routesDir = `${distDir}\\routes`;

	await rm(distDir, {
		recursive: true,
		force: true,
	});

	await mkdir(distDir, { recursive: true });
	await mkdir(routesDir, { recursive: true });

	const serverAssignments: { [key: string]: string[] } = {
		any: [],
		all: [],
		use: [],
		get: [],
		post: [],
		put: [],
		patch: [],
		delete: [],
	};

	await Promise.all(
		routes.map(async route => {
			const filename = route.OHDir.split("\\").pop().replace(/\s/g, "").split(".").slice(0, -1).join(".");
			const extension = route.OHDir.split("\\").pop().split(".").pop();

			const routeDir = `${routesDir}\\[${route.method}]${!filename.length ? "" : `(${filename})`}.${extension}`;
			await writeFile(routeDir, await readFile(route.OHDir));

			serverAssignments[route.method].push(
				`          server.${route.method}('${route.pattern}', ...require('./${path
					.relative(distDir, routeDir)
					.replace(/\\/g, "/")}').default);`,
			);
		}),
	);

	const assignments = Object.keys(serverAssignments)
		.map(method => {
			if (!serverAssignments[method].length) return "";
			return `          // ${method.toUpperCase()} routes \n` + serverAssignments[method].join("\n");
		})
		.join("\n\n");

	await writeFile(
		`${distDir}\\server.ts`,
		`export default async server => {
				${assignments}
		};`,
	);

	return {
		main,
		distDir,
		routesDir,
		serverDir: `${distDir}\\server.ts`,
	};
}
