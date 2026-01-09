const DEFAULT_CONFIG = {
    serverUrl: 'http://localhost:9876'
};

let config = { ...DEFAULT_CONFIG };

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['config'], (result) => {
        if (result.config) {
            config = { ...config, ...result.config };
        }
    });
});

chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handlers = {
        GET_CONFIG: () => sendResponse({ config }),
        UPDATE_CONFIG: () => handleConfigUpdate(message, sendResponse),
        FETCH_URL: () => handleFetch(message, sendResponse)
    };

    const handler = handlers[message.type];
    if (handler) {
        handler();
        return true; 
    }
});

function handleConfigUpdate(message, sendResponse) {
    config = { ...config, ...message.config };
    chrome.storage.local.set({ config });
    sendResponse({ success: true });
}

function handleFetch(message, sendResponse) {
    const { url, options } = message;
    
    fetch(url, options || {})
        .then(response => processResponse(response, sendResponse))
        .catch(error => sendResponse({ 
            success: false, 
            error: error.message,
            status: 0
        }));
}

function processResponse(response, sendResponse) {
    const status = response.status;
    const contentType = response.headers.get('content-type') || '';
    
    if (!response.ok) {
        sendResponse({ 
            success: false, 
            error: `HTTP ${status}`,
            status
        });
        return;
    }
    
    const isJson = contentType.includes('application/json');
    const parser = isJson ? response.json() : response.text();
    
    parser.then(data => {
        sendResponse({ 
            success: true, 
            data: isJson ? JSON.stringify(data) : data,
            contentType: isJson ? 'json' : 'text',
            status
        });
    });
}

console.log('CodeMerge Sidebar (React) - Background worker iniciado');