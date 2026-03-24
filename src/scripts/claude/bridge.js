chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ADD_FILE') {
        const messageListener = (event) => {
            if (event.source !== window) return;
            if (event.data.type === 'CLAUDE_UPLOAD_SUCCESS') {
                cleanup();
                sendResponse({ success: true });
            } else if (event.data.type === 'CLAUDE_UPLOAD_ERROR') {
                cleanup();
                sendResponse({ success: false, error: event.data.error });
            }
        };
        const cleanup = () => {
            window.removeEventListener('message', messageListener);
            clearTimeout(timeoutId);
        };
        const timeoutId = setTimeout(() => {
            cleanup();
            sendResponse({ success: false, error: 'Timeout' });
        }, 8000);
        window.addEventListener('message', messageListener);
        window.postMessage({ type: 'CLAUDE_UPLOAD_FILE', fileName: message.fileName, content: message.content }, '*');
        return true;
    }
});