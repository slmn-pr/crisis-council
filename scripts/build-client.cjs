const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'public', 'ts');
const outputDir = path.join(root, 'public', 'js');
const globalTypes = path.join(sourceDir, 'global.d.ts');
const entries = ['api', 'index', 'login', 'scored', 'analytical', 'team'];
const options = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.None,
  lib: ['lib.dom.d.ts', 'lib.es2020.d.ts'],
  strict: false,
  skipLibCheck: true,
  noEmitOnError: true,
  rootDir: sourceDir,
  outDir: outputDir
};

fs.mkdirSync(outputDir, { recursive: true });
let failed = false;

for (const entry of entries) {
  const program = ts.createProgram(
    [globalTypes, path.join(sourceDir, `${entry}.ts`)],
    options
  );
  const diagnostics = [
    ...program.getOptionsDiagnostics(),
    ...program.getSyntacticDiagnostics(),
    ...program.getSemanticDiagnostics()
  ];
  if (diagnostics.length) {
    failed = true;
    for (const diagnostic of diagnostics) {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      const location = diagnostic.file && diagnostic.start !== undefined
        ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
        : null;
      const prefix = location
        ? `${path.relative(root, diagnostic.file.fileName)}:${location.line + 1}:${location.character + 1}`
        : 'TypeScript';
      console.error(`${prefix} ${message}`);
    }
    continue;
  }

  const result = program.emit();
  if (result.emitSkipped) failed = true;
}

if (failed) process.exitCode = 1;
