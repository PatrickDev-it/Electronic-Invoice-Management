import { sendBirthdayCron } from './birthday';

export const StartCron = async () => {
	await sendBirthdayCron();
	console.log('Cron jobs started');
};
