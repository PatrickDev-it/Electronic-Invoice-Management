import { error } from '@utils/request-utility';
import validateDate from '@utils/validate-date';

export default async ({ res }: Ctx, { body, companyid, validator }: Plugins) => {
	const validate = await validator(schema(companyid), body),
		company = await global.metadriver.GetCompanyById(companyid),
		clients = await global.metadriver.GetCountClients(companyid);

	if (clients >= company.client) {
		return error(res, 'Maximum client limit reached.');
	}
	if (Array.isArray(validate)) {
		return error(res, validate[0].message);
	}
};

const schema = companyid => ({
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
			if (result) errors.push({ type: 'uniqueEmail', actual: v });
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
			if (!validateDate(day, month, year)) {
				errors.push({
					type: 'invalidBirthDate',
					actual: v,
				});
			}
			return v;
		},
	},
});
