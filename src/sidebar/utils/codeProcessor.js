export const removeComments = (code) => {
    if (typeof code !== 'string') return code;

    return code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^(?!\s*https?:\/\/)\s*\/\/.*$/gm, '')
        .replace(/(\s|[^\w\s:])\/\/.*$/gm, '$1')
        .replace(/\{\s*\}/g, '')
        .replace(/[ \t]+$/gm, '')
        .replace(/^\s*[\r\n]/gm, '')
        .trim();
};