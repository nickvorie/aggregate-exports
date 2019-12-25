import ts, {
	Node,
	SourceFile,
	Identifier,
	ModifierFlags,
	ExportDeclaration,
	NamedDeclaration,
	ExportAssignment,

	isIdentifier,
	isVariableStatement,

	createStringLiteral,
	createExportSpecifier,
	createNamedExports,
	createExportDeclaration,
	createExportAssignment,
	DeclarationStatement,
	Declaration,
	createIdentifier,
} from "typescript";

import { hasModifier } from "@/lib/util/ast/modifier";

// export function exportString()

export function generateAggregatedExports(module: string, identifiers?: Identifier[]): ExportDeclaration | ExportAssignment {
	const moduleSpecifier = createStringLiteral(module);

	if (!identifiers) {
		return createExportDeclaration([], [], null, moduleSpecifier);
	}

	const elements = identifiers.map((identifier) => createExportSpecifier(null, identifier));
	const namedExports = createNamedExports(elements);

	return createExportDeclaration([], [], namedExports, moduleSpecifier);
}

export function isDefaultExport(node: Node, identifier?: Identifier): boolean {
	if (!identifier || !identifier.text) {
		return true;
	}

	return hasModifier(node, ModifierFlags.Default);
}

export function getExportedIdentifiers(sourceFile: SourceFile): Identifier[] {
	const identifiers: Identifier[] = [];

	sourceFile.forEachChild((node) => {
		// TODO check dupes
		function addExport(identifier?: Identifier) {
			if (isDefaultExport(node, identifier)) {
				identifiers.push(createIdentifier("default"));
			} else {
				identifiers.push(identifier);
			}
		}

		if (hasModifier(node, ModifierFlags.Export)) {
			if (isVariableStatement(node)) {
				node.declarationList.declarations.forEach((variableDeclaration) => {
					if (isIdentifier(variableDeclaration.name)) {
						addExport(variableDeclaration.name);
					} else {
						// TODO support destructuring objects and arrays
					}
				});
			} else if (ts.isClassDeclaration(node)) {
				addExport(node.name);
			} if (ts.isInterfaceDeclaration(node)) {
				addExport(node.name);
			} else if (ts.isFunctionDeclaration(node)) {
				addExport(node.name);
			} else if (ts.isEnumDeclaration(node)) {
				addExport(node.name);
			} else if (ts.isTypeAliasDeclaration(node)) {
				addExport(node.name);
			} else if (ts.isModuleDeclaration(node)) {
				if (isIdentifier(node.name)) {
					addExport(node.name);
				}
			}
		} else if (ts.isExportAssignment(node)) {
			// export default ...
			// export = ...
			addExport();
		} else if (ts.isExportDeclaration(node)) {
			// export ... from "module";
			if (node.exportClause) {
				// export {...} from "module";
				node.exportClause.elements.forEach((exportSpecifier) => {
					addExport(exportSpecifier.name);
				});
			} else {
				// export * from "module";
			}
		}
	});

	return identifiers;
}
