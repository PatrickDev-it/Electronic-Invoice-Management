export default async ({ res }: Ctx) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); //FIXME: ADD WEBSITE URL WHEN IN PRODUCTION
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
};
