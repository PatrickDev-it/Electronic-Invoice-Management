import { ArrowFunctionExpression, FunctionDeclaration, Identifier, Pattern, RestElement } from "@babel/types";

export type Handler = {
	code: string;
	export: {
		code: string;
		parsed: FunctionDeclaration | ArrowFunctionExpression;
		params: (Identifier | Pattern | RestElement)[];
	};
	external: {
		code: string;
		parsed: VariableDeclarator | ArrowFunctionExpression;
	}[];
};
