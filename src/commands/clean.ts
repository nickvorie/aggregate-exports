import fs from "fs";
import { promisify } from "util";
import async from "async";

import { isExportFile } from "@/lib/util/util";
import { search } from "@/lib/util/search";
import { timer } from "@/lib/util/timer";

export type options = {
	pattern: string;
	root: string;
	files: number;
	dryRun: boolean;

	verbose: boolean;
};

export async function clean(options: options) {
	timer.start("clean");

	let deletedFiles = 0;
	const files = await search(options.pattern, options.root);

	await async.forEachLimit(files, options.files, async (file) => {
		if (await isExportFile(file)) {
			if (options.dryRun) {
				console.log(file);
			} else {
				await promisify(fs.unlink)(file);
			}

			deletedFiles++;
		}
	});

	console.log("deleted", deletedFiles, "files in", `${timer.end("clean")}ms`);
}
