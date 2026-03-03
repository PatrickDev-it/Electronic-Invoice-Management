import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body: { id }, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteReward(id, companyid)
		const findRewards = await global.metadriver.GetRewards({}, companyid)
		return success(res, findRewards)
	})

