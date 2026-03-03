import { Config, distBuilder, esbuilder, Skeleton } from "./algorithms/_export";
import setRoutes from "./set-routes";

import type { Plugin } from "./types/plugin";
import type { Server } from "./types/server";
import type { InitConfig } from "./types/config/_export";

export default class WithAI {
	#server: Server;

	#config: Config;
	#plugins: Plugin[];

	#skeleton: Skeleton;
	#esbuilder: typeof esbuilder;

	constructor(server: Server) {
		this.#server = server;
		this.#config = new Config();
		this.#skeleton = new Skeleton();
		this.#esbuilder = esbuilder;
		this.#plugins = [];
	}

	config(config: InitConfig) {
		this.#config.set = config;
	}

	pushPlugin(...plugins: Plugin[]) {
		this.#plugins.push(...plugins);
	}

	get routes() {
		return this.#skeleton.routes;
	}

	async setRoutes({
		mode,
		format = "cjs",
	}: { mode: "dev"; format?: "esm" | "cjs" } | { mode: "prod"; format: "esm" | "cjs" }) {
		const config = this.#config.isConfigRequired;
		this.#skeleton.config = config;

		await this.#skeleton.build();
		const { routes } = this.#skeleton;

		if (mode === "dev") {
			await this.#esbuilder(routes, config, this.#plugins);
			await setRoutes(this.#server, routes, config);
		}

		if (mode === "prod") {
			const { serverDir } = await distBuilder(routes, config);
			await require(serverDir).default(this.#server);
		}

		return routes;
	}
}
