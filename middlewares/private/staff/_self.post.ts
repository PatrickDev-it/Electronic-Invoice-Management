import { error } from '@utils/request-utility';

export default async ({ res, route: { IHDir } }: Ctx, { body, validator, wrapper, companyid }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		const validate = await validator(schema, body);
		const company = await global.metadriver.GetCompanyById(companyid),
			staff = await global.metadriver.GetCountStaff(companyid);
		if (staff >= company.staff) {
			return error(res, 'Maximum staff limit reached.');
		}
		if (Array.isArray(validate)) {
			return error(res, validate[0].message);
		}
	});

const schema = {
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
};
