import fs from "fs";
import async from "async";
import ts, { SourceFile } from "typescript";
import { promisify } from "util";

import { getExportedIdentifiers } from "@/lib/util/ast/exports";
import { exportFileCommentRegex } from "@/lib/util/util";
import { File } from "@/lib/File";

export async function getAst(path: string): Promise<SourceFile> {
	const contents: string = (await promisify(fs.readFile)(path)).toString();
	return ts.createSourceFile(path, contents, ts.ScriptTarget.Latest, false, ts.ScriptKind.Unknown);
}

export function parseFile(path: string, sourceFile: SourceFile): File {
	if (sourceFile.getFullText().match(exportFileCommentRegex)) {
		return null;
	}

	const exports = getExportedIdentifiers(sourceFile);

	if (!exports.length) {
		return null;
	}

	return new File(path, exports);
}

export async function parseFiles(paths: string[], limit: number = 50): Promise<File[]> {
	return new Promise((resolve, reject) => {
		const program = ts.createProgram(paths, { allowJs: true });

		async.mapLimit(paths, limit, (path, cb) => {
			cb(null, parseFile(path, program.getSourceFile(path)));
		}, (error, files) => {
			if (error) {
				return reject(error);
			}

			return resolve(files.filter((file) => file) as File[]);
		});
	});
}
