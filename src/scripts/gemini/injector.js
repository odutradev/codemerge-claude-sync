console.log('[GeminiInjector] Iniciado (Main)');

window.addEventListener('message', async (event) => {
    if (event.source !== window || event.data.type !== 'GEMINI_UPLOAD_FILE') {
        return;
    }

    const { fileName, content } = event.data;

    try {
        console.log(`[GeminiInjector] Processando: ${fileName} (${content.length} bytes)`);

        const file = new File([content], fileName, { 
            type: 'text/plain', 
            lastModified: Date.now() 
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        let fileInput = document.querySelector('input[type="file"]');
        
        if (fileInput) {
            console.log("[GeminiInjector] Injetando via input");
            
            Object.defineProperty(fileInput, 'files', {
                value: dataTransfer.files,
                writable: false,
                configurable: true
            });
            
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            fileInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            console.log("[GeminiInjector] Sucesso input");
            window.postMessage({ type: 'GEMINI_UPLOAD_SUCCESS' }, '*');
            return;
        }

        console.log("[GeminiInjector] Tentando paste no editor");
        
        const editor = document.querySelector('div[contenteditable="true"]') || 
                       document.querySelector('.ql-editor') ||
                       document.querySelector('rich-textarea textarea') ||
                       document.querySelector('rich-textarea');

        if (!editor) {
            throw new Error("Editor não encontrado");
        }
        
        editor.focus();
        await new Promise(r => setTimeout(r, 100));

        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            composed: true,
            clipboardData: new DataTransfer()
        });

        Object.defineProperty(pasteEvent, 'clipboardData', {
            value: dataTransfer,
            writable: false,
            configurable: true
        });

        editor.dispatchEvent(pasteEvent);

        if (pasteEvent.defaultPrevented) {
            console.log("[GeminiInjector] Paste interceptado");
            window.postMessage({ type: 'GEMINI_UPLOAD_SUCCESS' }, '*');
            return;
        }

        throw new Error("Paste não interceptado pelo editor");

    } catch (error) {
        console.error(`[GeminiInjector] Erro: ${error.message}`);
        window.postMessage({ 
            type: 'GEMINI_UPLOAD_ERROR', 
            error: error.message 
        }, '*');
    }
});