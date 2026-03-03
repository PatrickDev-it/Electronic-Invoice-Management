export default {
    async CreateMailLog(params) {
        const log = await this.db.collection("mail-logs").insertOne(params);
        return log;
    },
};
