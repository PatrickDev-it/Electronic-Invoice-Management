import { success } from '@utils/request-utility'
export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		const { id, reward_id, assigned_by } = body,
			{ total_points } = await global.metadriver.GetClient(id, companyid),
			reward = await global.metadriver.GetReward(reward_id, companyid),
			pointsToRedeem = parseInt(reward.points),
			newTotalPoints =
				total_points - parseInt(reward.points) < 0
					? 0
					: parseInt(total_points) - parseInt(reward.points),
			redeemedReward = {
				name: reward.name,
				points: pointsToRedeem,
				created_at: new Date(),
				assigned_by: assigned_by,
				client: id,
			}
		await global.metadriver.UpdateClient(
			{ _id: id, total_points: newTotalPoints },
			companyid
		)
		await global.metadriver.RedeemReward(redeemedReward, companyid)
		const newRewards = await global.metadriver.GetAllRewardsClient(
			{ filterObj: { client: id } },
			companyid
		)
		return success(res, { rewards: newRewards, total_points: newTotalPoints })
	})

