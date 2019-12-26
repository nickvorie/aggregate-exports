# aggregate-exports
This build tool/utility is used to generate "aggregate export" files for large projects. An "aggregate export" file is a file which aggregates all of the exported members of a group of files and re-exports them. This is useful for when you have a library where the project is split up across multiple files and you would like to provide one file that can be imported and include the exports of multiple files, without having to manually import and export potentially hundreds of files. This is also useful for when your project has a folder full of implementations and you would like to create an object or array that includes every implementation without having to manually write every import statement.

## Roadmap
- Finish writing tests 
- [~~Support single file output mode~~](https://github.com/nickvorie/aggregate-exports/commit/159202959ec81e549c6566c29de161ddbc5512fd)
- Improve CLI documentation and include better examples of use-cases
- Write API documentation for programmatic use
- Document the code with proper JSDocs
- Publish to NPM
- Support a `agg-exports.json` configuration file allowing more granular behavior control
- Add the ability for export identifier mapping/filtering/grouping

## Limitations
- Does not handle duplicate exports
- ~~Only supports directory mode currently~~
- Only supports path mapping, identifier mapping coming soon

## Installation
I am currently in the process of wrapping up the final features and then publishing via NPM. Until then you can follow the directions to build the project yourself:

1. Clone repo `git clone https://github.com/nickvorie/aggregate-exports.git`
2. Install dependencies `npm install` (might take a few minutes to download all of the TypeScript and eslint dependencies)
3. Build TypeScript to JS `npm run build:dist`
4. (optional) Link package with `npm link`
5. Run with node dist/index.js <command> [options]

## Usage
Below is the help output from the CLI.

### General options (applies to all commands)

```
aggregate-exports <command>

Options:
  -V, --version                 output the version number
  -r, --root <path>             root path to run in (default: cwd)
  -f, --files <number>          number of files to process at once (default: 50)
  -d, --dry-run                 don't modify any files, only write to console (default: false)
  -v, --verbose                 run in verbose mode (default: false)
  -h, --help                    output usage information

Commands:
  generate [options] <pattern>  generate aggregate exports for files specified by a glob pattern
  clean [pattern]               clean all generated export aggregation files
```

### Generate aggregate exports

```
aggregate-exports generate [options] <pattern>

generate aggregate exports for files specified by a glob pattern

Options:
  -b, --base <folder>            base folder for resolving path mappings (default: "./src")
  -m, --mappings <mapping:path>  comma separated list of path mappings (default: "")
  -s, --strip-extention          strip file extension when generating export statement (default: true)
  -o, --output <file_name>       export file to generate (default: "exports.ts")
  -i, --ignore-warnings          ignore warnings about overwriting existing files (default: false)
  -g, --mode <single|directory>  generate a single export file or one per directory (default: "directory")
  -h, --help                     output usage information
```

#### TypeScript path mapping

aggregate-exports supports relative path mapping using a similar syntax to the `tsconfig.json`'s `compilerOptions.paths` property. If your project doesn't use paths, you can ignore this setting. 

Examples:

`tsconfig.json`:

```
"compilerOptions": {
	"baseUrl": "src",
	
	"paths": {
		"@/*": ["*"],
		"@lib/*": ["*/lib"],
	},
}
```

CLI options:

```
aggregate-exports generate -b ./src -m @:,@lib:lib "src/**/*.+(ts|js)"
```

Break-down:

- `aggregate-exports generate` will run the generate command
- `-b ./src` sets the "baseUrl" to resolve paths (relative to the root directory, which defaults to the current working directory) from `./src` (the default path)
- `-m` tells aggregate-exports to use path mapping
- `@:` is saying map the base directory (`<project root>/src/`) to `@/path/to/module` (no string after the colon means to map the "baseUrl")
- `@lib:lib` is saying map the `./lib` directory (`<project root>/src/lib`) to `@lib/path/to/lib/module`
- `"src/**/*.+(ts|js)"` is the target glob, telling agg-exports to target all `.ts` and `.js` files in the `<project root>/src` directory

### Clean aggregate export files

```
aggregate-exports clean [pattern]

clean all generated export aggregation files
```

## Examples

### generate

Command:

```
aggregate-exports generate -m @: -o index.ts -v "src/lib/util/ast/*.ts"
```

Example output:

`src/lib/util/ast/index.ts`:

```
/* aggregate-export */
/* eslint-disable */
export { generateAggregatedExports, isDefaultExport, getExportedIdentifiers } from "@/lib/util/ast/exports";
export { hasModifier } from "@/lib/util/ast/modifier";
export { nodeToString } from "@/lib/util/ast/print";
export { getName } from "@/lib/util/ast/syntaxKind";
```


### clean

```
aggregate-exports clean -v "+(test|src)/**/*.ts"
```


