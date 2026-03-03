import { Expression, ObjectExpression } from "@babel/types";
import findeKey from "../../../../helpers/findKey";
import BuilderTypes, { Ctx, CtxCase } from "../../../../types/esbuilder/_export";

import { Plugin } from "../../../../types/plugin";
import { FileRoute } from "../../../../types/skeleton/route";

export default (
	route: FileRoute,
	params: { ctx: CtxCase<Expression>; plugins: Ctx },
	handler: BuilderTypes.Handler,
	handlerIdentifiers: Identifier[],
	plugins: Plugin[],
) => {
	const { ctx } = params;

	const bodyHandler = handler.code.substring(
		handler.export.parsed.body.start! + (handler.export.parsed.body.type === "BlockStatement" ? 1 : 0),
		handler.export.parsed.body.end! - (handler.export.parsed.body.type === "BlockStatement" ? 1 : 0),
	);
	const { usedKeys } = getUsed(params.plugins as any, handlerIdentifiers);
	let minifiedPlugins = usedKeys.map(k => params.plugins.code.substring(k.range[0]!, k.range[1]!)).join(",");

	const calledPlugins = plugins.filter(x => handlerIdentifiers.some(h => h.values.includes(x.identifier)));
	if (calledPlugins.length) {
		minifiedPlugins +=
			(minifiedPlugins.length > 0 ? "," : "") +
			calledPlugins
				.map(p => p.identifier + ":" + `require("${p.plugin.replace(/\\/g, "////")}").default`)
				.join(",");
	}

	if (ctx.body.parsed.type === "ObjectExpression") {
		let minified = "";

		if (
			!handlerIdentifiers[0].values.length ||
			(handlerIdentifiers[0].param.type === "Identifier" && handlerIdentifiers[0].param.name)
		) {
			minified = ctx.params.code;
		} else {
			const { usedKeys, usedValues } = getUsed(ctx as any, handlerIdentifiers);

			ctx.params.code = usedValues.length
				? ctx.code.substring(ctx.params.range[0], Math.max(...usedValues.map(v => v.end!)))
				: "";

			minified = usedKeys.map(k => ctx.code.substring(k.range[0]!, k.range[1]!)).join(",");

			if (handlerIdentifiers[0].values.includes("route"))
				minified += `${minified.length > 0 ? "," : ""}route:${JSON.stringify(route)}`;
		}

		return `${ctx.expression.async ? "async " : ""} (${ctx.params.code}) => {
			let ${handler.code.substring(handler.export.parsed.params[0].start!, handler.export.parsed.params[0].end!)} = {${minified}}
			${handler.external.map(({ code }) => code).join(";\n")}
			
			${
				!minifiedPlugins || !handler.export.parsed.params[1]
					? ""
					: `let ${handler.code.substring(
							handler.export.parsed.params[1].start!,
							handler.export.parsed.params[1].end!,
					  )} = {${minifiedPlugins}}`
			}
			${handler.export.parsed.body.type === "BlockStatement" ? "" : "return"} ${bodyHandler}
		}`;
	}

	return `${ctx.expression.async ? "async " : ""} (${ctx.params.code}) => (${
		handler.export.parsed.async ? "async " : ""
	} (${handler.code.substring(
		handler.export.parsed.params[0].start!,
		handler.export.parsed.params.slice(-1)[0].end!,
	)}) => ${bodyHandler})({...${ctx.body.code}, route:${JSON.stringify(route)}}, {${minifiedPlugins}})`;
};

const getUsed = (ctx: CtxCase<ObjectExpression>, identifiers: Identifier[]) => {
	const usedKeys = ctx.body.parsed.properties
		.map(p => ({
			prop: p,
			type: p.type,
			range: [p.start, p.end],
			key: findeKey(p, p.type === "SpreadElement" ? "argument" : "key", "name")[0],
		}))
		.filter(
			k =>
				k.type === "SpreadElement" ||
				identifiers.some(h => h.param.type === "RestElement" || h.values.includes(k.key)),
		);

	const usedValues = ctx.params.parsed.filter(v => {
		return usedKeys.some(({ prop }) => {
			return (
				findeKey(
					prop,
					prop.type === "ObjectProperty" && prop.value.type === "ObjectExpression"
						? "argument"
						: "value",
					"name",
				)[0] ===
				(v.type === "Identifier"
					? v.name
					: findeKey(v, v.type === "RestElement" ? "argument" : "value", "name")[0])
			);
		});
	});

	return { usedKeys, usedValues };
};

type Identifier = {
	param: BuilderTypes.Ctx["params"]["parsed"][0];
	values: (string | string[])[];
};
