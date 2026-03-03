export declare type Skeleton = {
	handlers: string;
	middlewares?: {
		dir: string;
		/**
		 * * **"manual"**: Use the middlewares that you `export` trough
		 * ```
		 * export const middlewares = [middleware];
		 * ```
		 * * **"auto"**: Import the middleware with the `same filename` as the handler
		 * * * and returns it as `{ middleware }` parameter in the handler
		 * ```
		 * export default ({ req, res, middleware }: Ctx) => {
		 * if(!middleware(req, res)) return
		 * ...
		 * }
		 * ```
		 * * * if not called in the handler, it will be placed before the handler
		 * ```
		 * router.post("/", ...middlewares, handler)
		 * ```
		 */
		import: "auto" | "manual";
	};
	validators?: string;
	drivers?: string;
};
