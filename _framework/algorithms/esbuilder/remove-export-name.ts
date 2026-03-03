import { parse } from "@babel/parser";
import hasExportName from "./has-export-name";
import replaceRange from "../../helpers/replaceRange";

export default function removeExportName(parsedModule: ReturnType<typeof parse>, moduleString: string, identifier: string) {
	const hasExport = hasExportName(parsedModule, identifier);

	if (hasExport) {
		parsedModule.program.body.forEach(b => {
			if (
				b.type === "ExportNamedDeclaration" &&
				b.declaration &&
				b.declaration.type === "VariableDeclaration"
			) {
				b.declaration.declarations.forEach(d => {
					if (
						d.type === "VariableDeclarator" &&
						d.id.type === "Identifier" &&
						d.id.name === identifier
					) {
						moduleString = replaceRange(moduleString, { start: b.start!, end: b.end! }, "");
					}
				});
			}
		});
	}

	return moduleString;
}
