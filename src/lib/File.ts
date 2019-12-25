import { Node, Identifier } from "typescript";
import path from "path";

import { Paths } from "@/lib/paths";
import { generateAggregatedExports } from "@/lib/util/ast/exports";
import { nodeToString } from "@/lib/util/ast/print";

export class File {
	public readonly absolutePath: string;
	public exports: Identifier[];

	constructor(absolutePath: string, exports: Identifier[]) {
		this.absolutePath = absolutePath;
		this.exports = exports;
	}

	public getExportNode(resolver: Paths, from?: string): Node {
		const mapped = resolver.getMappedPath(this.absolutePath, from);
		let mappedPath = mapped.source;

		if (mapped.source.length) {
			mappedPath = mapped.mapped;
		}

		return generateAggregatedExports(mappedPath, this.exports);
	}

	public getExportString(resolver: Paths): string {
		return nodeToString(this.getExportNode(resolver));
	}
}
