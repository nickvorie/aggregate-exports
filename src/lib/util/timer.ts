const precisions: {[index: string]: bigint} = {
	us: 1n,
	ns: 1000n,
	ms: 1000000n,
	s: 1000000n * 1000n,
	m: 1000000n * 1000n * 60n,
	h: 1000000n * 1000n * 60n * 60n,
};

const labels: {[label: string]: bigint} = {};

export function start(label = ""): string {
	let newLabel = label;
	const existingTimer = labels[newLabel];

	if (existingTimer) {
		newLabel = `${label}.${Math.random()}`;
	}

	labels[newLabel] = process.hrtime.bigint();
	return newLabel;
}

export function end(label = "", precision: string = "ms"): number {
	const startTime = labels[label];

	if (!start) {
		return -1;
	}

	delete labels[label];

	const dif = process.hrtime.bigint() - startTime;

	return Number(dif / precisions[precision]);
}

export const timer = { start, end };
