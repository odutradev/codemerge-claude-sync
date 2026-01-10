export const removeComments = (code) => {
    if (typeof code !== 'string') return code;
    
    return code
        .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
        .replace(/^\s*[\r\n]/gm, '')
        .trim();
};