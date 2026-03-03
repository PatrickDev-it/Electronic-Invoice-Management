import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		return success(res, await global.metadriver.UpdateCoupon(body, companyid))
	})

