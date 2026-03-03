export default async (
	{
		req: {
			query: { id },
		},
	},
	{ companyid },
) => await global.metadriver.GetService(id, companyid);
