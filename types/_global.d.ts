import { FileRoute } from './_framework/types/skeleton/route';
import { Request, Response, MiddlewareNext } from 'hyper-express';

import { Wrapper as Wr } from './plugins/wrapper';
import { Validator as Val } from './plugins/validator';

import type { Drivers } from '../drivers/_export';
import type { Env } from './env';

declare global {
	// process.env
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}

	// global.metadriver
	var metadriver: Drivers;

	type Req = Request & { [key: string]: any };
	type Res = Response;

	type Ctx = {
		req: Req;
		res: Res;
		next?: MiddlewareNext;
	} & { route: FileRoute };

	type Validator = { validator: Val };
	type Wrapper = { wrapper: Wr };
	type Plugins = Validator & Wrapper & { [key: string]: any };
}

export {};
