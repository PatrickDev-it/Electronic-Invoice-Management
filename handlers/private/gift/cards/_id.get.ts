import replaceText from '@utils/replace-text'
import formattingDate from '@utils/format-date'
import { success } from '@utils/request-utility'
export default async (
	{
		req: {
			query: { id },
		},
		res,
		route: { IHDir },
	}: Ctx,
	{ companyid, wrapper }: Plugins
) =>
	await wrapper({ path: IHDir }, async () => {
		const giftcard = await global.metadriver.GetGiftCard(id, companyid),
			staff = await global.metadriver.GetStaff({}, companyid),
			company = await global.metadriver.GetCompanyById(companyid),
			giftcard_url = company.giftcard_domain
				? `https://${company.giftcard_domain}/${id}`
				: `${process.env.GIFTCARDURL}/${company.short_id}/${id}`
		const { whatsapp_message } = await global.metadriver.GetSetting(
				'whatsapp_gift_card',
				companyid
			),
			output_whatsapp = replaceText(whatsapp_message, {
				name: giftcard.name,
				link: giftcard_url,
				expire_date: formattingDate(giftcard.expire_date),
			})
		return success(res, {
			giftcard,
			staff,
			whatsapp_message: output_whatsapp,
			giftcard_url,
		})
	})
