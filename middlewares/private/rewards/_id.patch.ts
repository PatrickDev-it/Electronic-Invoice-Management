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
			required: 'Name is required.',
			string: 'Name is required.',
			stringEmpty: 'Name is required.',
		},
	},
	points: {
		type: 'string',
		numeric: true,
		empty: false,
		messages: {
			required: 'Points are required.',
			string: 'Points are required.',
			number: 'Points must be numeric.',
			stringEmpty: 'Points are required.',
		},
	},
	update_date: {
		type: 'string',
		optional: true,
	},
	created_at: {
		type: 'string',
		optional: true,
	},
};
