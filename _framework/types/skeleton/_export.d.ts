import { Config } from "../config/_export";
import { FileRoute } from "./route";

export type ResolveSkeleton = (
	input: string,
	output: string,
	config: Config,
	PIHDir?: string,
) => Promise<Omit<FileRoute, "type">[]>;
