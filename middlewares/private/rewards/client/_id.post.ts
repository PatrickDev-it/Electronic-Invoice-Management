import { error } from '@utils/request-utility';

export default async ({ res }: Ctx, { body, companyid, validator, wrapper }: Plugins) =>
	await wrapper({ res }, async () => {
		const validate = await validator(schema(companyid), body);
		if (Array.isArray(validate)) {
			return error(res, validate[0].message);
		}
	});

const schema = (companyid: string) => ({
	id: {
		type: 'string',
	},
	reward_id: {
		type: 'string',
		empty: false,
		messages: {
			required: 'Please select a reward.',
			string: 'Please select a reward.',
			stringEmpty: 'Please select a reward.',
		},
		custom: async (value, errors, schema, name, parent, context) => {
			if (!value) {
				return;
			}
			const client = await global.metadriver.GetClient(context.data.id, companyid);
			const reward = await global.metadriver.GetReward(value, companyid);
			if (client.total_points < parseInt(reward.points)) {
				errors.push({
					type: 'insufficientPoints',
					actual: value,
				});
			}
			return value;
		},
	},
	assigned_by: {
		type: 'string',
	},
});
