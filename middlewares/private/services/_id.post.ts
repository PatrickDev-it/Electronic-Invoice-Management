import { error } from '@utils/request-utility';

export default async ({ res }: Ctx, { companyid, body, validator }) => {
	const validate = await validator(schema, body);

	const company = await global.metadriver.GetCompanyById(companyid),
		services = await global.metadriver.GetCountServices(companyid);
	if (services >= company.services) {
		return error(res, 'Maximum service limit reached.');
	}
	if (Array.isArray(validate)) {
		return error(res, validate[0].message);
	}
};
const schema = {
	name: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Name is required.',
			string: 'Name is required.',
			stringEmpty: 'Name is required.',
		},
	},
	price: {
		type: 'string',
		numeric: true,
		empty: false,
		messages: {
			required: 'Price is required.',
			string: 'Price is required.',
			stringNumeric: 'Price must be numeric.',
			stringEmpty: 'Price is required.',
		},
	},
	points: {
		type: 'string',
		numeric: true,
		empty: false,
		messages: {
			required: 'Points are required.',
			string: 'Points are required.',
			stringNumeric: 'Points must be numeric.',
			stringEmpty: 'Points are required.',
		},
	},
};
