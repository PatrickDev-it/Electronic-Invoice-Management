export default async (who, what, reference, reference_id) => {
	await global.metadriver.CreateUserLog({ created_at: new Date(), who, what, reference, reference_id });
};
