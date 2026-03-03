import { success } from '@utils/request-utility';

export default async ({ res, route: { IHDir } }: Ctx, { body: { id }, companyid, wrapper }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		await global.metadriver.DeleteAllRewards(id, companyid);
		return success(res, 'Rewards removed successfully.');
	});
