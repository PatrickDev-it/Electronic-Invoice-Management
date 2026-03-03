import { error } from '@utils/request-utility';
import isValidDate from '@utils/validate-date';

export default async ({ res, route: { IHDir } }: Ctx, { body, validator, wrapper, companyid }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		const validate = await validator(schema(companyid, body._id), body);
		if (Array.isArray(validate)) {
			return error(res, validate[0].message);
		}
	});

const schema = (companyid, id) => ({
	_id: {
		type: 'string',
	},
	firstName: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a first name.',
			stringEmpty: 'Please enter a first name.',
		},
	},
	lastName: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a last name.',
			stringEmpty: 'Please enter a last name.',
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
		custom: async (v, errors) => {
			const result = await global.metadriver.GetClientbyEmail(v, companyid);
			if (result && result._id.toString() !== id) errors.push({ type: 'uniqueEmail', actual: v });
			return v;
		},
	},
	phone: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a phone number.',
			stringEmpty: 'Please enter a phone number.',
		},
	},
	birthdate: {
		type: 'object',
		optional: true,
		custom: (v, errors) => {
			if (!v) {
				return;
			}

			const { day, month, year } = v;

			if ((day || month || year) && !(day && month && year)) {
				errors.push({ type: 'birthDate', actual: v });
			}

			if (!isValidDate(day, month, year)) {
				errors.push({
					type: 'invalidBirthDate',
					actual: v,
				});
			}
			return v;
		},
	},
	total_points: {
		type: 'number',
		optional: true,
	},
	created_at: {
		type: 'string',
		optional: true,
	},
	update_date: {
		type: 'string',
		optional: true,
	},
	sending_date: {
		type: 'string',
		optional: true,
	},
});
