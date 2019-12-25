import path from "path";
import fs from "fs";
import readline from "readline";

export async function firstLine(file: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(file, {
			highWaterMark: 1,
		});

		stream.on("error", reject);

		const lineReader = readline.createInterface(stream);

		lineReader.on("line", (line) => {
			stream.destroy();
			lineReader.close();

			resolve(line);
		});

		lineReader.on("error", reject);
	});
}

export function groupByDir(paths: string[]) {
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
