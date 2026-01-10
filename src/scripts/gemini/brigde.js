import geminiService from '../../services/geminiService';

console.log('[GeminiHelper] Bridge carregado');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ADD_FILE_GEMINI') {
        geminiService.uploadFile(message.fileName, message.content)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'GET_GEMINI_ARTIFACTS') {
        console.log('[GeminiHelper] Buscando artefatos');
        geminiService.getAllFiles()
            .then(artifacts => {
                console.log(`[GeminiHelper] Encontrados: ${artifacts.length}`);
                sendResponse({ success: true, artifacts });
            })
            .catch(error => {
                console.error('[GeminiHelper] Falha ao buscar:', error.message);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});