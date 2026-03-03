import { Symbols } from "../symbols";
import { Skeleton } from "./skeleton";
import { Syntax } from "./syntax";

export declare type Config = {
	syntax: Required<Syntax>;
	skeleton: Skeleton;
	map: { dir: string; patterns: { separator: `${string} ${Symbols} ${string}` } };
	exceptions: (Required<Syntax> & { dir: string })[];
};

export type InitConfig = {
	syntax: Syntax;
	skeleton: Skeleton;
	map: { dir: string; patterns?: { separator: `${string} ${Symbols} ${string}` } };
	exceptions?: (Required<Syntax> & { dir: string })[];
};

export type DefaultConfig = {
	syntax: Required<Omit<Syntax, "route">>;
	skeleton?: Skeleton;
	map: { dir: string; patterns: { separator: `${string} ${Symbols} ${string}` } };
	exceptions: (Required<Syntax> & { dir: string })[];
};
