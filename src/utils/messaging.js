export const injectTextToPage = async (text) => window.postMessage({ type: 'AI_INJECT_TEXT', text }, '*');

export const uploadFileToPage = async (fileName, content) => new Promise((resolve, reject) => {
    const messageListener = (event) => {
        if (event.source !== window) return;
        if (event.data.type === 'AI_UPLOAD_SUCCESS') {
            cleanup();
            resolve();
        } else if (event.data.type === 'AI_UPLOAD_ERROR') {
            cleanup();
            reject(new Error(event.data.error));
        }
    };
    const cleanup = () => {
        window.removeEventListener('message', messageListener);
        clearTimeout(timeoutId);
    };
    const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Timeout injector'));
    }, 8000);
    window.addEventListener('message', messageListener);
    window.postMessage({ type: 'AI_UPLOAD_FILE', fileName, content }, '*');
});