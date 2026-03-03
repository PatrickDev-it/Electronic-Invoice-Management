import { error } from '@utils/request-utility';

export default async ({ res }: Ctx, { companyid, body, validator }: Plugins) => {
	const validate = await validator(schema, body);
	const company = await global.metadriver.GetCompanyById(companyid),
		rewards = await global.metadriver.GetCountRewards(companyid);
	if (rewards >= company.rewards) {
		return error(res, 'Maximum rewards limit reached.');
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
