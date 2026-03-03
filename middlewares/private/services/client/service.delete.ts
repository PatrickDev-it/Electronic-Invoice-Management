import { error } from '@utils/request-utility'

export default async ({ res }: Ctx, { body, validator, wrapper }) =>
	await wrapper({ res }, async () => {
		const validate = await validator(schema, body)
		if (Array.isArray(validate)) {
			return error(res, validate[0].message)
		}
	})

const schema = {
	id: {
		type: 'string',
	},
	service: {
		type: 'string',
	},
}

