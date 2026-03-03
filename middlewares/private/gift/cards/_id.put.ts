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
	_id: {
		type: 'string',
	},
	name: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a name.',
			stringEmpty: 'Please enter a name.',
		},
	},
	total: {
		type: 'number',
		empty: false,
		messages: {
			required: 'Please enter an amount.',
			numberEmpty: 'Please enter an amount.',
		},
	},
	email: {
		type: 'email',
		empty: false,
		messages: {
			email: 'Please enter a valid email address.',
			emailEmpty: 'Please enter a valid email address.',
			required: 'Please enter a valid email address.',
		},
		optional: true,
	},
	phone: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please enter a phone number.',
			stringEmpty: 'Please enter a phone number.',
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
	expire_date: {
		type: 'string',
		optional: true,
	},
	sended: {
		type: 'boolean',
		optional: true,
	},
	note: {
		type: 'string',
		optional: true,
	},
	status: {
		type: 'string',
	},
	credit: {
		type: 'number',
		empty: false,
		messages: {
			required: 'Please enter the remaining credit.',
			numberEmpty: 'Please enter the remaining credit.',
		},
	},
};
