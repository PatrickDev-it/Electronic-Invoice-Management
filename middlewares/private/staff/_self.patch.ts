import { error } from '@utils/request-utility';

export default async ({ res, route: { IHDir } }: Ctx, { body, validator, wrapper, companyid }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		const validate = await validator(schema, body);
		if (Array.isArray(validate)) {
			return error(res, validate[0].message);
		}
	});

const schema = {
	_id: {
		type: 'string',
	},
	firstName: {
		type: 'string',
		empty: false,
		messages: {
			required: 'First name is required.',
			string: 'First name is required.',
			stringEmpty: 'First name is required.',
		},
	},
	lastName: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Last name is required.',
			string: 'Last name is required.',
			stringEmpty: 'Last name is required.',
		},
	},
	created_at: {
		type: 'string',
		optional: true,
	},
};
