export default async ({
	req: {
		query: { email },
	},
}) => await global.metadriver.GetUserByEmail(email);
