export class Import {
	public module: string;
	public members: string[];

	public toString(): string {
		return `import from ${this.module}`;
	}
}
