import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as assert from 'assert';

import * as vscode from 'vscode';

import { formatImports } from '../../format-imports';

interface Case {
    input: string;
    output: string;
}

const cases: Case[] = [{
    input:
`'use strict';

import { foo } from "./b";
import { bar } from './a';
import * as b from '../b';
import baz from '../../c';
import { writeFileSync } from 'fs';

import {
    one,
    two,
    three
} from './four';

require('./style.scss');

import { join as pathJoin } from 'path';

export const lorem = 'ipsum';


export const dolor = 'sit';
`,
    output:
`'use strict';

import { writeFileSync } from 'fs';
import { join as pathJoin } from 'path';

import baz from '../../c';

import * as b from '../b';

import { bar } from './a';
import { foo } from './b';
import {
    one,
    two,
    three
} from './four';

require('./style.scss');

export const lorem = 'ipsum';


export const dolor = 'sit';
`
}];

function runCase(input: string) {
    let testFilePath = path.join(os.tmpdir(), 'format-imports-' + (Math.random() * 100000) + '.ts');

    fs.writeFileSync(testFilePath, input);

    return vscode.workspace.openTextDocument(testFilePath).then((document) => {
        return vscode.window.showTextDocument(document).then((editor) => {
            formatImports();

            return new Promise((resolve) => {
                setTimeout(resolve, 200);
            }).then(() => {
                return editor.document.getText();
            });
        });
    });
}

suite('formatImports', () => {
    test('formatImports', () => {
        return cases.reduce((p, c) => {
            return p.then(() => {
                return runCase(c.input).then(output => {
                    assert.equal(output, c.output);
                });
            })
        }, Promise.resolve());
    });
});
