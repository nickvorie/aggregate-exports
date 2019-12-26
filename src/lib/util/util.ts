import { firstLine } from "@/lib/util/files";

export const exportFileCommentRegex = new RegExp(/^\/\*\s*aggregate-export\s*\*\//);
export const exportFileComment = "/* aggregate-export */";

export const eslintComment = "/* eslint-disable */";

export async function isExportFile(file: string): Promise<boolean> {
	const line = await firstLine(file);

	return new Promise((resolve, reject) => {
		resolve(!!line.match(exportFileCommentRegex));
	});
}


export const start = "";
