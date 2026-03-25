import geminiService from '../../services/geminiService';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INJECT_TEXT') {
        window.postMessage({ type: 'GEMINI_INJECT_TEXT', text: message.text }, '*');
        sendResponse({ success: true });
        return true;
    }

    if (message.type === 'ADD_FILE_GEMINI') {
        geminiService.uploadFile(message.fileName, message.content)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'GET_GEMINI_ARTIFACTS') {
        geminiService.getAllFiles()
            .then(artifacts => sendResponse({ success: true, artifacts }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});