import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body: { id }, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteService(id, companyid)
		const findService = await global.metadriver.GetServices({}, companyid)
		return success(res, findService)
	})

