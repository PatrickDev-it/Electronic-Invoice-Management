import { transform } from "esbuild";
import { parse } from "@babel/parser";
import { ArrowFunctionExpression, ExpressionStatement, VariableDeclaration } from "@babel/types";
import replaceRange from "../../../helpers/replaceRange";
import findProperty from "../../../helpers/findProperty";

export default async (...ctxList: (() => any)[]) => {
	const logic = async (ctx: () => any) => {
		let { code } = await transform("const $xyw$ = " + ctx.toString(), {
			platform: "node",
			minify: true,
			minifyIdentifiers: true,
			minifySyntax: true,
			minifyWhitespace: true,
			format: "esm",
			loader: "ts",
		});

		const parsed = parse(code, {
			sourceType: "module",
			plugins: ["typescript"],
		}).program.body[0] as VariableDeclaration;

		const expression = parsed.declarations[0].init;

		if (expression.type !== "ArrowFunctionExpression") {
			// @ts-ignore
			code = `${expression.async ? "async " : ""} (${code.substring(
				// @ts-ignore
				expression.params[0].start!,
				// @ts-ignore
				expression.params.slice(-1)[0]!.end!,
				// @ts-ignore
			)}) => ${code.substring(expression.body.start!, expression.body.end!)}`;

			return {
				ctx,
				code,
				expression: (
					parse(code, {
						sourceType: "module",
						plugins: ["typescript"],
					}).program.body[0] as ExpressionStatement
				).expression as ArrowFunctionExpression,
			};
		}

		code = code.split("=").slice(1).join("=");

		return {
			ctx,
			code,
			expression: (
				parse(code, {
					sourceType: "module",
					plugins: ["typescript"],
				}).program.body[0] as ExpressionStatement
			).expression as ArrowFunctionExpression,
		};
	};

	const normalizedCtx = await logic(ctxList[0]);

	// console.log("|  normalizedCtx => ", normalizedCtx);

	const expressions = await Promise.all(
		ctxList.slice(1).map(async ctx => {
			const normalized = await logic(ctx);

			const { params } = normalizedCtx.expression;
			const paramsString = "(" + normalizedCtx.code.substring(params[0].start, params.slice(-1)[0]!.end!) + ")";

			const names = normalized.expression.params
				.map(param => param.type === "Identifier" && param.name)
				.filter(n => !!n);
			// @ts-ignore
			const identifiers = findProperty(normalized.expression.body, obj => {
				if (
					typeof obj === "object" &&
					"type" in obj &&
					obj.type === "Identifier" &&
					"name" in obj &&
					names.includes(obj.name)
				)
					return obj;
				return false;
			}).filter(j => "type" in j) as any;

			// console.log("| AFTER identifiers => ", identifiers);

			let length = 0;

			identifiers.forEach(({ start, end, name }) => {
				const i = normalized.expression.params.findIndex(
					param => param.type === "Identifier" && param.name === name,
				);
				// @ts-ignore
				name = params[i] ? params[i].name : name;

				normalized.code =
					normalized.code.substring(0, start + length) +
					name +
					normalized.code.substring(end + length);
				length += name.length - (end - start);
			});

			normalized.code = replaceRange(
				normalized.code,
				{
					start: normalized.expression.params[0].start,
					end: normalized.expression.params.slice(-1)[0]!.end,
				},
				paramsString,
			);
			normalized.expression.params = params;

			// console.log("| BEFORE normalized => ", normalized);

			normalized.expression = (
				parse(normalized.code, {
					sourceType: "module",
					plugins: ["typescript"],
				}).program.body[0] as ExpressionStatement
			).expression as ArrowFunctionExpression;

			// console.log("| AFTER normalized => ", normalized);

			return normalized;
		}),
	);

	// console.log("expressions => ", expressions);

	// let params: Ctx = {
	// 	code: "",
	// 	parsed: null,
	// 	params: {
	// 		parsed: [],
	// 		code: "",
	// 		range: [],
	// 	},
	// 	body: {
	// 		parsed: null,
	// 		code: "",
	// 		range: [],
	// 	},
	// };

	// if (expressions.some(({ expression }) => expression.params.length === 1 && expression.params[0].type === "RestElement")) {
	// 	const { code, expression } = expressions.find(
	// 		({ expression }) => expression.params.length === 1 && expression.params[0].type === "RestElement",
	// 	);
	// 	params.code = `${expression.async ? "async " : ""} (${code.substring(
	// 		expression.params[0].start,
	// 		expression.params[0].end,
	// 	)}) => `;
	// }
	// console.log("toNormalize => ", toNormalize, ctx.toString());

	expressions.unshift(normalizedCtx);

	return expressions.map(({ ctx, code, expression }) => ({
		ctx,
		code,
		expression,
		params: {
			parsed: expression.params,
			code: code.substring(expression.params[0].start!, expression.params.slice(-1)[0]!.end!),
			range: [expression.params[0].start!, expression.params.slice(-1)[0]!.end!],
		},
		body: {
			parsed: expression.body,
			code: code.substring(expression.body.start!, expression.body.end!),
			range: [expression.body.start, expression.body.end],
		},
	}));
};
