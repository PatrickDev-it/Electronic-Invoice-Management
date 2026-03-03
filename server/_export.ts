import { Server } from 'hyper-express';
import WithAI from '../_framework/_export';
import { config, plugins } from './withai.config';

export default async () => {
	const server = new Server();
	const withai = new WithAI(server);

	withai.config(config);
	withai.pushPlugin(...plugins);

	return { server, withai };
};
