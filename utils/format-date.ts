export default (data: Date, formatType = "date") => {
	const optionsDate: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
	const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };

	const date = new Date(data);
	let formattedDate = "";

	if (formatType === "datetime") {
		formattedDate =
			date.toLocaleDateString(undefined, optionsDate) + " " + date.toLocaleTimeString(undefined, optionsTime);
	} else if (formatType === "time") {
		formattedDate = date.toLocaleTimeString(undefined, optionsTime);
	} else if (formatType === "date") {
		formattedDate = date.toLocaleDateString(undefined, optionsDate);
	}

	return formattedDate;
};
