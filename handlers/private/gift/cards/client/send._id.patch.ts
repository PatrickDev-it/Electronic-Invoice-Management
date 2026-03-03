import sendEmail from '@utils/email';
import formattingDate from '@utils/format-date';
import ReplaceText from '@utils/replace-text';
import { success } from '@utils/request-utility';
import TemplateEmail from '@utils/template/email';
import TemplateGiftCard from '@utils/template/giftcard';
import { error } from 'console';
import html_to_pdf from 'html-pdf-node';

export default async ({ res, route: { IHDir } }: Ctx, { body: { id }, companyid, wrapper }: Plugins) =>
	await wrapper({ res, path: IHDir }, async () => {
		const giftCard = await global.metadriver.GetGiftCard(id, companyid);

		const settings = await global.metadriver.GetSettings(
			{
				_id: {
					$in: ['logo', 'general_info', 'mail_gift_card', 'gift_card'],
				},
			},
			companyid,
		);

		const email = giftCard.email,
			company = await global.metadriver.GetCompanyById(companyid),
			card_url = company.giftcard_domain ? `https://${company.giftcard_domain}/` : `${process.env.GIFTCARDURL}/${company.short_id}/`,
			context = {
				name: giftCard.name,
				expire_date: formattingDate(giftCard.expire_date),
				link: `${card_url}${giftCard._id}`,
			},
			info = settings.find(item => item._id === 'general_info'),
			logo = settings.find(item => item._id === 'logo'),
			giftCardMail = settings.find(item => item._id === 'mail_gift_card'),
			giftcard = settings.find(item => item._id === 'gift_card'),
			output_message = ReplaceText(giftCardMail.mail_message, context),
			output_subject = ReplaceText(giftCardMail.mail_object, context),
			templateEmail = TemplateEmail({
				logo: logo.url,
				company_name: info.name,
				bg_header: giftCardMail.bg_header,
				color_header: giftCardMail.color_header,
				mail_object: output_subject,
				bg_message: giftCardMail.bg_message,
				color_message: giftCardMail.color_message,
				message: output_message,
				color_footer: giftCardMail.color_footer,
				email: info.email,
				phone: info.phone ?? info.telefono,
				website: info.website,
			}),
			templatePdf = TemplateGiftCard({
				logo: logo.url,
				company_name: info.name,
				bg_header: giftcard.bg_header,
				bg_footer: giftcard.bg_footer,
				color_footer: giftcard.color_footer,
				expire_date: formattingDate(giftCard.expire_date),
				message: giftCard.message,
				amount: giftCard.total,
				code: giftCard._id.toString(),
			});

		html_to_pdf.generatePdf({ content: templatePdf }, { printBackground: true, format: 'A6' }, async (err, content) => {
			if (err) {
				return error(res, 'Error while sending the card.');
			}
			await sendEmail({
				to: email,
				subject: output_subject,
				text: templateEmail,
				from: info.name,
				attachment: [
					{
						filename: 'gift-card.pdf',
						content,
					},
				],
			});
		});

		await global.metadriver.UpdateGiftCard({ _id: id, sending_date: new Date(), sended: true }, companyid);

		return success(res, 'Gift Card sent successfully.');
	});
