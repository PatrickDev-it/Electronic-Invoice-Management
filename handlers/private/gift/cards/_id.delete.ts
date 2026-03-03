import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body: { id }, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteGiftCard(id, companyid)
		const findGiftCard = await global.metadriver.GetAllGiftCard({}, companyid)
		return success(res, findGiftCard)
	})

