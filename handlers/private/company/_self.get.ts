export default async ({
	req: {
		query: { id },
	},
}) => await global.metadriver.GetCompanyById(id);
