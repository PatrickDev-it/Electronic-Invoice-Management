import { ObjectId } from "mongodb";

export default {
	async GetStaff(params, company) {
		const { size, skip, filterObj, projection } = params;
		let query;
		query = this.db
			.collection(`staff-${company}`)
			.find(filterObj ?? {}, { projection: projection ?? {} })
			.skip(skip ?? 0)
			.sort({ created_at: -1 })
			.limit(size ?? 0);
		const results = await query.toArray(),
			count = await this.db.collection(`staff-${company}`).countDocuments(filterObj);
		return { results, count };
	},
	async GetCountStaff(company) {
		let count = await this.db.collection(`staff-${company}`).countDocuments();
		return count;
	},
	async UpdateStaff(params, company) {
		const id = params._id;
		delete params._id;
		await this.db.collection(`staff-${company}`).updateOne(
			{
				_id: new ObjectId(id),
			},
			{
				$set: params,
			},
		);
		return true;
	},
	async DeleteStaff(id, company) {
		await this.db.collection(`staff-${company}`).deleteOne({
			_id: new ObjectId(id),
		});
		return true;
	},
	async CreateStaff(params, company) {
		const staff = await this.db.collection(`staff-${company}`).insertOne(params);
		return staff;
	},
};
