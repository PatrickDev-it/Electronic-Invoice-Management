import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body: { id, reward }, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteClientReward(reward, companyid)
		const newRewards = await global.metadriver.GetAllRewardsClient(
			{ filterObj: { client: id } },
			companyid
		)
		success(res, newRewards)
	})

