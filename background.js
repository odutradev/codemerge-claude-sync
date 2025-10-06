// Background Service Worker - COM SUPORTE A FETCH SEM CORS
let config = {
    serverUrl: 'http://localhost:9876',
    projectName: '',
    updateInterval: 5000,
    autoUpdate: false
};

// Carregar configuração
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['config'], (result) => {
        if (result.config) {
            config = { ...config, ...result.config };
        }
    });
});

// Mensagens do content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_CONFIG') {
        sendResponse({ config });
    } 
    else if (message.type === 'UPDATE_CONFIG') {
        config = { ...config, ...message.config };
        chrome.storage.local.set({ config });
        sendResponse({ success: true });
    } 
    else if (message.type === 'FETCH_URL') {
        // Nova funcionalidade: fazer fetch sem restrições CORS
        const { url, options } = message;
        
        fetch(url, options || {})
            .then(response => {
                const status = response.status;
                const statusText = response.statusText;
                
                // Verificar content-type para decidir como processar
                const contentType = response.headers.get('content-type') || '';
                
                if (!response.ok) {
                    sendResponse({ 
                        success: false, 
                        error: `HTTP ${status}`,
                        status: status
                    });
                    return;
                }
                
                // Se for JSON, retornar como JSON
                if (contentType.includes('application/json')) {
                    return response.json().then(data => {
                        sendResponse({ 
                            success: true, 
                            data: JSON.stringify(data),
                            contentType: 'json',
                            status: status
                        });
                    });
                }
                
                // Caso contrário, retornar como texto
                return response.text().then(data => {
                    sendResponse({ 
                        success: true, 
                        data: data,
                        contentType: 'text',
                        status: status
                    });
                });
            })
            .catch(error => {
                sendResponse({ 
                    success: false, 
                    error: error.message,
                    status: 0
                });
            });
        
        return true; // Mantém o canal aberto para resposta assíncrona
    }
    
    return true;
});

console.log('CodeMerge Claude Sync - Background worker iniciado (CORS bypass enabled)');