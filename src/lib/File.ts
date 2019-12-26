import { Node, Identifier } from "typescript";
import path from "path";

import { PathResolver } from "@/lib/PathResolver";
import { generateAggregatedExports, IdentifierOrTuple } from "@/lib/util/ast/exports";
import { nodeToString } from "@/lib/util/ast/print";

export class File {
	public readonly absolutePath: string;
	public exports: IdentifierOrTuple[];

	constructor(absolutePath: string, exports: IdentifierOrTuple[]) {
		this.absolutePath = absolutePath;
		this.exports = exports;
	}

	public getExportNode(resolver: PathResolver, from?: string): Node {
		const resolved = resolver.resolvePath(this.absolutePath, from);
		let mappedPath = resolved.source;

		if (resolved.mapped.length) {
			mappedPath = resolved.mapped;
		}

		return generateAggregatedExports(mappedPath, this.exports);
	}

	public getExportString(resolver: PathResolver, from?: string): string {
		return nodeToString(this.getExportNode(resolver, from));
	}
}
