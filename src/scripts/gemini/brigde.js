import geminiService from '../../services/geminiService';

console.log('[GeminiBridge] Bridge carregado');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ADD_FILE_GEMINI') {
        geminiService.uploadFile(message.fileName, message.content)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'GET_GEMINI_ARTIFACTS') {
        console.log('[GeminiBridge] Buscando artefatos');
        geminiService.getAllFiles()
            .then(artifacts => {
                console.log(`[GeminiBridge] Encontrados: ${artifacts.length}`);
                sendResponse({ success: true, artifacts });
            })
            .catch(error => {
                console.error('[GeminiBridge] Falha ao buscar:', error.message);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});