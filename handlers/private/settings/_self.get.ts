import { error, success } from '@utils/request-utility';

export default async (
	{
		req: {
			query: { ids },
		},
		res,
		route: { IHDir },
	}: Ctx,
	{ companyid, wrapper }: Plugins,
) =>
	await wrapper({ res, path: IHDir }, async () => {
		if (!Array.isArray(ids)) return error(res, 'Invalid settings payload.');
		success(res, await global.metadriver.GetSettings({ _id: { $in: ids } }, companyid));
	});
