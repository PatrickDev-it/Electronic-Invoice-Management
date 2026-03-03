import couponPatch from '@middlewares/private/settings/coupon.patch';
import emailPatch from '@middlewares/private/settings/email.patch';
import fidelityPatch from '@middlewares/private/settings/fidelity.patch';
import giftcardPatch from '@middlewares/private/settings/giftcard.patch';
import infoPatch from '@middlewares/private/settings/info.patch';
import businessHoursPatch from '@middlewares/private/settings/orari.patch';
import whatsappPatch from '@middlewares/private/settings/whatsapp.patch';
import { error, success } from '@utils/request-utility';

export const multiMiddles = new Map([
	['coupon', couponPatch],
	['email', emailPatch],
	['fidelity', fidelityPatch],
	['giftcard', giftcardPatch],
	['info', infoPatch],
	['business_hours', businessHoursPatch],
	['orari', businessHoursPatch],
	['whatsapp', whatsappPatch],
]);

export default async function updateInfo({ req, res, route }: Ctx, { body, companyid, validator, wrapper }: Plugins) {
	await wrapper({ res: res }, async () => {
		const { field } = req.params;
		if (!multiMiddles.has(field)) return error(res, 'Field not found');

		if (field === 'info') {
			body.phone = body.phone ?? body.telefono;
			body.location = body.location ?? body.sede;
			body.description = body.description ?? body.descrizione;
			delete body.telefono;
			delete body.sede;
			delete body.descrizione;
		}

		if (field === 'business_hours' || field === 'orari') {
			body.monday = body.monday ?? body.lunedi;
			body.tuesday = body.tuesday ?? body.martedi;
			body.wednesday = body.wednesday ?? body.mercoledi;
			body.thursday = body.thursday ?? body.giovedi;
			body.friday = body.friday ?? body.venerdi;
			body.saturday = body.saturday ?? body.sabato;
			body.sunday = body.sunday ?? body.domenica;
			delete body.lunedi;
			delete body.martedi;
			delete body.mercoledi;
			delete body.giovedi;
			delete body.venerdi;
			delete body.sabato;
			delete body.domenica;
		}

		await multiMiddles.get(field)({ req, res, route }, { body, validator });
		return success(res, await global.metadriver.UpdateInfo(body, companyid));
	});
}
