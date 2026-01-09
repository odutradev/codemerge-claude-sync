import geminiService from '../services/geminiService';

console.log('[GeminiHelper] Content script carregado - PostMessage Mode');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ADD_FILE_GEMINI') {
        handleAddFileGemini(message.fileName, message.content)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'GET_GEMINI_ARTIFACTS') {
        console.log('[GeminiHelper] Solicitando arquivos ao GeminiService...');
        geminiService.getAllFiles()
            .then(artifacts => {
                console.log(`[GeminiHelper] ${artifacts.length} artefatos encontrados.`);
                sendResponse({ success: true, artifacts });
            })
            .catch(error => {
                console.error('[GeminiHelper] Erro ao buscar artefatos:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

async function handleAddFileGemini(fileName, content) {
    console.log(`[GeminiHelper] 🚀 Enviando para injector: ${fileName} (${content.length} bytes)`);
    return new Promise((resolve, reject) => {
        const messageListener = (event) => {
            if (event.source !== window) return;
            
            if (event.data.type === 'GEMINI_UPLOAD_SUCCESS') {
                cleanup();
                console.log('[GeminiHelper] ✅ Upload confirmado!');
                resolve();
            } else if (event.data.type === 'GEMINI_UPLOAD_ERROR') {
                cleanup();
                console.error('[GeminiHelper] ❌ Erro:', event.data.error);
                reject(new Error(event.data.error));
            }
        };

        const cleanup = () => {
            window.removeEventListener('message', messageListener);
            clearTimeout(timeoutId);
        };

        const timeoutId = setTimeout(() => {
            cleanup();
            console.error('[GeminiHelper] ⏱️ Timeout');
            reject(new Error('Timeout ao aguardar resposta'));
        }, 5000);

        window.addEventListener('message', messageListener);
        
        window.postMessage({
            type: 'GEMINI_UPLOAD_FILE',
            fileName,
            content
        }, '*');
        
        console.log('[GeminiHelper] 📤 Mensagem enviada para injector');
    });
}