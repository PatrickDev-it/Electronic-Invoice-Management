import Validator from 'fastest-validator';

const v = new Validator({
	useNewCustomCheckerFunction: true,
	messages: {
		uniqueEmail: 'This email already exists.',
		birthDate: 'All birth date fields must be completed.',
		invalidBirthDate: 'Invalid birth date.',
		requireOneService: 'Select at least one service.',
		insufficientPoints: 'Insufficient points to redeem this reward.',
		emptyMessageMail: 'Please enter an email message.',
	},
});

/**
 * @param {import('fastest-validator').ValidationSchema<any>} schema
 * @param {any} data
 */

export default async (schema, data) => {
	schema.$$async = true;
	schema.$$strict = 'remove';
	const check = v.compile(schema);
	return await check(data);
};
