import replaceText from '@utils/replace-text'
import { success } from '@utils/request-utility'

export default async (
	{
		req: {
			params: { id },
		},
		res,
		route: { IHDir },
	}: Ctx,
	{ companyid, wrapper }: Plugins
) =>
	await wrapper({ res, path: IHDir }, async () => {
		const client = await global.metadriver.GetClient(id, companyid),
			services = await global.metadriver.GetServices({ size: 0 }, companyid),
			rewards = await global.metadriver.GetRewards({ size: 0 }, companyid),
			coupon = await global.metadriver.GetCouponClient(id, companyid),
			staff = await global.metadriver.GetStaff({}, companyid),
			servicesClient = await global.metadriver.GetAllServiceClient(
				{ filterObj: { client: id } },
				companyid
			),
			rewardsClient = await global.metadriver.GetAllRewardsClient(
				{ filterObj: { client: id } },
				companyid
			),
			company = await global.metadriver.GetCompanyById(companyid),
			fidelity_url = company.fidelity_domain
				? `https://${company.fidelity_domain}/${id}`
				: `${process.env.FIDELITYURL}/${company.short_id}/${id}`
		const { whatsapp_message } = await global.metadriver.GetSetting(
				'whatsapp_fidelity',
				companyid
			),
			output_whatsapp = replaceText(whatsapp_message, {
				name: `${client.firstName} ${client.lastName}`,
				link: `${fidelity_url}`,
			})
		return success(res, {
			client,
			services,
			rewards,
			coupon,
			staff,
			servicesClient,
			rewardsClient,
			fidelity_url,
			whatsapp_message: output_whatsapp,
		})
	})

