import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body: { id }, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteStaff(id, companyid)
		const findStaff = await global.metadriver.GetStaff({}, companyid)
		return success(res, findStaff)
	})
