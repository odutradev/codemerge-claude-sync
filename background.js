// Background Service Worker - CORS Bypass

let config = {
    serverUrl: 'http://localhost:9876',
    projectName: '',
    updateInterval: 5000
};

// Carregar configuração ao instalar
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['config'], (result) => {
        if (result.config) {
            config = { ...config, ...result.config };
        }
    });
});

// Ouvir mensagens do content script
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
        // Fazer fetch sem restrições CORS
        const { url, options } = message;
        
        fetch(url, options || {})
            .then(response => {
                const status = response.status;
                const contentType = response.headers.get('content-type') || '';
                
                if (!response.ok) {
                    sendResponse({ 
                        success: false, 
                        error: `HTTP ${status}`,
                        status: status
                    });
                    return;
                }
                
                // Retornar JSON ou texto baseado no content-type
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
        
        return true; // Mantém canal aberto para resposta assíncrona
    }
    
    return true;
});

console.log('🚀 CodeMerge Claude Sync - Background worker iniciado');