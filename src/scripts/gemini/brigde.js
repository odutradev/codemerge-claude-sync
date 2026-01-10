import geminiService from '../../services/geminiService';

console.log('[GeminiHelper] Content script carregado - Unified Bridge Mode');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ADD_FILE_GEMINI') {
        geminiService.uploadFile(message.fileName, message.content)
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
