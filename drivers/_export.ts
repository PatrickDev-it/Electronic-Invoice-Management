import { Db, MongoClient } from 'mongodb';

/* eslint global-require:0 */
import users from './logic/users';
import clients from './logic/clients';
import mailLogs from './logic/mail-logs';
import usersLogs from './logic/users-logs';
import settings from './logic/settings';
import services from './logic/services';
import rewards from './logic/rewards';
import staff from './logic/staff';
import giftcard from './logic/giftcard';
import company from './logic/company';
import coupon from './logic/coupon';

const logics = [users, clients, mailLogs, usersLogs, settings, services, rewards, staff, giftcard, company, coupon];

export default class MongoDriver {
	db: Db;
	#drivers: Drivers;

	constructor() {
		this.#drivers = logics.reduce((drivers, logic) => {
			drivers = Object.entries(logic).reduce(
				(acc, [key, value]) => {
					acc[key] = value.bind(this);
					return acc;
				},
				{ ...drivers },
			);
			return drivers;
		}, {} as any);
	}

	get drivers() {
		return this.#drivers;
	}

	async connect() {
		this.db = await this.connectToDB();
		this.db.collection('mail-logs').createIndex({ created_at: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
		this.db.collection('user-logs').createIndex({ created_at: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
	}

	async connectToDB() {
		const uri = process.env.DBURI;
		const client = new MongoClient(uri, {
			zlibCompressionLevel: 9,
		});
		console.info('Connecting to MongoDB...');
		await client.connect();
		console.info('Connected to MongoDB.');
		return client.db(process.env.DBNAME);
	}
}

type Combine<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Drivers = Combine<(typeof logics)[number]>;
