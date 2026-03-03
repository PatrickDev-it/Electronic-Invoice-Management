import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		body.update_date = new Date()
		body.created_at = body.created_at && new Date(body.created_at)
		return success(res, global.metadriver.UpdateStaff(body, companyid))
	})

