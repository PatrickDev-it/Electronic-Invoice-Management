import { success } from '@utils/request-utility'

export default async (
	{ req: { companyid, userid }, res }: Ctx,
	{ wrapper }: Plugins
) =>
	await wrapper({ res, path: 'current.get' }, async () => {
		const results = await global.metadriver.GetUserById(userid)
		const company = await global.metadriver.GetCompanyById(results.company)

		const { url } = await global.metadriver.GetSetting('logo', companyid)

		delete results._id
		delete company._id

		return success(res, {
			user: results,
			company: company,
			logo: url,
		})
	})

