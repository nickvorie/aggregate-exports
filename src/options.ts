export type Options = {
	pattern: string,
	root: string,

	verbose: boolean,

	parse: {
		files: number,
	},

	map?: {
		path: boolean
	}
};
