export default {
    async GetSetting(id, company) {
        const setting = await this.db
            .collection(`settings-${company}`)
            .findOne({ _id: id });
        return setting ?? false;
    },
    async GetSettings(filter, company) {
        let query = await this.db
            .collection(`settings-${company}`)
            .find(filter);
        const results = await query.toArray();
        return results;
    },
    async UpdateInfo(params, company) {
        const id = params._id;
        delete params._id;
        await this.db.collection(`settings-${company}`).updateOne(
            {
                _id: id,
            },
            {
                $set: params,
            }
        );
        return true;
    },
};
