import { ObjectId } from "mongodb";
export default {
	async GetUserByEmail(email) {
		let user = await this.db.collection("users").findOne({ email: email });
		return user;
	},
	async GetUserById(id) {
		const user = await this.db
			.collection("users")
			.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
		return user;
	},
	async GetCompanyById(id) {
		let company = await this.db.collection("company").findOne({ _id: new ObjectId(id) });
		return company;
	},
};
