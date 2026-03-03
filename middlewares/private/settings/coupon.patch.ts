import { error } from "@utils/request-utility";

export default async ({ res }: Ctx, { body, validator }) => {
	const validate = await validator(schema, body);
	if (Array.isArray(validate)) {
		return error(res, validate[0].message);
	}
};

const schema = {
	_id: {
		type: "string",
	},
	bg_header: {
		type: "string",
		optional: true,
	},
	bg_footer: {
		type: "string",
		optional: true,
	},
	color_footer: {
		type: "string",
		optional: true,
	},
	type: {
		type: "string",
		optional: true,
	},
	amount: {
		type: "string",
		optional: true,
	},
	active: {
		type: "boolean",
		optional: true,
	},
	expire: {
		type: "string",
		optional: true,
	},
};
