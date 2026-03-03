import { DefaultConfig, InitConfig, Config as RequiredConfig } from "../../types/config/_export";

const defaultConfig: DefaultConfig = {
	syntax: {
		patterns: {
			separator: ".",
			singularizer: { pattern: "_id", action: "s-less" },
			identity: { pattern: "_self", action: "toReplace", with: "" },
			mixed: { pattern: "_mix", action: "methods" },
			custom: [],
		},
		method: {
			position: "end",
			custom: [],
		},
	},
	map: { dir: "./_server-map", patterns: { separator: " - " } },
	exceptions: [],
};

export default class Config {
	private required_config: RequiredConfig;

	constructor() {
		// @ts-ignore
		this.required_config = defaultConfig;
	}

	set set({ syntax, skeleton, map, exceptions }: InitConfig) {
		if (skeleton) this.required_config.skeleton = skeleton;
		if (map) {
			this.required_config.map.dir = map.dir ?? this.required_config.map.dir;
			this.required_config.map.patterns = map.patterns ?? this.required_config.map.patterns;
		}

		if (syntax) {
			if (syntax.route)
				this.required_config.syntax.route = {
					...this.required_config.syntax.route,
					...syntax.route,
				};
			if (syntax.patterns)
				this.required_config.syntax.patterns = {
					...this.required_config.syntax.patterns,
					...syntax.patterns,
				};
			if (syntax.method)
				this.required_config.syntax.method = {
					...this.required_config.syntax.method,
					...syntax.method,
				};
		}

		if (exceptions) this.required_config.exceptions = exceptions;
	}

	get isConfigRequired() {
		const { skeleton, map } = this.required_config;

		if (!skeleton) throw new Error("| Skeleton is not defined |");
		if (!skeleton.handlers) throw new Error("| Handlers dir is not defined |");

		if (!map) throw new Error("| Map config is not defined |");
		if (!map.dir) throw new Error("| Map dir is not defined |");

		if (!this.required_config)
			throw new Error(
				"| All the mandatory configs would appear to be satisfied, but something went wrong, you should call Patrick |",
			);

		return this.required_config;
	}

	get syntax() {
		return this.required_config.syntax;
	}

	get skeleton() {
		return this.required_config.skeleton;
	}

	get map() {
		return this.required_config.map;
	}

	get exceptions() {
		return this.required_config.exceptions;
	}
}
