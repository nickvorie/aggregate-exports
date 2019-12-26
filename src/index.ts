/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import program from "commander";
import _ from "lodash";

import { generate, options as generateOptions } from "@/commands/generate";
import { clean, options as cleanOptions } from "@/commands/clean";

import { OutputMode, DuplicateMode } from "@/modes";

const packageJson = require("../package.json");

program.option("-r, --root <path>", "root path to run in", process.cwd());
program.option("-f, --files <number>", "number of files to process at once", 50);
program.option("-d, --dry-run", "don't modify any files, only write to console", false);

program.option("-v, --verbose", "run in verbose mode", false);
program.version(packageJson.version);

program.command("generate <pattern>")
	.description("generate aggregate exports for files specified by a glob pattern")
	.option("-b, --base <folder>", "base folder for resolving path mappings", "./src")
	.option("-m, --mappings <mapping:path>", "comma seperated list of path mappings", "")
	.option("-s, --strip-extention", "strip file extention when generating export statement", true)
	.option("-o, --output <file_name>", "export file to generate", "exports.ts")
	.option("-i, --ignore-warnings", "ignore warnings about overwriting existing files", false)
	.option("-g, --mode <single|directory>", "generate a single export file or one per directory", OutputMode.DIRECTORY)
	.option("-D, --duplicate-mode <rename_parent|rename_seq|exclude>",
		"set the behavior for handling duplicate export identifiers", DuplicateMode.RENAME_PARENT)
	.action((pattern, command) => {
		const options: generateOptions = {
			pattern,
			root: program.root,
			base: command.base,
			dryRun: program.dryRun,

			parse: {
				files: program.files,
			},

			output: {
				outputMode: command.mode as OutputMode,
				duplicateMode: command.duplicateMode as DuplicateMode,

				file: command.output,
				ignoreWarnings: command.ignoreWarnings,
				stripExtention: command.stripExtention,
			},

			verbose: program.verbose,
		};

		if (command.mappings) {
			options.mappings = {};

			command.mappings.split(",").forEach((mappingString: string) => {
				const split = mappingString.split(":");

				options.mappings[split[0]] = {
					path: split[1],
				};
			});
		}

		startup(options);
		generate(options);
	});

program.command("clean [pattern]").description("clean all generated export aggregation files")
	.action((pattern) => {
		const options: cleanOptions = {
			pattern: pattern || "src/**/*.+(ts|js)",
			root: program.root,
			files: program.files,
			dryRun: program.dryRun,

			verbose: program.verbose,
		};

		startup(options);
		clean(options);
	});

program.parse(process.argv);

function startup(options: object) {
	console.log(`${packageJson.name} v${packageJson.version} is starting...`);

	if (program.verbose) {
		console.log("using options", options);
	}
}
