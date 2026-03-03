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
	mail_object: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a subject.',
			stringEmpty: 'Please enter a subject.',
		},
	},
	mail_message: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter an email message.',
			stringEmpty: 'Please enter an email message.',
		},
		custom: async (v, errors) => {
			if (v === '<p></p>') {
				errors.push({
					type: 'emptyMessageMail',
					actual: v,
				});
			}
			return v;
		},
	},
	bg_header: {
		type: 'string',
		optional: true,
	},
	bg_message: {
		type: 'string',
		optional: true,
	},
	color_footer: {
		type: 'string',
		optional: true,
	},
	color_header: {
		type: 'string',
		optional: true,
	},
	color_message: {
		type: 'string',
		optional: true,
	},
};
