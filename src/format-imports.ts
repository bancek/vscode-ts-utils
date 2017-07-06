'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import * as tsFormatImports from 'typescript-format-imports';
import * as readPkgUp from 'read-pkg-up';

export function formatImports() {
    const editor = vscode.window.activeTextEditor;

    const parentPath = path.resolve(path.join(editor.document.fileName, '..'));

    (readPkgUp({ cwd: parentPath }) as Promise<any>).then(result => {
        const options: tsFormatImports.FormatImportsOptions = {};

        if (
            result.pkg != null &&
            result.pkg.tsFormatImports != null &&
            result.pkg.tsFormatImports.internalModules != null &&
            result.pkg.tsFormatImports.internalModules.length > 0
        ) {
            options.internalModules = new Set<string>(result.pkg.tsFormatImports.internalModules);
        }

        const originalLines: string[] = [];

        for (let i = 0; i < editor.document.lineCount; i++) {
            originalLines.push(editor.document.lineAt(i).text);
        }

        const lines = tsFormatImports.formatImports(originalLines, options);

        const wholeDocument = new vscode.Range(
            editor.document.lineAt(0).range.start,
            editor.document.lineAt(editor.document.lineCount - 1).range.end
        );

        editor.edit(editBuilder => {
            editBuilder.replace(wholeDocument, lines.join('\n'));
        });
    }, (err) => {
        vscode.window.showWarningMessage('TS format imports error: ' + err);
    });
}
