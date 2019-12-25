import {
	Node,

	ScriptTarget,
	ScriptKind,
	NewLineKind,
	EmitHint,

	createSourceFile,
	createPrinter,

} from "typescript";

const blankFile = createSourceFile("", "", ScriptTarget.Latest, false, ScriptKind.TS);
const defaultPrinter = createPrinter({ newLine: NewLineKind.LineFeed });

export function nodeToString(node: Node): string {
	return defaultPrinter.printNode(EmitHint.Unspecified, node, blankFile);
}
