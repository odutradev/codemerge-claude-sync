console.log('[GeminiArtifactsHelper] Script carregado');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[GeminiArtifactsHelper] Mensagem recebida:', message.type);

    if (message.type === 'GET_GEMINI_ARTIFACTS') {
        console.log('[GeminiArtifactsHelper] 🔍 Buscando artefatos...');
        
        if (typeof geminiService === 'undefined') {
            console.error('[GeminiArtifactsHelper] ❌ geminiService não está carregado');
            sendResponse({ success: false, error: 'geminiService não está disponível' });
            return true;
        }
        
        geminiService.getAllFiles()
            .then(artifacts => {
                console.log('[GeminiArtifactsHelper] ✅ Artefatos encontrados:', artifacts.length);
                sendResponse({ success: true, artifacts });
            })
            .catch(error => {
                console.error('[GeminiArtifactsHelper] ❌ Erro:', error);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});

console.log('[GeminiArtifactsHelper] ✅ Pronto para receber mensagens');