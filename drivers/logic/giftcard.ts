import { ObjectId } from "mongodb";
export default {
    async GetAllGiftCard(params, company) {
        const { size, skip, filterObj } = params;
        let query;
        query = this.db
            .collection(`giftcard-${company}`)
            .find(filterObj ?? {})
            .skip(skip ?? 0)
            .sort({ created_at: -1 })
            .limit(size ?? 10);
        const results = await query.toArray();
        let count = await this.db
            .collection(`giftcard-${company}`)
            .countDocuments(filterObj);
        return { results, count };
    },
    async CreateGiftCard(params, company) {
        const service = await this.db
            .collection(`giftcard-${company}`)
            .insertOne(params);
        return service;
    },
    async GetGiftCard(id, company) {
        const giftcard = await this.db
            .collection(`giftcard-${company}`)
            .findOne({ _id: new ObjectId(id) });
        return giftcard ?? false;
    },
    async UpdateGiftCard(params, company) {
        const id = params._id;
        delete params._id;
        await this.db.collection(`giftcard-${company}`).updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: params,
            }
        );
        return true;
    },
    async DeleteGiftCard(id, company) {
        await this.db.collection(`giftcard-${company}`).deleteOne({
            _id: new ObjectId(id),
        });
        return true;
    },
    async GetCountGiftCards(company) {
        let count = await this.db
            .collection(`giftcard-${company}`)
            .countDocuments();
        return count;
    },
};
