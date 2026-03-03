import { success } from '@utils/request-utility'

export default async ({ res }: Ctx, { body, companyid }: Plugins) => {
	const { start, size, filter, projection } = body,
		skip = size ?? 10 * start,
		filterObj: any = {}
	filter?.regex &&
		filter.regex.length != 0 &&
		(filterObj.$or = [
			{ firstName: { $regex: filter.regex, $options: 'i' } },
			{ lastName: { $regex: filter.regex, $options: 'i' } },
			{ email: { $regex: filter.regex, $options: 'i' } },
			{ phone: { $regex: filter.regex, $options: 'i' } },
		])
	return success(
		res,
		await global.metadriver.GetClients(
			{ size, skip, filterObj, projection },
			companyid
		)
	)
}

