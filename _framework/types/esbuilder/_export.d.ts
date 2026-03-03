import { BuildOptions, build } from "esbuild";
import { Ctx, CtxCase, Param } from "./ctx";
import { Handler } from "./handler";

export type BuildConfig = Omit<BuildOptions, "entryPoints" | "outfile">;

export type Esbuild = (entryPoint: string, outfile: string, config: BuildConfig) => ReturnType<typeof build>;

export { Ctx, CtxCase, Handler, Param };
