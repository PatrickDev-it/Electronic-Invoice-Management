import { success } from '@utils/request-utility'
import { ObjectId } from 'mongodb'

export default async (
	{ res, route: { IHDir } }: Ctx,
	{ companyid, body, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		const { start, size, filter } = body,
			skip = size ?? 10 * start,
			filterObj: any = {}
		if (filter?.regex && filter.regex.length != 0) {
			filterObj.$or = [
				{ firstName: { $regex: filter.regex, $options: 'i' } },
				{ lastName: { $regex: filter.regex, $options: 'i' } },
				{ email: { $regex: filter.regex, $options: 'i' } },
				{ phone: { $regex: filter.regex, $options: 'i' } },
			]
			ObjectId.isValid(filter.regex) &&
				filterObj.$or.push({ _id: new ObjectId(filter.regex) })
		}

		const response = await global.metadriver.GetAllGiftCard(
			{
				size,
				skip,
				filterObj,
			},
			companyid
		)
		return success(res, response)
	})

