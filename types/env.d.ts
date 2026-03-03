export interface Env {
	// PORTS
	PORT: number;
	EMAILPORT: number;

	// ENCRYPTION
	SECRETJWT: string;

	// DB params
	DBURI: string;
	DBNAME: string;

	// EMAIL params
	EMAILHOST: string;
	EMAILUSER: string;
	EMAILPASS: string;

	// URLS
	FIDELITYURL: string;
	GIFTCARDURL: string;

	// WITHAI params
	MODE: "dev" | "prod";
	FORMAT: "esm" | "cjs";
}
