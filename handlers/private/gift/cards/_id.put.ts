import ExpireDate from "@utils/expire-date";
import { success } from "@utils/request-utility";

export default async (
    { res, route: { IHDir } }: Ctx,
    { companyid, body: params, wrapper }: Plugins
) => {
    await wrapper({ res, path: IHDir }, async () => {
        const { _id } = params;
        if (!params.sended) {
            const customExpire = params.expire,
                { expire } = await global.metadriver.GetSetting(
                    "gift_card",
                    companyid
                ),
                expire_date = ExpireDate(new Date(), customExpire || expire);
            params.expire = customExpire || expire;
            params.expire_date = expire_date;
        }
        params.update_date = new Date();
        params.created_at = params.created_at && new Date(params.created_at);
        params.sending_date && new Date(params.sending_date);
        params.credit = parseInt(params.credit);
        params.total = parseInt(params.total);
        await global.metadriver.UpdateGiftCard(params, companyid);
        return success(
            res,
            await global.metadriver.GetGiftCard(_id, companyid)
        );
    });
};
