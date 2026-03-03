import jwt from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import { error, success } from '@utils/request-utility';

const doLogin = async (email: string, password: string) => {
	const dbUser = await global.metadriver.GetUserByEmail(email);

	if (dbUser && dbUser.hasOwnProperty('password') && compareSync(password, dbUser.password)) return dbUser;

	return null;
};

export default async ({ req, res }: Ctx<Wrapper>, { body }: Plugins) => {
	const loggedUser = await doLogin(body.email as string, body.password as string);
	if (!loggedUser) {
		error(res, 'Invalid username or password.');
		return;
	}

	const company = await global.metadriver.GetCompanyById(loggedUser.company);

	if (!company.active) {
		error(res, 'Account is inactive. Contact the administrator.');
		return;
	}

	const token = jwt.sign(
		{
			email: loggedUser.email,
			id: loggedUser._id,
			companyid: loggedUser.company,
		},
		process.env.SECRETJWT,
		{ expiresIn: '7d' },
	);

	let { url } = await global.metadriver.GetSetting('logo', company._id);

	delete loggedUser._id;
	delete loggedUser.password;
	delete company._id;
	success(res, {
		token: token,
		user: loggedUser,
		company: company,
		logo: url,
	});
};
