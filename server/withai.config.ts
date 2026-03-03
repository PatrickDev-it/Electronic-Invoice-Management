import WithAI from '../_framework/_export';

const config: Config = {
	syntax: {
		route: {
			handler: {
				ctx: async (req, res) => ({ req, res }),
				plugins: async req => ({
					body: req.body ?? (req.body = await req.json()),
					companyid: req.companyid,
				}),
			},
			middleware: {
				ctx: async (req, res, next) => ({ req, res, next }),
				plugins: async req => ({
					body: await req.json(),
					companyid: req.companyid,
				}),
			},
		},
	},
	skeleton: {
		handlers: './handlers',
		middlewares: {
			dir: './middlewares',
			import: 'auto',
		},
	},
	map: {
		dir: './_server-map',
	},
};

const plugins: Plugin[] = [
	{
		identifier: 'validator',
		plugin: './plugins/validator',
	},
	{
		identifier: 'wrapper',
		plugin: './plugins/wrapper',
	},
];

export default {
	config,
	plugins,
};

export { config, plugins };

type Config = Parameters<WithAI['config']>[0];
type Plugin = Parameters<WithAI['pushPlugin']>[0];
