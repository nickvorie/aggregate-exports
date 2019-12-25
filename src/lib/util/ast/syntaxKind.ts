import { SyntaxKind } from "typescript";

const syntaxKindMap: {[index: number]: string} = {};

Object.keys(SyntaxKind).forEach((k) => {
	if (Number.isNaN(parseInt(k, 10))) {
		const value = (SyntaxKind as any)[k as string] as number;

		if (syntaxKindMap[value] == null) {
			syntaxKindMap[value] = k;
		}
	}
});

export function getName(kind: SyntaxKind): string {
	return syntaxKindMap[kind];
}
