/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import path from "path";
import async from "async";
import fs from "fs";
import _ from "lodash";
import { promisify } from "util";
import { Identifier } from "typescript";

import { timer } from "@/lib/util/timer";
import { search } from "@/lib/util/search";
import { groupByDirectory, parentDir } from "@/lib/util/paths";
import { parseFiles } from "@/lib/util/parser";

import { PathResolver, mappings } from "@/lib/PathResolver";
import { OutputMode, DuplicateMode } from "@/modes";
import { isExportFile, exportFileComment, eslintComment } from "@/lib/util/util";
import { processFiles } from "@/lib/util/processor";

export type options = {
	pattern: string;
	root: string;
	base: string;
	dryRun: boolean;

	verbose: boolean;

	parse: {
		files: number;
	}

	mappings?: mappings;

	output: {
		outputMode: OutputMode;
		duplicateMode: DuplicateMode;

		file: string;
		ignoreWarnings: boolean;
		stripExtension: boolean;
	}
};

export async function generate(options: options) {
	timer.start("run");

	try {
		// Create a new PathResolver from the options passed
		const resolver = new PathResolver(options.root, options.base, options.mappings, options.output.stripExtension);

		if (options.verbose) {
			console.log("resolver", resolver);
		}

		timer.start("search");

		// Get a list of files to target from a Glob pattern
		const filePaths = await search(options.pattern, options.root);

		if (options.verbose) {
			console.log("found", filePaths.length, "files in", `${timer.end("search")}ms`);
		}

		if (!filePaths.length) {
			throw new Error("no paths matched");
		}

		timer.start("parse");

		// Parse the file paths into File instances with thier exported members
		const files = await parseFiles(filePaths, options.parse.files);

		if (options.verbose) {
			console.log("parsed", filePaths.length, "files in", `${timer.end("parse")}ms`);
		}

		if (!files.length) {
			throw new Error("no valid files parsed");
		}

		let generatedFiles = 0;
		timer.start("generate");

		if (options.output.outputMode === OutputMode.SINGLE) {
			// Generate one aggregated export file for all target files

			// Resolve the output files path
			const outputFilePath = path.join(resolver.base, options.output.file);

			// Navigate one step up in the file tree due to the last file path segment being the output file
			const from = parentDir(outputFilePath);

			// Pre-process the files before generating the exports to handle any duplicate Identifiers
			processFiles(files, {
				duplicateMode: options.output.duplicateMode,
				verbose: options.verbose,
			});

			// Combine the files exports
			const exportStrings: string[] = files.map((file) => file.getExportString(resolver, from));

			// Write file to disk
			const result = await writeExportFile(outputFilePath, exportStrings);

			if (result) {
				generatedFiles++;
			}
		} else if (options.output.outputMode === OutputMode.DIRECTORY) {
			// Generate one aggregated export file for each directory containing target files

			// Group the target files by directory
			const grouped = groupByDirectory(filePaths);

			// Iterate over each group of files
			await async.forEach(Object.keys(grouped), async (directory) => {
				// Filter empty files
				const groupedFiles = files.filter((file) => grouped[directory].includes(file.absolutePath));

				if (!groupedFiles.length) {
					return;
				}

				// Pre-process the files before generating the exports to handle any duplicate Identifiers
				processFiles(groupedFiles, {
					duplicateMode: options.output.duplicateMode,
					verbose: options.verbose,
				});

				// Combine the files exports
				const exports = groupedFiles.map((file) => file.getExportString(resolver, directory));

				// Write to disk
				const result = await writeExportFile(path.join(directory, options.output.file), exports);

				if (result) {
					generatedFiles++;
				}
			});
		} else {
			throw new Error(`invalid mode: ${options.output.outputMode}`);
		}

		if (options.verbose) {
			console.log("generated", generatedFiles, "aggregate export file(s) in", `${timer.end("generate")}ms`);
		}
	} catch (error) {
		console.error(error);
	}

	console.log("completed in", `${timer.end("run")}ms`);

	async function writeExportFile(file: string, exports: string[]) {
		const contents = [
			exportFileComment,
			eslintComment,
		].concat(exports).filter((line) => line).join("\n");

		const exists = await promisify(fs.exists)(file);
		let isAggregateExportFile = false;

		if (exists) {
			isAggregateExportFile = await isExportFile(file);
		}

		if (options.dryRun) {
			console.log();

			if (exists && !isAggregateExportFile) {
				console.warn("THE FOLLOWING FILE EXISTS ALREADY AND WAS NOT GENERATED BY AGGREGATE-EXPORTS");
			}

			console.log(`${file}:`);
			console.log(contents);
			console.log();
		} else {
			if (exists && !isAggregateExportFile && !options.output.ignoreWarnings) {
				console.warn(`skipping pre-existing file: ${file}, to ignore this warning run with -i`);
				return false;
			}

			await promisify(fs.writeFile)(file, contents);
		}

		return true;
	}
}
