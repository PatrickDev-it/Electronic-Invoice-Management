import { success } from '@utils/request-utility';

export default async ({ res, route: { IHDir } }: Ctx, { body: { id }, companyid, wrapper }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.UpdateClient({ _id: id, total_points: 0 }, companyid);
		await global.metadriver.DeleteAllServices(id, companyid);
		return success(res, 'Services removed successfully.');
	});
