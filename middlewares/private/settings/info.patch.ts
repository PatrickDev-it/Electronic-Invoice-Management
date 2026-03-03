import { error } from '@utils/request-utility';

export default async ({ res }: Ctx, { body, validator }) => {
	const validate = await validator(schema, body);
	if (Array.isArray(validate)) {
		return error(res, validate[0].message);
	}
};

const schema = {
	_id: {
		type: 'string',
	},
	name: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a name.',
			stringEmpty: 'Please enter a name.',
		},
	},
	email: {
		type: 'email',
		empty: false,
		messages: {
			required: 'Please enter an email address.',
			emailEmpty: 'Please enter an email address.',
			email: 'Please enter a valid email address.',
		},
	},
	phone: {
		type: 'string',
		optional: true,
	},
	location: {
		type: 'string',
		optional: true,
	},
	facebook: {
		type: 'string',
		optional: true,
	},
	instagram: {
		type: 'string',
		optional: true,
	},
	tiktok: {
		type: 'string',
		optional: true,
	},
	youtube: {
		type: 'string',
		optional: true,
	},
	description: {
		type: 'string',
		optional: true,
	},
	telefono: {
		type: 'string',
		optional: true,
	},
	sede: {
		type: 'string',
		optional: true,
	},
	descrizione: {
		type: 'string',
		optional: true,
	},
	website: {
		type: 'string',
		optional: true,
	},
};
