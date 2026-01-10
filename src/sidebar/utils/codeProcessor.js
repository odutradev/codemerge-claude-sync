export const processCode = (code, options = {}) => {
    if (typeof code !== 'string') return code;

    let processed = code;

    if (options.removeComments) {
        processed = processed
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/^(?!\s*https?:\/\/)\s*\/\/.*$/gm, '')
            .replace(/(\s|[^\w\s:])\/\/.*$/gm, '$1');
    }

    if (options.removeLogs) {
        processed = processed.replace(/^\s*console\.(log|debug|info|warn|error)\(.*\);?\s*$/gm, '');
    }

    if (options.removeEmptyLines) {
        processed = processed.replace(/^\s*[\r\n]/gm, '');
    }

    processed = processed
        .replace(/\{\s*\}/g, '{}')
        .replace(/[ \t]+$/gm, '')
        .trim();

    return processed;
};

export const removeComments = (code) => processCode(code, { removeComments: true, removeEmptyLines: true });