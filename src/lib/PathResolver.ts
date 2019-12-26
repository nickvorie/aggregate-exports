/* eslint-disable no-shadow */
import path from "path";

import { stripExtention } from "@/lib/util/paths";

export type mapping = {
	path: string;
	tokenized?: string[];
};

export type mappings = {
	[index: string]: mapping;
};

export type mappedPath = {
	source: string;
	mapped: string;
};

function tokenizePath(base: string, mapPath: string): string[] {
	return path.relative(base, path.join(base, mapPath)).split(path.sep).filter((part) => part);
}

export class PathResolver {
	public root: string;
	public base: string;

	public mappings: mappings;
	public stripExtention: boolean;

	constructor(root: string, base: string, mappings?: mappings, stripExtention?: boolean) {
		this.mappings = mappings;
		this.stripExtention = stripExtention;

		if (mappings) {
			Object.keys(this.mappings).forEach((m) => {
				this.mappings[m].tokenized = tokenizePath(base, this.mappings[m].path);
			});
		}

		this.root = root;
		this.base = path.normalize(path.join(root, base));
	}

	// TODO use ts.resolveModuleName
	public resolvePath(file: string, from?: string): mappedPath {
		let relativePath = path.relative(from || this.base, file);
		let mappedPathTokens: string[] = [];

		if (!relativePath.length) {
			relativePath = "./";
		}

		if (this.mappings) {
			const splitRelativePath = path.relative(this.base, file).split(path.sep);

			Object.keys(this.mappings).forEach((m) => {
				const mapping = this.mappings[m];
				const mappingTest = splitRelativePath.filter((dir, index) => mapping.tokenized[index] === dir);

				if (!(mappingTest.length || mapping.tokenized.length) || mappingTest.length === mapping.tokenized.length) {
					const newPathTest = [m].concat(splitRelativePath.slice(mappingTest.length));

					if (!mappedPathTokens.length || newPathTest.length <= mappedPathTokens.length) {
						mappedPathTokens = newPathTest;
					}
				}
			});
		}

		let mappedPath = mappedPathTokens.join(path.sep);

		/**
		 * Preappend ./ to relative file paths that don't have a parent or
		 * current directory token to avoid referring to system or installed modules
		 */
		if (!relativePath.startsWith(".")) {
			relativePath = `.${path.sep}${relativePath}`;
		}

		if (this.stripExtention) {
			relativePath = stripExtention(relativePath);
			mappedPath = stripExtention(mappedPath);
		}

		console.log({
			file,
			from,
			relativePath,
			mappedPath,
		});

		return { source: relativePath, mapped: mappedPath };
	}

	public getMappedPaths(files: string[], from?: string): mappedPath[] {
		return files.map((file) => this.resolvePath(file, from));
	}
}
