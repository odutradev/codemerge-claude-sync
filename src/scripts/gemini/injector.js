window.addEventListener('message', async (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'GEMINI_INJECT_TEXT') {
        const editor = document.querySelector('.ql-editor') || document.querySelector('div[contenteditable="true"]');
        if (!editor) return;
        editor.focus();
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', event.data.text);
        const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true, clipboardData: dataTransfer });
        editor.dispatchEvent(pasteEvent);
        return;
    }

    if (event.data.type === 'GEMINI_UPLOAD_FILE') {
        const { fileName, content } = event.data;
        try {
            const file = new File([content], fileName, { type: 'text/plain', lastModified: Date.now() });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            let fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                Object.defineProperty(fileInput, 'files', { value: dataTransfer.files, writable: false, configurable: true });
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                fileInput.dispatchEvent(new Event('input', { bubbles: true }));
                window.postMessage({ type: 'GEMINI_UPLOAD_SUCCESS' }, '*');
                return;
            }
            const editor = document.querySelector('div[contenteditable="true"]') ||
                           document.querySelector('.ql-editor') ||
                           document.querySelector('rich-textarea textarea') ||
                           document.querySelector('rich-textarea');
            if (!editor) throw new Error("EditorNotFound");
            editor.focus();
            await new Promise(r => setTimeout(r, 100));
            const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true, clipboardData: new DataTransfer() });
            Object.defineProperty(pasteEvent, 'clipboardData', { value: dataTransfer, writable: false, configurable: true });
            editor.dispatchEvent(pasteEvent);
            if (pasteEvent.defaultPrevented) {
                window.postMessage({ type: 'GEMINI_UPLOAD_SUCCESS' }, '*');
                return;
            }
            throw new Error("PasteInterceptFailed");
        } catch (error) {
            window.postMessage({ type: 'GEMINI_UPLOAD_ERROR', error: error.message }, '*');
        }
    }
});