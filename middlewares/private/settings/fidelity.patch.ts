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
	primary_color: {
		type: "string",
		optional: true,
	},
	secondary_color: {
		type: "string",
		optional: true,
	},
	text_header_color: {
		type: "string",
		optional: true,
	},
	text_footer_color: {
		type: "string",
		optional: true,
	},
};
