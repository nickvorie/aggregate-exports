# aggregate-exports

This build tool/utility is used to generate "aggregate export" files for large projects. An "aggregate export" file is a file which aggregates all of the exported members of a group of files and re-exports them. This is useful for when you have a library where the project is split up across multiple files and you would like to provide one file that can be imported and include the exports of multiple files, without having to manually import and export potentially hundreds of files. This is also useful for when your project has a folder full of implementations and you would like to create an object or array that includes every implementation without having to manually write every import statement.

## Installation
I am currently in the process of wrapping up the final features and then distributing via NPM. Until then you can follow the directions to build the project yourself:

1. Clone repo `git clone https://github.com/nickvorie/aggregate-exports.git`
2. Install dependancies `npm install` (might take a few minutes to download all of the typescript dependancies)
3. Build typescript to JS `npm run build:dist`
4. (optional) Link package with `npm link`
5. Run with node dist/index.js <command> [options]

## Usage

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

```
aggregate-exports generate [options] <pattern>

generate aggregate exports for files specified by a glob pattern

Options:
  -b, --base <folder>            base folder for resolving path mappings (default: "./src")
  -m, --mappings <mapping:path>  comma seperated list of path mappings (default: "")
  -s, --strip-extention          strip file extention when generating export statement (default: true)
  -o, --output <file_name>       export file to generate (default: "exports.ts")
  -i, --ignore-warnings          ignore warnings about overwriting existing files (default: false)
  -g, --mode <single|directory>  generate a single export file or one per directory (default: "directory")
  -h, --help                     output usage information
```

```
aggregate-exports clean [pattern]

clean all generated export aggregation files
```

## Examples

```
aggregate-exports generate -m @:,@lib:lib -v "src/**/*.ts"
```

## Limitations

- Does not handle duplicate exports
- Only supports directory mode currently
