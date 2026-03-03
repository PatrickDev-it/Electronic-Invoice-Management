import { CronJob } from 'cron';
import formattingDate from '@utils/format-date';
import ReplaceText from '@utils/replace-text';
import TemplateEmail from '@utils/template/email';
import TemplateCoupon from '@utils/template/coupon';
import html_to_pdf from 'html-pdf-node';
import sendEmail from '@utils/email';
import ExpireDate from '@utils/expire-date';
const sendBirthdayCoupon = async () => {
	const currentDate = new Date(),
		currentDay = currentDate.getDate(),
		currentMonth = currentDate.getMonth() + 1;
	try {
		const allCompany = await global.metadriver.GetAllCompany({
			giftcard: 1,
		});
		await Promise.all(
			allCompany.map(async company => {
				if (company.giftcard) {
					const clients = await global.metadriver.GetClientBitrhDay(
						company._id.toString(),
						currentDay.toString(),
						currentMonth.toString(),
					);
					if (clients.length > 0) {
						const settings = await global.metadriver.GetSettings(
							{
								_id: {
									$in: ['logo', 'general_info', 'mail_coupon', 'coupon'],
								},
							},
							company._id.toString(),
						);

						const info = settings.find(item => item._id === 'general_info'),
							logo = settings.find(item => item._id === 'logo'),
							mail_coupon = settings.find(item => item._id === 'mail_coupon'),
							coupon_setting = settings.find(item => item._id === 'coupon');

						await Promise.all(
							clients.map(async client => {
								const expire_date = ExpireDate(new Date(), coupon_setting.expire),
									params = {
										client: client._id.toString(),
										expire: new Date(expire_date),
										created_at: new Date(),
										type: coupon_setting.type,
										amount: coupon_setting.amount,
										status: 'not_used',
									};

								const coupon = await global.metadriver.CreateCoupon(params, company._id.toString());
								const email = client.email,
									context = {
										name: client.firstName,
										expire_date: formattingDate(expire_date),
									},
									output_message = ReplaceText(mail_coupon.mail_message, context),
									output_subject = ReplaceText(mail_coupon.mail_object, context),
									templateEmail = TemplateEmail({
										color_message: mail_coupon.color_message,
										logo: logo.url,
										company_name: info.name,
										bg_header: mail_coupon.bg_header,
										color_header: mail_coupon.color_header,
										mail_object: output_subject,
										bg_message: mail_coupon.bg_message,
										message: output_message,
										color_footer: mail_coupon.color_footer,
										email: info.email,
										phone: info.phone ?? info.telefono,
										website: info.website,
									}),
									templatePdf = TemplateCoupon({
										logo: logo.url,
										company_name: info.name,
										bg_header: coupon_setting.bg_header,
										bg_footer: coupon_setting.bg_footer,
										color_footer: coupon_setting.color_footer,
										expire_date: formattingDate(expire_date),
										amount: coupon_setting.amount,
										type: coupon_setting.type,
										code: coupon.insertedId.toString(),
									});

								html_to_pdf.generatePdf(
									{ content: templatePdf },
									{ printBackground: true, format: 'A6' },
									async (err, content) => {
										await sendEmail({
											to: email,
											subject: output_subject,
											text: templateEmail,
											from: info.name,
											attachment: [
												{
													filename: 'birthday-coupon.pdf',
													content,
												},
											],
										});
									},
								);
							}),
						);
					}
				}
			}),
		);
	} catch (error) {
		console.error('Error while processing birthday coupons', error);
	}
};

export const sendBirthdayCron = async () => {
	const Cron = new CronJob(
		'0 20 * * *',
		async function () {
			await sendBirthdayCoupon();
		},
		null,
		true,
		'Europe/Rome',
	);

	Cron.start();
};
