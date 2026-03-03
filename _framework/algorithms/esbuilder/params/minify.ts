import { cases } from "./_export";

import { Plugin } from "../../../types/plugin";
import { FileRoute } from "../../../types/skeleton/route";
import findeKey from "../../../helpers/findKey";
import { Ctx, Handler } from "../../../types/esbuilder/_export";
import { ReturnStatement } from "@babel/types";

export default async (route: FileRoute, params: { ctx: Ctx; plugins: Ctx }, handler: Handler, plugins: Plugin[]) => {
	try {
		const { ctx } = params;

		const handlerIdentifiers = handler.export.params.flatMap(param =>
			param.type === "ObjectPattern" && param.properties.some(p => p.type === "RestElement")
				? param.properties.map(prop => ({
						param: prop as any,
						values: findeKey(prop, prop.type === "RestElement" ? "argument" : "key", "name"),
				  }))
				: {
						param,
						values: findeKey(
							param,
							param.type === "RestElement" ? "argument" : "key",
							"name",
						),
				  },
		);

		if (ctx.body.parsed.type !== "BlockStatement")
			return cases.bodyExpression(route, params as any, handler, handlerIdentifiers, plugins);

		const { start, returnState } = {
			start: ctx.body.parsed.body[0].start!,
			returnState: (ctx.body.parsed.body.find(b => b.type === "ReturnStatement") as ReturnStatement).argument!,
		};

		const bodyHandler = handler.code.substring(
			handler.export.parsed.body.start! + (handler.export.parsed.body.type === "BlockStatement" ? 1 : 0),
			handler.export.parsed.body.end! - (handler.export.parsed.body.type === "BlockStatement" ? 1 : 0),
		);

		return `${ctx.expression.async ? "async " : ""} (${ctx.params.code}) => {
			${ctx.body.code.substring(start, returnState.start! - 1)}
	
			return (${handler.export.parsed.async ? "async " : ""} (${handler.code.substring(
			handler.export.parsed.params[0].start!,
			handler.export.parsed.params.slice(-1)[0].end!,
		)}) => ${bodyHandler} )({...${ctx.body.code.substring(
			returnState.start! - 1,
			returnState.end!,
		)}, route:${JSON.stringify(route)}})
		}`;
	} catch (e) {
		console.log("| From minify => ", route, e);
	}
};
