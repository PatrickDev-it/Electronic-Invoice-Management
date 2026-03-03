import params from "./params/_export";

import { ArgsFormat } from "../../types/config/syntax";

const build = async ({ ctx, plugins }: ArgsFormat) => {
	const normalized = await params.normalize(ctx, plugins);
	return { ctx: normalized[0], plugins: normalized[1] };
};

const { minify } = params;

export { minify, build };
export default { minify, build };
