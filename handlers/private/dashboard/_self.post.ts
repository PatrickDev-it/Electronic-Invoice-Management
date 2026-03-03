import { success } from "@utils/request-utility";

export default async (
    { res, route: { IHDir } }: Ctx,
    { body, companyid, wrapper }: Plugins
) =>
    await wrapper({ res, path: IHDir }, async () => {
        if (body.filter.created_at) {
            const startDate = new Date(body.filter.created_at.startDate);
            const endDate = new Date(body.filter.created_at.endDate);
            startDate.setUTCHours(0, 0, 0, 0);
            endDate.setUTCHours(23, 59, 59, 999);
            body.filter = {
                ...body.filter,
                created_at: { $gte: startDate, $lt: endDate },
            };
        }
        const services_chart = await global.metadriver.GetServiceGroup(
            body,
            companyid
        );
        const services = await global.metadriver.GetCountServices(companyid);
        const clients = await global.metadriver.GetCountClients(companyid);
        const gift_cards = await global.metadriver.GetCountGiftCards(companyid);
        const rewards = await global.metadriver.GetCountRewards(companyid);
        const staff = await global.metadriver.GetCountStaff(companyid);
        return success(res, {
            services_chart,
            services,
            clients,
            gift_cards,
            rewards,
            staff,
        });
    });
