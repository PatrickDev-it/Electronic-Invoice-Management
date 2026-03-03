import { ObjectId } from 'mongodb'
export default {
	async GetClients(params, company) {
		const { size, skip, filterObj, projection } = params
		let query = this.db
			.collection(`clients-${company}`)
			.find(filterObj ?? {}, { projection: projection ?? {} })
			.skip(skip ?? 0)
			.sort({ created_at: -1 })
			.limit(size ?? 0)

		const results = await query.toArray(),
			count = await this.db
				.collection(`clients-${company}`)
				.countDocuments(filterObj)
		return { results, count }
	},
	async CreateClient(params, company) {
		const client = await this.db
			.collection(`clients-${company}`)
			.insertOne(params)
		return client
	},
	async DeleteClient(id, company) {
		await this.db.collection(`clients-${company}`).deleteOne({
			_id: new ObjectId(id),
		})
		return true
	},
	async GetClient(id, company) {
		const client = await this.db
			.collection(`clients-${company}`)
			.findOne({ _id: new ObjectId(id) })
		return client ?? false
	},
	async GetClientbyEmail(email, company) {
		const client = await this.db
			.collection(`clients-${company}`)
			.findOne({ email: email })
		return client ?? false
	},
	async UpdateClient(params, company) {
		const { _id } = params
		delete params._id
		return await this.db.collection(`clients-${company}`).updateOne(
			{
				_id: new ObjectId(_id),
			},
			{
				$set: params,
			}
		)
	},
	async AddServices(params, company) {
		await this.db.collection(`services-client-${company}`).insertMany(params)
		return true
	},
	async GetAllServiceClient(params, company) {
		const { size, skip, filterObj, projection } = params
		let query = this.db
			.collection(`services-client-${company}`)
			.find(filterObj ?? {}, { projection: projection ?? {} })
			.skip(skip ?? 0)
			.sort({ created_at: -1 })
			.limit(size ?? 10)
		const results = await query.toArray(),
			count = await this.db
				.collection(`services-client-${company}`)
				.countDocuments(filterObj)
		return { results, count }
	},
	async GetAllRewardsClient(params, company) {
		const { size, skip, filterObj, projection } = params
		let query = this.db
			.collection(`rewards-client-${company}`)
			.find(filterObj ?? {}, { projection: projection ?? {} })
			.skip(skip ?? 0)
			.sort({ created_at: -1 })
			.limit(size ?? 10)
		let results = await query.toArray(),
			count = await this.db
				.collection(`rewards-client-${company}`)
				.countDocuments(filterObj)
		return { results, count }
	},
	async DeleteClientService(id, company) {
		await this.db.collection(`services-client-${company}`).deleteOne({
			_id: new ObjectId(id),
		})
		return true
	},
	async GetServiceClient(id, company) {
		let service = await this.db
			.collection(`services-client-${company}`)
			.findOne({ _id: new ObjectId(id) })
		return service
	},
	async DeleteAllServices(id, company) {
		await this.db.collection(`services-client-${company}`).deleteMany({
			client: id,
		})
		return true
	},
	async RedeemReward(params, company) {
		await this.db.collection(`rewards-client-${company}`).insertOne(params)
		return true
	},
	async DeleteClientReward(id, company) {
		await this.db.collection(`rewards-client-${company}`).deleteOne({
			_id: new ObjectId(id),
		})
		return true
	},
	async DeleteAllRewards(id, company) {
		await this.db.collection(`rewards-client-${company}`).deleteMany({
			client: id,
		})
		return true
	},
	async DeleteAllCoupon(id, company) {
		await this.db.collection(`coupon-${company}`).deleteMany({
			client: id,
		})
		return true
	},
	async DeleteCoupon(id, company) {
		await this.db.collection(`coupon-${company}`).deleteOne({
			_id: new ObjectId(id),
		})
		return true
	},
	async GetCouponClient(id, company) {
		let query
		query = this.db.collection(`coupon-${company}`).find({ client: id })
		const results = await query.toArray()
		return results
	},
	async UpdateCoupon(params, company) {
		const id = params.id
		delete params.id
		await this.db.collection(`coupon-${company}`).updateOne(
			{
				_id: new ObjectId(id),
			},
			{
				$set: params,
			}
		)
		return true
	},
	async GetClientBitrhDay(company, currentDay, currentMonth) {
		const clients = await this.db
			.collection(`clients-${company}`)
			.aggregate([
				{
					$match: {
						'birthdate.day': currentDay,
						'birthdate.month': currentMonth,
					},
				},
				{
					$project: {
						_id: 1,
						firstName: 1,
						email: 1,
						phone: 1,
					},
				},
			])
			.toArray()
		return clients
	},
	async GetCountClients(company) {
		let count = await this.db.collection(`clients-${company}`).countDocuments()
		return count
	},
}

