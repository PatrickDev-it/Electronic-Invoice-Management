import { error } from '@utils/request-utility';

export default async ({ res }: Ctx, { body, validator }) => {
	const validate = await validator(schema, body);
	if (Array.isArray(validate)) {
		return error(res, validate[0].message);
	}
};

const schema = {
	email: {
		type: 'email',
		empty: false,
		messages: {
			emailEmpty: 'Please enter an email address.',
			email: 'Please enter a valid email address.',
		},
	},
	password: {
		type: 'string',
		empty: false,
		messages: {
			string: 'Please enter a password.',
			stringEmpty: 'Please enter a password.',
		},
	},
};
