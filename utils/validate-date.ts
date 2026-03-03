export default (day, month, year) => {
	day = parseInt(day, 10);
	month = parseInt(month, 10);
	year = parseInt(year, 10);

	if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || month < 1 || month > 12 || year < 1) {
		return false;
	}

	let daysInMonth = new Date(year, month, 0).getDate();

	if (day > daysInMonth) {
		return false;
	}

	return true;
};
