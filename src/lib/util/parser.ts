import { promisify } from "util";
import fs from "fs";
import async from "async";

import { File } from "@/lib/impl/File";
import { Export } from "@/lib/impl/Export";

const exportRegex = /export{1}\s+(default\s+)?(?:(const|async|var|let|interface|abstract|class|type|function)\s+)*([\w\d_]+){1}/g;

type callback = (error: Error, path: string, file: File) => void;

export function matchExports(content: string): Export[] {
	const exports: Export[] = [];
	let match = exportRegex.exec(content);

	while (match !== null) {
		exports.push(new Export(match[3]));
		match = exportRegex.exec(content);
	}

	return exports;
}

export async function parseFile(path: string): Promise<File> {
	return new Promise((resolve, reject) => {
		promisify(fs.readFile)(path).then((buffer) => {
			resolve(new File(path, matchExports(buffer.toString())));
		}).catch(reject);
	});
}

export async function parseFiles(paths: string[], limit: number = 50): Promise<File[]> {
	return async.mapLimit(paths, limit, async (path) => parseFile(path));
}
