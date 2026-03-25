window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'CLAUDE_INJECT_TEXT') {
        const editor = document.querySelector('.ProseMirror') || document.querySelector('div[contenteditable="true"]');
        if (!editor) return;
        editor.focus();
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', event.data.text);
        const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true, clipboardData: dataTransfer });
        editor.dispatchEvent(pasteEvent);
        return;
    }

    if (event.data.type === 'CLAUDE_UPLOAD_FILE') {
        const { fileName, content } = event.data;
        try {
            const file = new File([content], fileName, { type: 'text/plain', lastModified: Date.now() });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                Object.defineProperty(fileInput, 'files', { value: dataTransfer.files, writable: false, configurable: true });
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                fileInput.dispatchEvent(new Event('input', { bubbles: true }));
                window.postMessage({ type: 'CLAUDE_UPLOAD_SUCCESS' }, '*');
                return;
            }
            const editor = document.querySelector('div[contenteditable="true"]') || document.querySelector('.ProseMirror');
            if (!editor) throw new Error("EditorNotFound");
            editor.focus();
            const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true, clipboardData: new DataTransfer() });
            Object.defineProperty(pasteEvent, 'clipboardData', { value: dataTransfer, writable: false, configurable: true });
            editor.dispatchEvent(pasteEvent);
            window.postMessage({ type: 'CLAUDE_UPLOAD_SUCCESS' }, '*');
        } catch (error) {
            window.postMessage({ type: 'CLAUDE_UPLOAD_ERROR', error: error.message }, '*');
        }
    }
});