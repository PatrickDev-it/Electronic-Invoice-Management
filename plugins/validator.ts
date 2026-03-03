import FastestValidator, { ValidationSchema } from 'fastest-validator';

const v = new FastestValidator({
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

const validator = async (schema: ValidationSchema<any>, data: any) => {
	schema.$$async = true;
	schema.$$strict = 'remove';
	const check = v.compile(schema);
	return await check(data);
};

export default validator;

export type Validator = typeof validator;
