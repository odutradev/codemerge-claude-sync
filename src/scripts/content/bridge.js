import { getAiService } from '@/services/aiFactory';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const service = getAiService();

    if (message.type === 'INJECT_TEXT') {
        service.injectText(message.text)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'ADD_FILE' || message.type === 'ADD_FILE_GEMINI') {
        service.uploadFile(message.fileName, message.content)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'GET_CLAUDE_ARTIFACTS' || message.type === 'GET_GEMINI_ARTIFACTS' || message.type === 'GET_ARTIFACTS') {
        service.getArtifacts()
            .then(artifacts => sendResponse({ success: true, artifacts }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});