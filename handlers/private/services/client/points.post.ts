import { success, error } from '@utils/request-utility';
import { ObjectId } from 'mongodb';

export default async ({ res, route: { IHDir } }: Ctx, { body, companyid, wrapper }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		const response = await global.metadriver.GetClient(body.id, companyid);
		let totalPointsToAdd = 0;
		const clientService = [];

		if (body.generic.points > 0) {
			clientService.push({
				label: 'Generic Service',
				points: body.generic.points,
				price: parseInt(body.generic.price),
				created_at: new Date(),
				assigned_by: body.assigned_by,
				client: body.id,
			});
			totalPointsToAdd += parseInt(body.generic.points);
		}

		if (!Array.isArray(body.services)) {
			return error(res, 'Invalid services payload.');
		}

		if (body.services.length > 0) {
			const { results } = await global.metadriver.GetServices(
				{
					filterObj: {
						_id: { $in: body.services.map(s => new ObjectId(s)) },
					},
					size: 0,
					projection: { name: 1, points: 1, price: 1 },
				},
				companyid,
			);
			if (results) {
				results.forEach(service => {
					totalPointsToAdd += parseInt(service.points);
					clientService.push({
						label: service.name,
						points: parseInt(service.points),
						price: parseInt(service.price),
						created_at: new Date(),
						assigned_by: body.assigned_by,
						client: body.id,
					});
				});
			}
		}

		const newTotalPoints = response.total_points + totalPointsToAdd;
		response.total_points = newTotalPoints;
		await global.metadriver.UpdateClient(response, companyid);
		await global.metadriver.AddServices(clientService, companyid);

		const newServices = await global.metadriver.GetAllServiceClient({ filterObj: { client: body.id } }, companyid);
		return success(res, {
			services: newServices,
			total_points: newTotalPoints,
		});
	});
