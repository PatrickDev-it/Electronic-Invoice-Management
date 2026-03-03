import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		body.created_at = new Date()
		await global.metadriver.CreateService(body, companyid)
		const findServices = await global.metadriver.GetServices({}, companyid)
		return success(res, findServices)
	})

