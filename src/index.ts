/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import program from "commander";

import { Options } from "@/options";

import { search } from "@/lib//util/search";
import { parseFiles } from "@/lib/util/parser";

import { File } from "@/lib/impl/File";

const packageJson = require("../package.json");

program.requiredOption("-p, --pattern <glob>", "a glob to search for");

program.option("-r, --root <path>", "root path to resolve from", process.cwd());
program.option("-v, --verbose", "run in verbose mode", false);

program.option("-f, --files <number>", "number of files to parse at once", 50);

program.option("-p, --prefix <string>", "relative path prefix for imports", "");

program.option("-m, --map", "generate an object that maps the imports to camelCase");
program.option("--map-path", "map folders by path", false);
program.option("--map-path-start <number>", "path index to start mapping at", 2);
program.option("--map-path-max <number>", "max number of paths to include while mapping", 1);
program.option("--map-replace <regex>", "a regex to remove parts of the export name when mapping");


program.parse(process.argv);

const options: Options = {
	pattern: program.pattern,
	root: program.root,

	parse: {
		files: program.files,
	},

	verbose: program.verbose,
};

if (program.map) {
	options.map = {
		path: program.mapPath,
	};
}

if (options.verbose) {
	console.log(`${packageJson.name} v${packageJson.version} is starting with options:`, options);
}

search(options.pattern, options.root).then((paths) => {
	console.log(`found ${paths.length} files matching "${options.pattern}" in directory "${options.root}"`);

	if (!paths.length) {
		return onError("searching")(new Error("no files found"));
	}

	parseFiles(paths, options.parse.files).then((files: File[]) => {
		files.forEach((file) => {
			console.log(file.absolutePath, file.exports.map((exp) => exp.identifier));
		});
	}).catch(onError("parsing"));
}).catch(onError("searching"));

function onError(when: string) {
	return (error: Error) => {
		console.error(`error while ${when}:`, error.message);
		console.log("exiting...");
	};
}
