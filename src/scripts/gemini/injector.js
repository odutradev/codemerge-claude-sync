console.log('[GeminiInjector] Iniciado no contexto MAIN');

window.addEventListener('message', async (event) => {
    if (event.source !== window || event.data.type !== 'GEMINI_UPLOAD_FILE') {
        return;
    }

    const { fileName, content } = event.data;
    
    const log = (msg, type = 'info') => {
        const styles = {
            info: 'color: #00ff9d; font-weight: bold; background: #222; padding: 4px;',
            error: 'color: #ff4444; font-weight: bold; background: #222; padding: 4px;',
            success: 'color: #44ff44; font-weight: bold; background: #222; padding: 4px;'
        };
        console.log(`%c[GeminiInjector] ${msg}`, styles[type] || styles.info);
    };

    try {
        log(`🚀 Recebido: ${fileName} (${content.length} bytes)`);

        const file = new File([content], fileName, { 
            type: 'text/plain', 
            lastModified: Date.now() 
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        let fileInput = document.querySelector('input[type="file"]');
        
        if (fileInput) {
            log("📎 Input encontrado, injetando...");
            
            Object.defineProperty(fileInput, 'files', {
                value: dataTransfer.files,
                writable: false,
                configurable: true
            });
            
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            fileInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            log("✅ Sucesso via input!", 'success');
            window.postMessage({ type: 'GEMINI_UPLOAD_SUCCESS' }, '*');
            return;
        }

        log("🎯 Tentando paste no editor...");
        
        const editor = document.querySelector('div[contenteditable="true"]') || 
                       document.querySelector('.ql-editor') ||
                       document.querySelector('rich-textarea textarea') ||
                       document.querySelector('rich-textarea');

        if (!editor) {
            throw new Error("Editor não encontrado");
        }

        log(`📝 Editor: ${editor.tagName}`);
        
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

        log("📋 Disparando paste...");
        const dispatched = editor.dispatchEvent(pasteEvent);

        if (pasteEvent.defaultPrevented) {
            log("✅ Gemini interceptou o paste!", 'success');
            window.postMessage({ type: 'GEMINI_UPLOAD_SUCCESS' }, '*');
            return;
        }

        log("🔍 Procurando botão de upload...");
        
        const uploadButton = Array.from(document.querySelectorAll('button')).find(btn => {
            const icon = btn.querySelector('mat-icon');
            return icon && (
                icon.getAttribute('fonticon') === 'add_circle' ||
                icon.getAttribute('fonticon') === 'attach_file' ||
                icon.getAttribute('fonticon') === 'add'
            );
        });

        if (uploadButton) {
            log("🎯 Clicando no botão...");
            uploadButton.click();
            
            await new Promise(r => setTimeout(r, 500));
            
            fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                Object.defineProperty(fileInput, 'files', {
                    value: dataTransfer.files,
                    writable: false,
                    configurable: true
                });
                
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                log("✅ Sucesso após clicar!", 'success');
                window.postMessage({ type: 'GEMINI_UPLOAD_SUCCESS' }, '*');
            } else {
                throw new Error("Input não criado após clicar");
            }
        } else {
            throw new Error("Botão de upload não encontrado");
        }

    } catch (error) {
        log(`❌ Erro: ${error.message}`, 'error');
        window.postMessage({ 
            type: 'GEMINI_UPLOAD_ERROR', 
            error: error.message 
        }, '*');
    }
});