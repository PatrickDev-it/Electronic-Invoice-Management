export default async ({
	req: {
		query: { id },
	},
}) => await global.metadriver.GetUserById(id);
