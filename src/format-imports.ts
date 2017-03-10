'use strict';

import * as vscode from 'vscode';
import * as tsFormatImports from 'typescript-format-imports';

export function formatImports() {
    const editor = vscode.window.activeTextEditor;

    const originalLines: string[] = [];

    for (let i = 0; i < editor.document.lineCount; i++) {
        originalLines.push(editor.document.lineAt(i).text);
    }

    const lines = tsFormatImports.formatImports(originalLines);

    const wholeDocument = new vscode.Range(
        editor.document.lineAt(0).range.start,
        editor.document.lineAt(editor.document.lineCount - 1).range.end
    );

    editor.edit(editBuilder => {
        editBuilder.replace(wholeDocument, lines.join('\n'));
    });
}
