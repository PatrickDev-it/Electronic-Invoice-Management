import { success } from '@utils/request-utility'

export default async (
	{
		route: { IHDir },
		req: {
			params: { id },
		},
		res,
	},
	{ companyid, wrapper }
) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteAllServices(id, companyid)
		await global.metadriver.DeleteAllRewards(id, companyid)
		await global.metadriver.DeleteClient(id, companyid)
		return success(
			res,
			await global.metadriver.GetClients({ size: 10 }, companyid)
		)
	})

