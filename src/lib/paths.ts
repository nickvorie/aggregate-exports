import path from "path";

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

export class Paths {
	public root: string;
	public base: string;

	public mappings: mappings;
	public stripExtention: boolean;

	constructor(root: string, base: string, mappings?: mappings) {
		this.mappings = mappings;

		if (mappings) {
			Object.keys(this.mappings).forEach((m) => {
				this.mappings[m].tokenized = tokenizePath(base, this.mappings[m].path);
			});
		}

		this.root = root;
		this.base = path.normalize(path.join(root, base));
	}

	static stripExtention(file: string) {
		const extention = path.parse(file).ext;

		if (extention) {
			return file.substring(0, file.length - extention.length);
		}

		return file;
	}

	static groupByDirectory(files: string[]) {
		const grouped: {[index: string]: string[]} = {};

		files.forEach((file) => {
			const { dir } = path.parse(file);
			const group = grouped[dir];

			if (group) {
				group.push(file);
			} else {
				grouped[dir] = [file];
			}
		});

		return grouped;
	}

	// TODO use ts.resolveModuleName
	public getMappedPath(file: string, from?: string): mappedPath {
		let relativePath = path.relative(from || this.base, file);

		if (!relativePath.length) {
			relativePath = "./";
		}

		let mapped: string[] = [];

		if (this.mappings) {
			const splitRelativePath = path.relative(this.base, file).split(path.sep);
			let mapping: mapping;

			Object.keys(this.mappings).forEach((m) => {
				mapping = this.mappings[m];
				const mappingTest = splitRelativePath.filter((dir, index) => mapping.tokenized[index] === dir);

				if (!(mappingTest.length || mapping.tokenized.length) || mappingTest.length === mapping.tokenized.length) {
					const newPathTest = [m].concat(splitRelativePath.slice(mappingTest.length));

					if (!mapped.length || newPathTest.length <= mapped.length) {
						mapped = newPathTest;
					}
				}
			});
		}

		return { source: relativePath, mapped: mapped.join(path.sep) };
	}

	public getMappedPaths(files: string[], from?: string): mappedPath[] {
		return files.map((file) => this.getMappedPath(file, from));
	}
}
