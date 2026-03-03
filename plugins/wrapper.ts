import { Request, Response } from 'hyper-express';

/**
 *	@param {{ req: import('hyper-express').Request, res: import('hyper-express').Response;, next: import('hyper-express').MiddlewareNext, path: string }} ctx
 *	@param {Handler | Middleware} logic
 *	@param {(path: string) => boolean} onLogicError
 *	@param {(path: string) => boolean} onBodyParseError
 * 	@returns {Promise<ReturnType<typeof logic>>}
 */
export default (async (
	{ res, path, message },
	logic,
	onLogicError = path =>
		res.json({
			success: false,
			message: message ?? `Logic error in ${path}`,
		}),
) => {
	try {
		return await logic();
	} catch (err) {
		console.log(`| Logic error from path => ${path} |`, err);
		onLogicError(path);
	}
}) satisfies Wrapper;

export type Wrapper = (
	ctx: { res: Response; path: string; message?: string },
	logic: Function,
	onLogicError?: (path: string) => boolean,
) => Promise<any>;
