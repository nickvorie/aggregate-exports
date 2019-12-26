import path from "path";
import _ from "lodash";
import { Identifier } from "typescript";

import { timer } from "@/lib/util/timer";
import { File } from "@/lib/File";
import { DuplicateMode } from "@/modes";

/**
 * This function pre-processes an array of Files that will have their exports aggregated.
 * This function mutates files[].exports to handle duplicate Identifiers.
 *
 * @param files {File[]} the files to process
 * @param options {ojbect} options to process with
 * @param options.duplicate {DuplicateMode} the mode to handle duplicate exported Identifiers
 * @param options.verbose {?boolean} wheather or not to run in verbose mode
 */
export function processFiles(files: File[], options: { duplicateMode: DuplicateMode, verbose?: boolean }) {
	// Create an object to track Identifiers that have been processed already
	const exportedIdentifiers: {[index: string]: number} = {};

	const timerKey = timer.start("process");

	// Loop each file
	files.forEach((file) => {
		// Loop each exported Identifier
		file.exports.forEach((identifier: Identifier) => {
			// TODO: handle IdentifierOrTuple
			const name = identifier.escapedText.toString();

			// Check duplicate Identifier
			if (Object.keys(exportedIdentifiers).includes(name)) {
				// Handle duplicate

				if (options.verbose) {
					console.log("duplicate identifer found:", name);
				}

				// Remove the duplicate Identifier
				_.pull(file.exports, identifier);

				if (options.duplicateMode === DuplicateMode.RENAME_PARENT) {
					// Add renamed Identifier based on parent module name
					const moduleName = path.parse(file.absolutePath).name;
					const newIdentifier = name + moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

					if (options.verbose) {
						console.log("replacing", name, "with", newIdentifier);
					}

					// Use unshift instead of push so that the replaced IdentifierTuple is not looped over again
					file.exports.unshift([name, newIdentifier]);
				} else if (options.duplicateMode === DuplicateMode.RENAME_SEQ) {
					// Add sequentially renamed Identifier
					const numDupes = ++exportedIdentifiers[name];
					const newIdentifier = name + numDupes;

					if (options.verbose) {
						console.log("replacing", name, "with", newIdentifier);
					}

					// Use unshift instead of push so that the replaced IdentifierTuple is not looped over again
					file.exports.unshift([name, newIdentifier]);
				} else if (options.duplicateMode === DuplicateMode.EXCLUDE) {
					// Don't re-add
					if (options.verbose) {
						console.log("excluding", name);
					}
				}
			} else {
				// Index the Indentifier
				exportedIdentifiers[name] = 0;
			}
		});
	});

	if (options.verbose) {
		console.log("processed", files.length, "files in", `${timer.end(timerKey)}ms`);
	}
}
