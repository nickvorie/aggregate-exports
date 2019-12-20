import path from "path";

import { Export } from "@/lib/impl/Export";
import { Import } from "@/lib/impl/Import";

export class File {
	public readonly absolutePath: string;

	public exports: Export[] = [];

	constructor(absolutePath: string, exports: Export[]) {
		this.absolutePath = absolutePath;
		this.exports = exports;
	}

	public imports(): Import[] {
		return null;
	}

	public relativePath(from: string): string {
		return path.relative(from, this.absolutePath);
	}
}
