/** @param {WithAIResponse} res */
export const noCache = res => {
	res.setHeader("Surrogate-Control", "no-store");
	res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");
};

/**
 * @param {WithAIResponse} res
 * @param {any} data
 * */
export const success = (res, data) => {
	noCache(res);
	res.json({
		success: true,
		data,
	});
};

/**
 * @param {WithAIResponse} res
 * @param {any} message
 * */

export const error = (res, message) => {
	noCache(res);
	res.json({
		success: false,
		message,
	});
};
