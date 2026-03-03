import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		const { total_points } = await global.metadriver.GetClient(
				body.id,
				companyid
			),
			service = await global.metadriver.GetServiceClient(
				body.service,
				companyid
			),
			newTotalPoints =
				total_points - service.points < 0 ? 0 : total_points - service.points
		await global.metadriver.UpdateClient(
			{ _id: body.id, total_points: newTotalPoints },
			companyid
		)
		await global.metadriver.DeleteClientService(body.service, companyid)
		const newServices = await global.metadriver.GetAllServiceClient(
			{ filterObj: { client: body.id } },
			companyid
		)
		return success(res, { services: newServices, total_points: newTotalPoints })
	})

