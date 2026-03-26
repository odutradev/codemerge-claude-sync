window.addEventListener('message', async (event) => {
    if (event.source !== window) return;

    const isClaude = window.location.hostname.includes('claude.ai');

    const getEditor = () => {
        if (isClaude) return document.querySelector('.ProseMirror') || document.querySelector('div[contenteditable="true"]');
        return document.querySelector('div[contenteditable="true"]') || document.querySelector('.ql-editor') || document.querySelector('rich-textarea textarea') || document.querySelector('rich-textarea');
    };

    if (event.data.type === 'AI_INJECT_TEXT') {
        const editor = getEditor();
        if (!editor) return;
        editor.focus();
        if (!isClaude) await new Promise(r => setTimeout(r, 100));
        if (!document.execCommand('insertText', false, event.data.text)) {
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/plain', event.data.text);
            const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true, clipboardData: dataTransfer });
            editor.dispatchEvent(pasteEvent);
        }
        editor.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        return;
    }

    if (event.data.type === 'AI_UPLOAD_FILE') {
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
                window.postMessage({ type: 'AI_UPLOAD_SUCCESS' }, '*');
                return;
            }

            const editor = getEditor();
            if (!editor) throw new Error("EditorNotFound");
            editor.focus();
            if (!isClaude) await new Promise(r => setTimeout(r, 100));

            const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true, clipboardData: new DataTransfer() });
            Object.defineProperty(pasteEvent, 'clipboardData', { value: dataTransfer, writable: false, configurable: true });
            editor.dispatchEvent(pasteEvent);

            if (!isClaude && !pasteEvent.defaultPrevented) throw new Error("PasteInterceptFailed");
            window.postMessage({ type: 'AI_UPLOAD_SUCCESS' }, '*');
        } catch (error) {
            window.postMessage({ type: 'AI_UPLOAD_ERROR', error: error.message }, '*');
        }
    }
});