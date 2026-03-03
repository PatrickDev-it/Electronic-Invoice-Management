export type Method = GlobalHTTPMethod | HTTPMethod | MixedHTTPMethod | MiddlewareRegister;

export type GlobalHTTPMethod = "all" | "any";
export type HTTPMethod = "get" | "put" | "post" | "delete" | "patch" | "head" | "options" | "trace" | "connect";
export type MixedHTTPMethod = "_mix";
export type MiddlewareRegister = "use";
