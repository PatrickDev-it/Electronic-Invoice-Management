import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		body.created_at = new Date()
		await global.metadriver.CreateReward(body, companyid)
		const findRewards = await global.metadriver.GetRewards({}, companyid)
		return success(res, findRewards)
	})

