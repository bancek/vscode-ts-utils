import * as _ from 'lodash';

export function importPath(text: string): string {
    return text.match(/from '(.*)'/)[1];
}

export function pathDepth(path: string): number {
    if (path.startsWith('./')) {
        return 1;
    } else if (/..\//.test(path)) {
        return 1 + path.split('/').filter(x => x === '..').length;
    } else {
        return 0;
    }
}

export function formatImportsLines(originalLines: string[]): string[] {
    let imports: string[] = [];

    let beforeLines: string[] = [];

    let afterLines: string[] = [];

    let wasImport = false;
    let isBeforeImports = true;
    let multiLineImport: string[] = null;

    originalLines.forEach(text => {
        if (multiLineImport != null) {
            multiLineImport.push(text);

            if (/}/.test(text)) {
                imports.push(multiLineImport.join('\n'));
                multiLineImport = null;
            }
        } else if (/^import /.test(text)) {
            if (/{/.test(text) && !/}/.test(text)) {
                multiLineImport = [text];
            } else {
                imports.push(text);
            }

            isBeforeImports = false;
            wasImport = true;
        } else if (isBeforeImports) {
            beforeLines.push(text);
        } else if (text === '' && (wasImport || afterLines.length === 0)) {
            wasImport = false;
        } else {
            afterLines.push(text);
            wasImport = false;
        }
    });

    imports = imports.map(text => text.replace(/"/g, `'`));

    let groupped = _.toPairs(_.groupBy(imports, text => pathDepth(importPath(text)))).map(x => [parseInt(x[0], 10), x[1]] as [number, string[]]);
    groupped = _.reverse(_.sortBy(groupped, x => x[0] === 0 ? Infinity : x[0]));

    const importLines: string[] = [];

    groupped.forEach(x => {
        _.sortBy(x[1], text => importPath(text)).forEach(text => importLines.push(text));
        importLines.push('');
    });

    const lines = beforeLines.concat(importLines).concat(afterLines);

    return lines;
}
