# aggregate-exports

This build tool/utility is used to generate "aggregate export" files for large projects. An "aggregate export" file is a file which aggregates all of the exported members of a group of files and re-exports them. This is useful for when you have a library where the project is split up across multiple files and you would like to provide one file that can be imported and include the exports of multiple files, without having to manually import and export potentially hundreds of files. This is also useful for when your project has a folder full of implementations and you would like to create an object or array that includes every implementation without having to manually write every import statement.

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
  -h, --help                     output usage information             clean all generated export aggregation files
```

```
aggregate-exports clean [pattern]

clean all generated export aggregation files
```

## Limitations

- Does not handle duplicate exports
- Only supports directory mode currently
