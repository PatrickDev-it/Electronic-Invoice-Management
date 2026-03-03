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
	monday: {
		type: 'string',
		optional: true,
	},
	tuesday: {
		type: 'string',
		optional: true,
	},
	wednesday: {
		type: 'string',
		optional: true,
	},
	thursday: {
		type: 'string',
		optional: true,
	},
	friday: {
		type: 'string',
		optional: true,
	},
	saturday: {
		type: 'string',
		optional: true,
	},
	sunday: {
		type: 'string',
		optional: true,
	},
	lunedi: {
		type: 'string',
		optional: true,
	},
	martedi: {
		type: 'string',
		optional: true,
	},
	mercoledi: {
		type: 'string',
		optional: true,
	},
	giovedi: {
		type: 'string',
		optional: true,
	},
	venerdi: {
		type: 'string',
		optional: true,
	},
	sabato: {
		type: 'string',
		optional: true,
	},
	domenica: {
		type: 'string',
		optional: true,
	},
};
