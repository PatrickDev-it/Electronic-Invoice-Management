import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		body.skip = body.size ?? 10 * body.start
		return success(
			res,
			await global.metadriver.GetAllRewardsClient(body, companyid)
		)
	})
