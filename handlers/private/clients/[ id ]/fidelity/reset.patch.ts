import { success } from '@utils/request-utility';

export default async ({ res, route: { IHDir } }: Ctx, { body: { id }, wrapper, companyid }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.UpdateClient({ _id: id, total_points: 0 }, companyid);
		return success(res, 'Points reset successfully.');
	});
