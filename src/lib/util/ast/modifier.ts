import {
	Node,
	ModifierFlags,
	Declaration,
	getCombinedModifierFlags,
} from "typescript";

export function hasModifier(node: Node, modifier: ModifierFlags): boolean {
	return (getCombinedModifierFlags(node as Declaration) & modifier) !== 0;
}
