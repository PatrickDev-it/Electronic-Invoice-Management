export type Handler = {
	ctx: (req: Req, res: Res) => Ctx;
	plugins: (req: Req) => Plugins;
};
