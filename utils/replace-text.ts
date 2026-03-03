export default (text: string, variables: Object) => {
	for (let variable in variables) {
		if (variables.hasOwnProperty(variable)) {
			let placeholder = "{{" + variable + "}}";
			let value = variables[variable];
			text = text.replace(new RegExp(placeholder, "g"), value);
		}
	}

	return text;
};
