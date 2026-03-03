import { ObjectId } from "mongodb";
export default {
    async GetServices(params, company) {
        const { size, skip, filterObj, projection } = params;
        let query;
        query = this.db
            .collection(`services-${company}`)
            .find(filterObj ?? {}, { projection: projection ?? {} })
            .skip(skip ?? 0)
            .sort({ created_at: -1 })
            .limit(size ?? 10);
        const results = await query.toArray(),
            count = await this.db
                .collection(`services-${company}`)
                .countDocuments(filterObj);
        return { results, count };
    },
    async GetCountServices(company) {
        let count = await this.db
            .collection(`services-${company}`)
            .countDocuments();
        return count;
    },
    async GetService(id, company) {
        const service = await this.db
            .collection(`services-${company}`)
            .findOne({ _id: new ObjectId(id) });
        return service ?? false;
    },
    async UpdateService(params, company) {
        const id = params._id;
        delete params._id;
        await this.db.collection(`services-${company}`).updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: params,
            }
        );
        return true;
    },
    async DeleteService(id, company) {
        await this.db.collection(`services-${company}`).deleteOne({
            _id: new ObjectId(id),
        });
        return true;
    },
    async CreateService(params, company) {
        const service = await this.db
            .collection(`services-${company}`)
            .insertOne(params);
        return service;
    },
    async GetServiceGroup({ filter, group }, company) {
        let query = this.db.collection(`services-client-${company}`).aggregate([
            {
                $match: filter,
            },
            {
                $group: group,
            },
        ]);
        const results = await query.toArray();
        return results;
    },
};
