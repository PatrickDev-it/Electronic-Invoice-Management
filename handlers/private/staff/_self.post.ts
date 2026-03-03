import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		body.created_at = new Date()
		await global.metadriver.CreateStaff(body, companyid)
		const findStaff = await global.metadriver.GetStaff({ size: 10 }, companyid)
		return success(res, findStaff)
	})

