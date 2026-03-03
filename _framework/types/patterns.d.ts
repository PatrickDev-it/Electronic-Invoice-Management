import { Symbols } from "./symbols";

export type PatternSetting<M extends Object, O extends Object> = Combine<M, O>;

type Combine<M, T> = T extends infer t ? (M extends infer m ? { [K in keyof (t & m)]: (t & m)[K] } : never) : never;

export type Pattern<S extends string, D extends string> = S extends infer s ? `${s}${D}` : never;

export type IdentityPattern = Pattern<Exclude<Symbols, ".">, "self">;
export type SingularizerPattern = Pattern<Exclude<Symbols, ".">, "id">;
export type MixedPattern = Pattern<Exclude<Symbols, ".">, "mix">;
