import ExpireDate from "@utils/expire-date";
import { success } from "@utils/request-utility";

export default async (
    { res, route: { IHDir } }: Ctx,
    { companyid, body: params }: Plugins
) => {
    params.created_at = new Date();
    params.status = "not_used";
    params.note = "";
    const customExpire = params.expire,
        { expire } = await global.metadriver.GetSetting("gift_card", companyid),
        expire_date = ExpireDate(new Date(), customExpire || expire);
    params.expire = customExpire || expire;
    params.expire_date = expire_date;
    params.total = parseInt(params.total);
    params.credit = parseInt(params.total);
    const { insertedId } = await global.metadriver.CreateGiftCard(
        params,
        companyid
    );
    return success(res, insertedId.toString());
};
