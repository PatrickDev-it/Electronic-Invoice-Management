import { success } from '@utils/request-utility'

/** @type {Handler} */
export default async ({ res }: Ctx, { body, companyid, wrapper }: Plugins) =>
	await wrapper({ res }, async () => {
		body.skip = body.size ?? 10 * body.start
		return success(
			res,
			await global.metadriver.GetAllServiceClient(body, companyid)
		)
	})
