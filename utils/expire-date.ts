export default (created_at: Date, months: string) => {
	const expirationDate = new Date(created_at);
	expirationDate.setMonth(expirationDate.getMonth() + parseInt(months));
	return expirationDate;
};
