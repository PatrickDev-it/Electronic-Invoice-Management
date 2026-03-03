import { ObjectId } from 'mongodb'
export default {
	async GetRewards(params, company) {
		const { size, skip, filterObj, projection } = params
		let query
		query = this.db
			.collection(`rewards-${company}`)
			.find(filterObj ?? {}, { projection: projection ?? {} })
			.skip(skip ?? 0)
			.sort({ created_at: -1 })
			.limit(size ?? 10)
		const results = await query.toArray(),
			count = await this.db
				.collection(`rewards-${company}`)
				.countDocuments(filterObj)
		return { results, count }
	},
	async GetReward(id, company) {
		const reward = await this.db
			.collection(`rewards-${company}`)
			.findOne({ _id: new ObjectId(id) })
		return reward ?? false
	},
	async CreateReward(params, company) {
		const rewards = await this.db
			.collection(`rewards-${company}`)
			.insertOne(params)
		return rewards
	},
	async UpdateReward(params, company) {
		const id = params._id
		delete params._id
		await this.db.collection(`rewards-${company}`).updateOne(
			{
				_id: new ObjectId(id),
			},
			{
				$set: params,
			}
		)
		return true
	},
	async DeleteReward(id, company) {
		await this.db.collection(`rewards-${company}`).deleteOne({
			_id: new ObjectId(id),
		})
		return true
	},
	async GetCountRewards(company) {
		let count = await this.db.collection(`rewards-${company}`).countDocuments()
		return count
	},
}

