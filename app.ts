import _ from '_global';
import 'module-alias/register';

import { config } from 'dotenv';
import MongoDriver from './drivers/_export';

import { writeFile } from 'fs/promises';
import initServer from './server/_export';
import { StartCron } from './cron/cron';

(async () => {
	config({ path: __dirname + '/.env' });

	const mongoDriver = new MongoDriver();

	await mongoDriver.connect();
	globalThis.metadriver = mongoDriver.drivers;

	const { server, withai } = await initServer();
	await withai.setRoutes({
		mode: process.env.MODE,
		format: process.env.FORMAT,
	});

	await StartCron();
	await writeFile(__dirname + '/server/routes.json', JSON.stringify(withai.routes));

	server.listen(process.env.PORT ?? 5000);
})();
