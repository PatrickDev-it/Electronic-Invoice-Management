import { Method } from "./method";

export type Server = {
	[key: Exclude<Method, "_mix">]: Function;
};
