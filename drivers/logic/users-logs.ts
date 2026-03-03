import { ObjectId } from 'mongodb';

export default {
    
    async CreateUserLog(params) {   
        const log = await this.db.collection("user-logs").insertOne(params);
        return log;
    },
    
    async GetUserLogs( { sort, size, skip } ) {                               

        let query;
        query = this.db
        .collection('user-logs')
        .find()
        .skip(skip)
        .sort(sort);
                
        if (size) {
            query = query.limit(size);
        }

        let results = await query.toArray();
        
        let count = await this.db.collection('user-logs').countDocuments();                                
        let ret = { results, count };
        return ret;
    },
};
