import { success } from '@utils/request-utility'

export default async (
	{
		res,
		req: {
			query: { id },
		},
	}: Ctx,
	{ companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: id }, async () => {
		return success(res, await global.metadriver.GetSetting(id, companyid))
	})

