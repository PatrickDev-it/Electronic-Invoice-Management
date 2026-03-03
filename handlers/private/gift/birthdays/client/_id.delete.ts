import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body: { id, coupon }, wrapper }: Plugins
) => {
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteCoupon(coupon, companyid)
		return success(
			res,
			await global.metadriver.GetCouponClient(id.toString(), companyid)
		)
	})
}

