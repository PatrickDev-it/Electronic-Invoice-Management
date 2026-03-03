export default {
    async GetAllCompany(projection) {
        let query;
        query = this.db
            .collection(`company`)
            .find({}, { projection: projection });
        const results = await query.toArray();
        return results;
    },
};
