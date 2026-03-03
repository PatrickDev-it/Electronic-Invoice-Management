import { success } from '@utils/request-utility'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ body, companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		const { start, size, filter, projection } = body,
			skip = size ?? 10 * start,
			filterObj: any = {}
		filter?.regex &&
			filter.regex.length != 0 &&
			(filterObj.$or = [{ name: { $regex: filter.regex, $options: 'i' } }])
		return success(
			res,
			await global.metadriver.GetServices(
				{
					size,
					skip,
					filterObj,
					projection,
				},
				companyid
			)
		)
	})

