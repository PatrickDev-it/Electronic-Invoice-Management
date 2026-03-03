import { error } from '@utils/request-utility';

export default async ({ req, res, route: { IHDir } }: Ctx, { body, companyid, validator, wrapper }: Plugins) => {
	await wrapper({ res, path: IHDir }, async () => {
		const validate = await validator(schema, body);
		const company = await global.metadriver.GetCompanyById(companyid);
		const isGiftCardEnabled = company.giftcard ?? company.buoni_regalo;
		if (!isGiftCardEnabled) {
			return error(res, 'Service is not enabled. Contact the administrator.');
		}
		if (Array.isArray(validate)) {
			return error(res, validate[0].message);
		}
	});
};

const schema = {
	name: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a name.',
			stringEmpty: 'Please enter a name.',
		},
	},
	email: {
		type: 'email',
		empty: false,
		messages: {
			email: 'Please enter a valid email address.',
			required: 'Please enter an email address.',
			emailEmpty: 'Please enter an email address.',
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
	total: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter an amount.',
			stringEmpty: 'Please enter an amount.',
		},
	},
	message: {
		type: 'string',
		optional: true,
	},
	expire: [
		{ type: 'boolean', optional: true },
		{ type: 'string', optional: true },
	],
	created_by: {
		type: 'string',
		optional: true,
	},
};
