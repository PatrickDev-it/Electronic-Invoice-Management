import { error } from '@utils/request-utility'
import { verify } from 'jsonwebtoken'

export default async ({ req, res, route: { IHDir } }, { wrapper }) =>
	await wrapper(
		{ res, path: IHDir },
		async () =>
			await new Promise(resolve => {
				if (!req.headers.authorization) {
					error(res, 'Cannot access')
					return
				}
				const token = req.headers.authorization.split(' ')[1]
				verify(token, process.env.SECRETJWT, async function (err, decoded) {
					if (!decoded) {
						error(res, 'Invalid request.')
						return
					}
					const user = await global.metadriver.GetUserById(decoded.id)
					if (user === null) {
						error(res, 'Invalid request.')
						return
					}
					const company = await global.metadriver.GetCompanyById(user.company)
					if (!company.active) {
						error(res, 'Invalid request.')
						return
					}
					return resolve(
						((req.userid = decoded.id), (req.companyid = decoded.companyid))
					)
				})
			})
	)

