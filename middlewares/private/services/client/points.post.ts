import { error } from '@utils/request-utility';
import { Plugin } from '../../../../_framework/types/plugin';

export default async ({ res }: Ctx, { body, validator, wrapper }: Plugins) =>
	await wrapper({ res }, async () => {
		const validate = await validator(schema, body);
		if (Array.isArray(validate)) {
			return error(res, validate[0].message);
		}
	});

const schema = {
	id: {
		type: 'string',
	},
	services: {
		type: 'array',
		items: 'string',
		custom: (value, errors, schema, name, parent, context) => {
			if (!value.length && (!context.data.generic.points || context.data.generic.points <= 0)) {
				errors.push({
					type: 'requireOneService',
					expected: schema.generic,
					actual: value,
				});
			}
			return value;
		},
	},
	generic: {
		type: 'object',
		props: {
			points: {
				type: 'number',
				messages: {
					number: 'Please enter a number.',
					required: 'Please enter a number.',
				},
			},
			price: {
				type: 'number',
				messages: {
					number: 'Please enter a number.',
					required: 'Please enter a number.',
				},
			},
		},
	},
	assigned_by: {
		optional: true,
		type: 'string',
	},
};
