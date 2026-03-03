export default {
    async CreateCoupon(params, company) {
        const coupon = await this.db
            .collection(`coupon-${company}`)
            .insertOne(params);
        return coupon;
    },
};
