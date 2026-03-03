import { parse } from "@babel/parser";
import { VariableDeclarator } from "@babel/types";

/**
 * @param {ReturnType<typeof import('@babel/parser').parse>} parsed
 * @param {string} identifier
 */
export default (parsed: ReturnType<typeof parse>, identifier: string) => {
	/** @type {import('@babel/types').VariableDeclarator[]} */
	const exportNames: VariableDeclarator[] = [];

	parsed.program.body.forEach(b => {
		if (b.type === "ExportNamedDeclaration" && b.declaration && b.declaration.type === "VariableDeclaration")
			exportNames.push(
				...b.declaration.declarations.filter(
					d =>
						d.type === "VariableDeclarator" &&
						d.id.type === "Identifier" &&
						d.id.name === identifier,
				),
			);
	});

	if (!exportNames.length) return false;

	return exportNames[0].init;
};
