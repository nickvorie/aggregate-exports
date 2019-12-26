import { Node, Identifier } from "typescript";
import path from "path";

import { PathResolver } from "@/lib/PathResolver";
import { generateAggregatedExports } from "@/lib/util/ast/exports";
import { nodeToString } from "@/lib/util/ast/print";

export class File {
	public readonly absolutePath: string;
	public exports: Identifier[];

	constructor(absolutePath: string, exports: Identifier[]) {
		this.absolutePath = absolutePath;
		this.exports = exports;
	}

	public getExportNode(resolver: PathResolver, from?: string): Node {
		const mapped = resolver.getMappedPath(this.absolutePath, from);
		let mappedPath = mapped.source;

		if (mapped.source.length) {
			mappedPath = mapped.mapped;
		}

		return generateAggregatedExports(mappedPath, this.exports);
	}

	public getExportString(resolver: PathResolver): string {
		return nodeToString(this.getExportNode(resolver));
	}
}
