import { success } from '@utils/request-utility';
export default async ({ res, route: { IHDir } }: Ctx, { body, companyid, wrapper }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		body.sending_date = body.sending_date && new Date(body.sending_date);
		body.created_at = body.created_at && new Date(body.created_at);
		body.update_date = new Date();
		await global.metadriver.UpdateClient(body, companyid);
		return success(res, 'Client updated successfully.');
	});
