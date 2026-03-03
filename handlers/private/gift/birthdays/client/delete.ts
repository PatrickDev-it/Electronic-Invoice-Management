import { success } from '@utils/request-utility';

export default async ({ res, route: { IHDir } }: Ctx, { companyid, body: { id }, wrapper }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteAllCoupon(id, companyid);
		return success(res, 'Coupons removed successfully.');
	});
