class ArtifactUpsertManager {
    constructor() {
        this.config = { serverUrl: 'http://localhost:9876' };
        this.observer = null;
        this.containerObservers = new WeakMap();
        this.heartbeat = null;
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.observeInputArea();
        this.ensureUpsertPresent();
        this.startHeartbeat();
    }

    async loadConfig() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response?.config?.serverUrl) this.config.serverUrl = response.config.serverUrl;
                resolve();
            });
        });
    }

    observeInputArea() {
        if (this.observer) this.observer.disconnect();
        this.observer = new MutationObserver((mutations) => {
            let shouldRecheck = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes?.length || mutation.removedNodes?.length) shouldRecheck = true;
            }
            if (shouldRecheck) {
                if (this._raf) cancelAnimationFrame(this._raf);
                this._raf = requestAnimationFrame(() => this.ensureUpsertPresent());
            }
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    startHeartbeat() {
        if (this.heartbeat) clearInterval(this.heartbeat);
        this.heartbeat = setInterval(() => this.ensureUpsertPresent(), 1500);
    }

    ensureUpsertPresent(root = document) {
        if (!root?.querySelectorAll) return;
        const sendButtons = root.querySelectorAll(
            'button[aria-label="Enviar mensagem"], button[aria-label="Send Message"]'
        );
        sendButtons.forEach((sendButton) => {
            const container = sendButton?.parentElement;
            if (!container) return;
            if (container.querySelector('.cms-upsert-button')) {
                this.observeContainer(container);
                return;
            }
            this.injectUpsertButton(container, sendButton);
            this.observeContainer(container);
        });
    }

    observeContainer(container) {
        if (this.containerObservers.has(container)) return;
        const obs = new MutationObserver(() => {
            const hasUpsert = !!container.querySelector('.cms-upsert-button');
            const sendButton =
                container.querySelector('button[aria-label="Enviar mensagem"]') ||
                container.querySelector('button[aria-label="Send Message"]');
            if (sendButton && !hasUpsert) {
                this.injectUpsertButton(container, sendButton);
            }
        });
        obs.observe(container, { childList: true, subtree: false });
        this.containerObservers.set(container, obs);
    }

    injectUpsertButton(container, sendButton) {
        if (!container || !sendButton) return;
        if (container.querySelector('.cms-upsert-button')) return;
        const upsertButton = this.createUpsertButton();
        container.insertBefore(upsertButton, sendButton);
    }

    createUpsertButton() {
        const button = document.createElement('button');
        button.className = 'cms-upsert-button inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none text-text-300 border-transparent transition font-base duration-300 ease-[cubic-bezier(0.165,0.85,0.45,1)] hover:bg-bg-300 aria-checked:bg-bg-400 aria-expanded:bg-bg-400 hover:text-text-100 aria-pressed:text-text-100 aria-checked:text-text-100 aria-expanded:text-text-100 h-8 rounded-md px-3 min-w-[4rem] active:scale-[0.985] whitespace-nowrap mr-2';
        button.type = 'button';
        button.title = 'Fazer upsert de todos os artefatos da conversa';
        button.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="flex items-center justify-center" style="width: 16px; height: 16px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="shrink-0" aria-hidden="true">
                        <path d="M10 3C10.2761 3 10.5 3.22386 10.5 3.5V12.2929L13.1464 9.64645C13.3417 9.45118 13.6583 9.45118 13.8536 9.64645C14.0488 9.84171 14.0488 10.1583 13.8536 10.3536L10.3536 13.8536C10.1583 14.0488 9.84171 14.0488 9.64645 13.8536L6.14645 10.3536C5.95118 10.1583 5.95118 9.84171 6.14645 9.64645C6.34171 9.45118 6.65829 9.45118 6.85355 9.64645L9.5 12.2929V3.5C9.5 3.22386 9.72386 3 10 3Z"/>
                        <path d="M4 14.5C4.27614 14.5 4.5 14.7239 4.5 15V15.5C4.5 15.7761 4.72386 16 5 16H15C15.2761 16 15.5 15.7761 15.5 15.5V15C15.5 14.7239 15.7239 14.5 16 14.5C16.2761 14.5 16.5 14.7239 16.5 15V15.5C16.5 16.3284 15.8284 17 15 17H5C4.17157 17 3.5 16.3284 3.5 15.5V15C3.5 14.7239 3.72386 14.5 4 14.5Z"/>
                    </svg>
                </div>
                <span class="font-base-bold text-xs">Upsert</span>
            </div>
        `;
        button.addEventListener('click', () => this.handleUpsert(button));
        return button;
    }

    async handleUpsert(button) {
        const originalContent = button.innerHTML;
        try {
            button.disabled = true;
            button.innerHTML = `
                <div class="flex items-center gap-2">
                    <div class="animate-spin" style="width: 16px; height: 16px;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="shrink-0" aria-hidden="true">
                            <path d="M10 3C10.2761 3 10.5 3.22386 10.5 3.5V6.5C10.5 6.77614 10.2761 7 10 7C9.72386 7 9.5 6.77614 9.5 6.5V3.5C9.5 3.22386 9.72386 3 10 3Z"/>
                        </svg>
                    </div>
                    <span class="font-base-bold text-xs">...</span>
                </div>
            `;
            const files = await this.extractAllArtifactsFromClaude();
            if (!files || files.length === 0) throw new Error('Nenhum artefato encontrado na conversa');
            const response = await this.sendUpsert(files);
            if (response.success) {
                this.showSuccess(button);
                button.title = `Enviados ${files.length} artefatos`;
                setTimeout(() => { button.disabled = false; button.innerHTML = originalContent; }, 2000);
            } else {
                throw new Error(response.error || 'Erro ao fazer upsert');
            }
        } catch (error) {
            this.showError(button, error.message);
            setTimeout(() => { button.disabled = false; button.innerHTML = originalContent; }, 3000);
        }
    }

    async extractAllArtifactsFromClaude() {
        const data = await this.fetchClaudeConversation();
        if (!data) return [];
        const messages = Array.isArray(data.chat_messages) ? data.chat_messages
                        : (Array.isArray(data.messages) ? data.messages : []);
        const collected = [];
        const nameCount = new Map();
        const pushFile = (rawName, content) => {
            if (!content) return;
            let base = (rawName || 'artifact.txt').toString().trim() || 'artifact.txt';
            let name = base;
            const current = (nameCount.get(base) || 0) + 1;
            nameCount.set(base, current);
            if (current > 1) {
                const dot = base.lastIndexOf('.');
                name = dot > 0
                    ? `${base.slice(0, dot)} (${current}).${base.slice(dot + 1)}`
                    : `${base} (${current})`;
            }
            collected.push({ path: name, content: content.toString() });
        };
        for (let m = 0; m < messages.length; m++) {
            const parts = messages[m]?.content || [];
            for (let p = 0; p < parts.length; p++) {
                const part = parts[p];
                if (part?.type === 'tool_use' && /artifacts?/i.test(part?.name || '')) {
                    const items = this.parseArtifactsFromToolInput(part.input);
                    items.forEach(({ title, name, content, text }) => {
                        pushFile(title || name || 'artifact.txt', content || text || '');
                    });
                }
                if (part?.type && /application\/vnd\.ant\.code/i.test(part.type) && (part.content || part.text)) {
                    pushFile(part.title || 'artifact.txt', part.content || part.text || '');
                }
                if (Array.isArray(part?.items)) {
                    part.items.forEach(it => {
                        if (it?.type && /application\/vnd\.ant\.code/i.test(it.type) && (it.content || it.text)) {
                            pushFile(it.title || it.name || 'artifact.txt', it.content || it.text || '');
                        }
                    });
                }
            }
        }
        return collected;
    }

    parseArtifactsFromToolInput(input) {
        const out = [];
        const pushIf = (obj) => {
            if (!obj) return;
            const content = obj.content ?? obj.text ?? obj.body ?? '';
            const title = obj.title ?? obj.name ?? obj.filename ?? obj.path ?? 'artifact.txt';
            if (content) out.push({ title, content });
        };
        if (typeof input === 'object' && !Array.isArray(input)) {
            if (Array.isArray(input.files)) input.files.forEach(pushIf);
            if (Array.isArray(input.items)) input.items.forEach(pushIf);
            if (input.type || input.content || input.text) pushIf(input);
        }
        if (Array.isArray(input)) input.forEach(pushIf);
        return out;
    }

    async fetchClaudeConversation() {
        try {
            const orgId = document.cookie.split('; ').find(c => c.startsWith('lastActiveOrg='))?.split('=')[1];
            const deviceId = document.cookie.split('; ').find(c => c.startsWith('anthropic-device-id='))?.split('=')[1];
            const chatId = window.location.pathname.split('/').pop();
            const anonymousId = localStorage.getItem('ajs_anonymous_id')?.replace(/^"|"$/g, '');
            if (!orgId || !chatId) throw new Error('OrgId ou ChatId não encontrados');
            const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${chatId}?tree=True&rendering_mode=messages&render_all_tools=true`;
            const response = await fetch(url, {
                headers: {
                    "accept": "*/*",
                    "accept-language": navigator.language || "pt-BR,pt;q=0.9,en;q=0.8",
                    "anthropic-anonymous-id": anonymousId || "",
                    "anthropic-client-platform": "web_claude_ai",
                    "anthropic-client-sha": "unknown",
                    "anthropic-client-version": "1.0.0",
                    "anthropic-device-id": deviceId || "",
                    "content-type": "application/json",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\""
                },
                referrer: window.location.href,
                method: "GET",
                mode: "cors",
                credentials: "include"
            });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return await response.json();
        } catch {
            return null;
        }
    }

    async sendUpsert(filesArray) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: 'FETCH_URL',
                url: `${this.config.serverUrl}/upsert`,
                options: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ files: filesArray })
                }
            }, (response) => {
                if (response?.success) {
                    try {
                        const data = JSON.parse(response.data);
                        resolve(data);
                    } catch {
                        resolve({ success: true });
                    }
                } else {
                    resolve({ success: false, error: response?.error || 'Erro desconhecido' });
                }
            });
        });
    }

    showSuccess(button) {
        button.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="flex items-center justify-center" style="width: 16px; height: 16px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="shrink-0 text-green-500" aria-hidden="true">
                        <path d="M14.8536 6.14645C15.0488 6.34171 15.0488 6.65829 14.8536 6.85355L8.85355 12.8536C8.65829 13.0488 8.34171 13.0488 8.14645 12.8536L5.14645 9.85355C4.95118 9.65829 4.95118 9.34171 5.14645 9.14645C5.34171 8.95118 5.65829 8.95118 5.85355 9.14645L8.5 11.7929L14.1464 6.14645C14.3417 5.95118 14.6583 5.95118 14.8536 6.14645Z"/>
                    </svg>
                </div>
                <span class="font-base-bold text-xs text-green-500">Sucesso!</span>
            </div>
        `;
    }

    showError(button, message) {
        button.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="flex items-center justify-center" style="width: 16px; height: 16px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="shrink-0 text-red-500" aria-hidden="true">
                        <path d="M10 3C10.2761 3 10.5 3.22386 10.5 3.5V10.5C10.5 10.7761 10.2761 11 10 11C9.72386 11 9.5 10.7761 9.5 10.5V3.5C9.5 3.22386 9.72386 3 10 3Z"/>
                        <path d="M10 13.5C10.4142 13.5 10.75 13.8358 10.75 14.25C10.75 14.6642 10.4142 15 10 15C9.58579 15 9.25 14.6642 9.25 14.25C9.25 13.8358 9.58579 13.5 10 13.5Z"/>
                    </svg>
                </div>
                <span class="font-base-bold text-xs text-red-500">Erro!</span>
            </div>
        `;
        button.title = message;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { new ArtifactUpsertManager(); });
} else {
    new ArtifactUpsertManager();
}
