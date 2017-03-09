'use strict';

import * as vscode from 'vscode';

import { formatImports } from './format-imports';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.formatImports', () => {
        formatImports();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
