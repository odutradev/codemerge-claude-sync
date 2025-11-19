class ArtifactUpsertManager {
    constructor() {
        this.config = { serverUrl: 'http://localhost:9876' };
        this.observer = null;
        this.containerObservers = new WeakMap();
        this.heartbeat = null;
        this.debug = true;
        this.init();
    }

    log(...args) {
        if (this.debug) {
            console.log('[ArtifactUpsert]', ...args);
        }
    }

    error(...args) {
        console.error('[ArtifactUpsert ERROR]', ...args);
    }

    async init() {
        this.log('Inicializando...');
        await this.loadConfig();
        this.observeInputArea();
        this.ensureUpsertPresent();
        this.startHeartbeat();
        this.log('Inicializado com sucesso');
    }

    async loadConfig() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response?.config?.serverUrl) {
                    this.config.serverUrl = response.config.serverUrl;
                    this.log('Config carregada:', this.config);
                }
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
        button.title = 'Fazer upsert de artefatos da conversa';
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
        this.log('=== INICIANDO UPSERT ===');
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
            
            this.log('Extraindo artefatos...');
            const allFiles = await this.extractAllArtifactsFromClaude();
            this.log('Artefatos extraídos:', allFiles);
            
            if (!allFiles || allFiles.length === 0) {
                this.error('Nenhum artefato encontrado');
                throw new Error('Nenhum artefato encontrado na conversa');
            }
            
            button.disabled = false;
            button.innerHTML = originalContent;
            
            this.log('Abrindo modal de seleção...');
            const filesToUpload = await this.showFileSelectionModal(allFiles);
            this.log('Arquivos selecionados:', filesToUpload);
            
            if (!filesToUpload || filesToUpload.length === 0) {
                this.log('Usuário cancelou ou não selecionou arquivos');
                return;
            }
            
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
            
            this.log('Enviando para servidor...');
            const response = await this.sendUpsert(filesToUpload);
            this.log('Resposta do servidor:', response);
            
            if (response.success) {
                this.log('Upsert realizado com sucesso!');
                this.showSuccess(button);
                button.title = `Enviados ${filesToUpload.length} artefatos`;
                setTimeout(() => { button.disabled = false; button.innerHTML = originalContent; }, 2000);
            } else {
                this.error('Erro na resposta do servidor:', response);
                throw new Error(response.error || 'Erro ao fazer upsert');
            }
        } catch (error) {
            this.error('Erro no handleUpsert:', error);
            this.error('Stack:', error.stack);
            this.showError(button, error.message);
            setTimeout(() => { button.disabled = false; button.innerHTML = originalContent; }, 3000);
        }
    }

    showFileSelectionModal(files) {
        this.log('Criando modal de seleção');
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-50 flex items-center justify-center';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            
            const modal = document.createElement('div');
            modal.className = 'bg-bg-000 border border-border-300 rounded-2xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col';
            
            const selectedFiles = new Set(files.map((_, i) => i));
            
            modal.innerHTML = `
                <div class="flex items-center justify-between p-6 border-b border-border-300">
                    <h2 class="text-text-100 font-base-bold text-lg">Selecionar Artefatos</h2>
                    <button class="cms-modal-close inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-bg-300 text-text-300 hover:text-text-100 transition">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.14645 5.14645C5.34171 4.95118 5.65829 4.95118 5.85355 5.14645L10 9.29289L14.1464 5.14645C14.3417 4.95118 14.6583 4.95118 14.8536 5.14645C15.0488 5.34171 15.0488 5.65829 14.8536 5.85355L10.7071 10L14.8536 14.1464C15.0488 14.3417 15.0488 14.6583 14.8536 14.8536C14.6583 15.0488 14.3417 15.0488 14.1464 14.8536L10 10.7071L5.85355 14.8536C5.65829 15.0488 5.34171 15.0488 5.14645 14.8536C4.95118 14.6583 4.95118 14.3417 5.14645 14.1464L9.29289 10L5.14645 5.85355C4.95118 5.65829 4.95118 5.34171 5.14645 5.14645Z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="flex items-center gap-2 px-6 py-3 border-b border-border-300">
                    <button class="cms-select-all inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 text-xs font-base transition">
                        Selecionar Todos
                    </button>
                    <button class="cms-deselect-all inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 text-xs font-base transition">
                        Desselecionar Todos
                    </button>
                    <span class="cms-selected-count ml-auto text-text-300 text-xs">
                        ${files.length} de ${files.length} selecionados
                    </span>
                </div>
                
                <div class="cms-file-list flex-1 overflow-y-auto px-6 py-4">
                    ${files.map((file, index) => `
                        <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-200 cursor-pointer transition">
                            <input type="checkbox" checked class="cms-file-checkbox w-4 h-4 rounded border-2 border-border-300 cursor-pointer" data-index="${index}">
                            <span class="text-text-100 text-sm font-base flex-1 truncate" title="${file.path}">${file.path}</span>
                            <span class="text-text-500 text-xs">${this.formatFileSize(file.content.length)}</span>
                        </label>
                    `).join('')}
                </div>
                
                <div class="flex items-center justify-end gap-3 p-6 border-t border-border-300">
                    <button class="cms-modal-cancel inline-flex items-center justify-center px-4 py-2 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 font-base transition">
                        Cancelar
                    </button>
                    <button class="cms-modal-confirm inline-flex items-center justify-center px-4 py-2 rounded-lg bg-accent-secondary-100 hover:bg-accent-secondary-200 text-text-100 font-base-bold transition">
                        Confirmar (${files.length})
                    </button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            const updateCount = () => {
                const count = selectedFiles.size;
                const countSpan = modal.querySelector('.cms-selected-count');
                const confirmBtn = modal.querySelector('.cms-modal-confirm');
                if (countSpan) countSpan.textContent = `${count} de ${files.length} selecionados`;
                if (confirmBtn) confirmBtn.textContent = `Confirmar (${count})`;
            };
            
            const checkboxes = modal.querySelectorAll('.cms-file-checkbox');
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const index = parseInt(cb.dataset.index);
                    if (cb.checked) {
                        selectedFiles.add(index);
                    } else {
                        selectedFiles.delete(index);
                    }
                    updateCount();
                });
            });
            
            modal.querySelector('.cms-select-all')?.addEventListener('click', () => {
                checkboxes.forEach(cb => {
                    cb.checked = true;
                    selectedFiles.add(parseInt(cb.dataset.index));
                });
                updateCount();
            });
            
            modal.querySelector('.cms-deselect-all')?.addEventListener('click', () => {
                checkboxes.forEach(cb => {
                    cb.checked = false;
                    selectedFiles.delete(parseInt(cb.dataset.index));
                });
                updateCount();
            });
            
            const close = () => {
                this.log('Modal fechado sem confirmação');
                overlay.remove();
                resolve(null);
            };
            
            modal.querySelector('.cms-modal-close')?.addEventListener('click', close);
            modal.querySelector('.cms-modal-cancel')?.addEventListener('click', close);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
            
            modal.querySelector('.cms-modal-confirm')?.addEventListener('click', () => {
                const selected = files.filter((_, i) => selectedFiles.has(i));
                this.log('Arquivos confirmados:', selected);
                overlay.remove();
                resolve(selected);
            });
        });
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }

    async extractAllArtifactsFromClaude() {
        this.log('Iniciando extração de artefatos');
        try {
            const data = await this.fetchClaudeConversation();
            if (!data) {
                this.error('fetchClaudeConversation retornou null');
                return [];
            }
            
            this.log('Dados da conversa recebidos:', data);
            
            const messages = Array.isArray(data.chat_messages) ? data.chat_messages
                            : (Array.isArray(data.messages) ? data.messages : []);
            
            this.log('Total de mensagens:', messages.length);
            
            const collected = [];
            const seenPaths = new Set();
            
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                if (!message?.content) continue;
                
                const parts = Array.isArray(message.content) ? message.content : [message.content];
                this.log(`Processando mensagem ${i}, ${parts.length} partes`);
                
                for (let j = 0; j < parts.length; j++) {
                    const part = parts[j];
                    
                    if (typeof part === 'string') {
                        this.log(`  Parte ${j}: string`);
                        this.extractFilesFromText(part, collected, seenPaths);
                    } else if (part?.text) {
                        this.log(`  Parte ${j}: objeto com text`);
                        this.extractFilesFromText(part.text, collected, seenPaths);
                    }
                    
                    if (part?.type === 'tool_result' && part?.content) {
                        this.log(`  Parte ${j}: tool_result`);
                        const toolContent = Array.isArray(part.content) ? part.content : [part.content];
                        for (const item of toolContent) {
                            if (typeof item === 'string') {
                                this.extractFilesFromToolResult(item, collected, seenPaths);
                            } else if (item?.text) {
                                this.extractFilesFromToolResult(item.text, collected, seenPaths);
                            }
                        }
                    }
                }
            }
            
            this.log('Total de arquivos coletados:', collected.length);
            this.log('Arquivos:', collected);
            
            return collected;
        } catch (error) {
            this.error('Erro em extractAllArtifactsFromClaude:', error);
            this.error('Stack:', error.stack);
            return [];
        }
    }

    extractFilesFromText(text, collected, seenPaths) {
        this.log('    Procurando links computer:// no texto');
        const computerLinkRegex = /computer:\/\/\/mnt\/user-data\/outputs\/([^\s)\]"']+)/g;
        const matches = [...text.matchAll(computerLinkRegex)];
        
        this.log(`    Encontrados ${matches.length} links`);
        
        for (const match of matches) {
            const filename = match[1];
            if (seenPaths.has(filename)) {
                this.log(`    Arquivo já visto: ${filename}`);
                continue;
            }
            this.log(`    Novo arquivo encontrado: ${filename}`);
            seenPaths.add(filename);
            
            collected.push({
                path: filename,
                content: '',
                needsFetch: true
            });
        }
    }

    extractFilesFromToolResult(text, collected, seenPaths) {
        this.log('    Extraindo de tool_result');
        const lines = text.split('\n');
        let currentFile = null;
        let isCapturingContent = false;
        let content = [];
        
        for (const line of lines) {
            if (line.includes('Created file:') || line.includes('File created:')) {
                const pathMatch = line.match(/(?:Created file|File created):\s*([^\s]+)/);
                if (pathMatch) {
                    if (currentFile && content.length > 0) {
                        if (!seenPaths.has(currentFile)) {
                            this.log(`    Arquivo de tool_result: ${currentFile}`);
                            collected.push({
                                path: currentFile,
                                content: content.join('\n')
                            });
                            seenPaths.add(currentFile);
                        }
                    }
                    currentFile = pathMatch[1].replace(/^\/mnt\/user-data\/outputs\//, '');
                    content = [];
                    isCapturingContent = false;
                }
            } else if (line.includes('```') && currentFile) {
                isCapturingContent = !isCapturingContent;
            } else if (isCapturingContent && currentFile) {
                content.push(line);
            }
        }
        
        if (currentFile && content.length > 0 && !seenPaths.has(currentFile)) {
            this.log(`    Último arquivo de tool_result: ${currentFile}`);
            collected.push({
                path: currentFile,
                content: content.join('\n')
            });
            seenPaths.add(currentFile);
        }
    }

    async fetchClaudeConversation() {
        this.log('Buscando conversa do Claude...');
        try {
            const orgId = document.cookie.split('; ').find(c => c.startsWith('lastActiveOrg='))?.split('=')[1];
            const deviceId = document.cookie.split('; ').find(c => c.startsWith('anthropic-device-id='))?.split('=')[1];
            const chatId = window.location.pathname.split('/').pop();
            const anonymousId = localStorage.getItem('ajs_anonymous_id')?.replace(/^"|"$/g, '');
            
            this.log('orgId:', orgId);
            this.log('chatId:', chatId);
            this.log('deviceId:', deviceId);
            this.log('anonymousId:', anonymousId);
            
            if (!orgId || !chatId) {
                this.error('OrgId ou ChatId não encontrados');
                throw new Error('OrgId ou ChatId não encontrados');
            }
            
            const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${chatId}?tree=True&rendering_mode=messages&render_all_tools=true`;
            this.log('URL da requisição:', url);
            
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
            
            this.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                this.error(`Erro HTTP: ${response.status}`);
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            this.log('Dados recebidos com sucesso');
            return data;
        } catch (error) {
            this.error('Erro em fetchClaudeConversation:', error);
            this.error('Stack:', error.stack);
            return null;
        }
    }

    async sendUpsert(filesArray) {
        this.log('Enviando upsert para servidor:', filesArray);
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
                this.log('Resposta do chrome.runtime:', response);
                if (response?.success) {
                    try {
                        const data = JSON.parse(response.data);
                        this.log('Dados parseados:', data);
                        resolve(data);
                    } catch (error) {
                        this.error('Erro ao parsear resposta:', error);
                        resolve({ success: true });
                    }
                } else {
                    this.error('Resposta de erro:', response);
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