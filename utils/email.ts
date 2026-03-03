import { createTransport } from 'nodemailer'
export default async ({ to, subject, text, from, attachment = undefined }) => {
	try {
		const transporter = createTransport({
			host: process.env.EMAILHOST,
			secure: true,
			auth: {
				user: process.env.EMAILUSER,
				pass: process.env.EMAILPASS,
			},
		})

		await transporter.sendMail({
			from: `"${from}" <noreply@unloaded.gg>`,
			to: to,
			subject: subject,
			text: text,
			html: text,
			attachments: attachment,
		})
	} catch (error) {
		console.error('Error sending email =>', error)
	}
}

