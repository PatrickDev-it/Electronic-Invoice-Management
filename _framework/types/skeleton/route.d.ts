import { Syntax } from "../config/syntax";
import { Method } from "../method";

export type Route = FileRoute | FolderRoute;

export type InitFileRoute = {
	type?: "file";
	exceptions: false | Syntax;
	PIHDirFilename: string;
	IHDir: string;
	OHDir: string;
	pattern: string;
	method: Method;
};

export type FileRoute = {
	type?: "file";
	particular?: { pattern: "_mix"; case: "methods" } | { pattern: "_mix"; case: "subpaths"; path: string };
	exceptions?: Syntax;
	PIHDirFilename: string;
	IHDir: string;
	OHDir: string;
	pattern: string;
	method: Exclude<Method, "_mix">;
};

export type FolderRoute = {
	type?: "folder";
	PIHDirFilename: string;
	IHDir: string;
	method: undefined;
};
