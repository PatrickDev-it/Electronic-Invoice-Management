import { Method } from "../method";
import { IdentityPattern, SingularizerPattern, MixedPattern, PatternSetting } from "../patterns";
import { Symbols } from "../symbols";

export type Syntax = {
	route: {
		handler: ArgsFormat;
		middleware: ArgsFormat;
	};
	patterns?: {
		separator: `${string}${Symbols}${string}`;
		singularizer: PatternSetting<
			{ pattern: SingularizerPattern },
			{ action: "toReplace"; val: string } | { action: "s-less" }
		>;
		identity: PatternSetting<{ pattern: IdentityPattern }, { action: "toReplace"; with: string }>;
		mixed: PatternSetting<{ pattern: MixedPattern }, { action: "subpaths" } | { action: "methods" }>;
		custom?: PatternSetting<{ pattern: string }, { action: "toReplace"; with: string } | { action: "s-less" }>[];
	};
	method?: {
		/**
		 * * **"export"**: All route files must contain an
		 * ```js
		 * //**@type { Method }*\/
		 * export const method = "patch";
		 * ```
		 * * **"begin"**: The method will be extracted from the `beginning` of the file name;
		 * ```js
		 * "get.pathname.js" = { route: "/pathname", method: "get" }
		 * ```
		 * * **"end"**: The method will be extracted from the `end` of the file name;
		 * ```js
		 * // Excluding the starting folder
		 * __dirname = "/parent/many/paths"
		 * __filename = "do.you.want.post.js" = { route: "/parent/many/paths/do/you/want", method: "post" }
		 * ```
		 * @default "end"
		 */
		position: Position;
		custom?: { pattern: string; toReplace: Method }[];
	};
};

export type ArgsFormat = {
	ctx: (...args: any[]) => { req; res; next?: Function } | Promise<{ req; res; next?: Function }>;
	plugins: (...args: any[]) => { [key: string]: any } | Promise<{ [key: string]: any }>;
};

export type Settings = { toReplace: string } | { action: string };

export type Position = "begin" | "end" | "export";
