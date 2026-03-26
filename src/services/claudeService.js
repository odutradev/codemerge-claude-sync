const getCookieValue = (name) => document.cookie.split('; ').find(c => c.startsWith(`${name}=`))?.split('=')[1];

const getOrgId = () => getCookieValue('lastActiveOrg');

const getChatId = () => window.location.pathname.split('/').pop();

const fetchFile = async (path) => '';

const fetchConversation = async () => {
    const orgId = getOrgId();
    const chatId = getChatId();
    if (!orgId || !chatId) return null;
    const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${chatId}?tree=True&rendering_mode=messages&render_all_tools=true`;
    const response = await fetch(url, { headers: { "accept": "text/html", 'anthropic-client-platform': 'web_claude_ai' } });
    if (!response.ok) return '';
    return response.text();
};

const cleanPath = (rawPath) => rawPath.replace(/^\/mnt\/user-data\/outputs\//, '');

const extractFromToolUse = (part) => {
    const path = part?.input?.path;
    const content = part?.input?.file_text ?? part?.input?.content;
    return path && content ? [{ path: cleanPath(path), content, needsFetch: false }] : [];
};

const extractFromToolResult = (part) => {
    const toolContent = Array.isArray(part?.content) ? part.content : [part?.content];
    return toolContent.reduce((acc, item) => {
        const text = typeof item === 'string' ? item : item?.text ?? '';
        const createdMatch = text.match(/(?:Created file|File created):\s*(.+?)(?:\n|$)/);
        const contentMatch = text.match(/```[\w]*\n([\s\S]*?)\n```/);
        return createdMatch && contentMatch ? [...acc, { path: cleanPath(createdMatch[1].trim()), content: contentMatch[1], needsFetch: false }] : acc;
    }, []);
};

const extractFromText = (part) => {
    const textContent = typeof part === 'string' ? part : part?.text ?? '';
    const links = [...textContent.matchAll(/computer:\/\/\/mnt\/user-data\/outputs\/([^\s)\]"']+)/g)];
    return links.map(match => ({ path: cleanPath(match[1]), content: '', needsFetch: true }));
};

const processPart = (part) => [ ...extractFromToolUse(part), ...extractFromToolResult(part), ...extractFromText(part) ];

const processMessage = (message) => {
    if (!message?.content) return [];
    const parts = Array.isArray(message.content) ? message.content : [message.content];
    return parts.flatMap(processPart);
};

export const claudeService = {
    injectText: async (text) => window.postMessage({ type: 'AI_INJECT_TEXT', text }, '*'),
    uploadFile: async (fileName, content) => new Promise((resolve, reject) => {
        const messageListener = (event) => {
            if (event.source !== window) return;
            if (event.data.type === 'AI_UPLOAD_SUCCESS') {
                cleanup();
                resolve();
            } else if (event.data.type === 'AI_UPLOAD_ERROR') {
                cleanup();
                reject(new Error(event.data.error));
            }
        };
        const cleanup = () => {
            window.removeEventListener('message', messageListener);
            clearTimeout(timeoutId);
        };
        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('Timeout'));
        }, 8000);
        window.addEventListener('message', messageListener);
        window.postMessage({ type: 'AI_UPLOAD_FILE', fileName, content }, '*');
    }),
    getArtifacts: async () => {
        const conversationData = await fetchConversation();
        if (!conversationData) return [];
        const parsedData = typeof conversationData === 'string' ? JSON.parse(conversationData) : conversationData;
        const messages = parsedData.chat_messages ?? parsedData.messages ?? [];
        const extractedFiles = messages.flatMap(processMessage);
        const uniqueMap = new Map(extractedFiles.map(item => [item.path, item]));
        const filesToDownload = Array.from(uniqueMap.values());
        const finalFiles = await Promise.all(
            filesToDownload.map(async (file) => {
                if (!file.needsFetch) return file;
                const content = await fetchFile(file.path);
                return { ...file, content };
            })
        );
        return finalFiles.filter(f => f.content?.length > 0).map(f => ({ name: f.path, code: f.content }));
    }
};