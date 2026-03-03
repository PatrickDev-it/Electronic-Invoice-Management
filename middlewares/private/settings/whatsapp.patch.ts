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
	whatsapp_message: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a message.',
			stringEmpty: 'Please enter a message.',
		},
	},
};
