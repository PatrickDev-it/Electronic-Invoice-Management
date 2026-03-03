import { success } from '@utils/request-utility'

/** @type {Handler} */
export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		body.created_at = new Date()
		body.total_points = 0
		const { insertedId } = await global.metadriver.CreateClient(body, companyid)
		return success(res, insertedId.toString())
	})

