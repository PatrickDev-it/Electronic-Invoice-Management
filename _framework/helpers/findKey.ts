export default function findeKey(
	param: { [key: string]: any },
	parentKey: string,
	valKey: string,
	prev: string[] = [],
): (string[] | string)[] {
	const names: any[] = [];

	if (Array.isArray(param)) return param.flatMap(x => findeKey(x, parentKey, valKey, prev.concat(names)));

	Object.keys(param).forEach(k => {
		if (k === parentKey) names.push(prev.length ? [prev.pop(), [param[k][valKey]]] : param[k][valKey]);

		if (typeof param[k] === "object") return names.push(...findeKey(param[k], parentKey, valKey, prev.concat(names)));
	});

	return names;
}
