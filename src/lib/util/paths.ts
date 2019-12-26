import path from "path";

export function stripExtention(file: string): string {
	const extention = path.parse(file).ext;

	if (!extention) {
		return file;
	}

	return file.substring(0, file.length - extention.length);
}

export function parentDir(file: string, levels: number = 1): string {
	return path.join(file, "../".repeat(levels));
}

export function groupByDirectory(paths: string[]) {
	const groupedPaths: {[index: string]: string[]} = {};

	paths.forEach((p) => {
		const { dir } = path.parse(p);
		const group = groupedPaths[dir];

		if (group) {
			group.push(p);
		} else {
			groupedPaths[dir] = [p];
		}
	});

	return groupedPaths;
}
