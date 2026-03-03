import { success } from '@utils/request-utility';
import sendEmail from '@utils/email';
import ReplaceText from '@utils/replace-text';
import TemplateEmail from '@utils/template/email';
export default async ({ res, route: { IHDir } }: Ctx, { body: { id }, companyid, wrapper }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		const client = await global.metadriver.GetClient(id, companyid),
			settings = await global.metadriver.GetSettings({ _id: { $in: ['logo', 'general_info', 'mail_fidelity'] } }, companyid),
			email = client.email,
			company = await global.metadriver.GetCompanyById(companyid),
			fidelity_url = company.fidelity_domain ? `https://${company.fidelity_domain}/` : `${process.env.FIDELITYURL}/${company.short_id}/`,
			context = {
				name: client.firstName,
				link: `${fidelity_url}${client._id}`,
			},
			info = settings.find(item => item._id === 'general_info'),
			logo = settings.find(item => item._id === 'logo'),
			fidelityMail = settings.find(item => item._id === 'mail_fidelity'),
			output_message = ReplaceText(fidelityMail.mail_message, context),
			output_subject = ReplaceText(fidelityMail.mail_object, context),
			templateEmail = TemplateEmail({
				color_message: fidelityMail.color_message,
				logo: logo.url,
				company_name: info.name,
				bg_header: fidelityMail.bg_header,
				color_header: fidelityMail.color_header,
				mail_object: output_subject,
				bg_message: fidelityMail.bg_message,
				message: output_message,
				color_footer: fidelityMail.color_footer,
				email: info.email,
				phone: info.phone ?? info.telefono,
				website: info.website,
			});
		await sendEmail({
			to: email,
			subject: output_subject,
			text: templateEmail,
			from: info.name,
		});

		await global.metadriver.UpdateClient({ id: id, sending_date: new Date() }, companyid);
		return success(res, 'Card sent successfully.');
	});
