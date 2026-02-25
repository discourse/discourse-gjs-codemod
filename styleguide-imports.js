function ensureOptionalRequireImport(contents) {
  if (
    /import\s+\{[^}]*\boptionalRequire\b[^}]*\}\s+from\s+"discourse\/lib\/utilities";?/.test(
      contents,
    )
  ) {
    return contents;
  }

  const importStatements = [...contents.matchAll(/^import[\s\S]*?;\n?/gm)];
  const optionalRequireImport = `import { optionalRequire } from "discourse/lib/utilities";\n`;

  if (importStatements.length > 0) {
    const lastImport = importStatements.at(-1);
    const insertionPoint = lastImport.index + lastImport[0].length;
    return (
      contents.slice(0, insertionPoint) +
      optionalRequireImport +
      contents.slice(insertionPoint)
    );
  }

  return optionalRequireImport + contents;
}

export function replaceStyleguideImports(contents) {
  contents = contents.replace(
    /^import\s+([A-Za-z_$][A-Za-z0-9_$]*)\s+from\s+"(discourse\/plugins\/styleguide\/[^"]+)";?\n?/gm,
    (_, localName, importPath) => {
      return `const ${localName} = optionalRequire("${importPath}");\n`;
    },
  );

  return ensureOptionalRequireImport(contents);
}
