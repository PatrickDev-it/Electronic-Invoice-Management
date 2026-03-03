export default function findProperty(
	param: { [key: string]: any },
	predicate: (obj: { [key: string]: any }) => any,
	prev: string[] = [],
): ReturnType<typeof predicate>[] {
	const res: any[] = [];

	if (Array.isArray(param)) return param.flatMap(x => findProperty(x, predicate, prev.concat(res)));

	Object.keys(param).forEach(k => {
		const check = predicate(param[k]);
		if (check) res.push(check);

		if (typeof param[k] === "object") return res.push(...findProperty(param[k], predicate, prev.concat(res)));
	});

	return res;
}
