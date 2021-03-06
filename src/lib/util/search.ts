import { promisify } from "util";
import glob from "glob";

export function search(pattern: string, cwd: string): Promise<string[]> {
	return promisify(glob)(pattern, {
		cwd,
		absolute: true,
		silent: true,
		nodir: true,
	});
}
