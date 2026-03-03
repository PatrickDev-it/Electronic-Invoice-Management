import { ArrowFunctionExpression, BlockStatement, Expression, Identifier, Pattern, RestElement } from "@babel/types";

export type Ctx = {
	code: string;
	expression: ArrowFunctionExpression;
	params: {
		parsed: Param[];
		code: string;
		range: number[];
	};
	body: {
		parsed: Expression | BlockStatement;
		code: string;
		range: number[];
	};
};

export type CtxCase<T> = {
	code: string;
	expression: ArrowFunctionExpression;
	params: {
		parsed: Param[];
		code: string;
		range: number[];
	};
	body: {
		parsed: T;
		code: string;
		range: number[];
	};
};

export type Param = Identifier | Pattern | RestElement;
