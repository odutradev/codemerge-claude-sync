import geminiService from '../services/geminiService';

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
        this.log('Inicializando v3...');
        await this.loadConfig();
        this.observeInputArea();
        this.ensureUpsertPresent();
        this.startHeartbeat();
        this.log('Inicializado com sucesso');
    }

    async loadConfig() {
        return new Promise((resolve) => {
            try {
                chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                    if (response?.config?.serverUrl) {
                        this.config.serverUrl = response.config.serverUrl;
                        this.log('Config carregada:', this.config);
                    }
                    resolve();
                });
            } catch (e) {
                resolve();
            }
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
        
        // Seletores estendidos para suportar Gemini e Claude
        const sendButtons = root.querySelectorAll(
            'button[aria-label="Enviar mensagem"], button[aria-label="Send Message"], button[class*="send-button"], button[aria-label*="Send"]'
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
            
            // Lógica para alternar entre Gemini e Claude
            let allFiles = [];
            if (window.location.hostname.includes('gemini.google.com')) {
                allFiles = await this.extractAllArtifactsFromGemini();
            } else {
                allFiles = await this.extractAllArtifactsFromClaude();
            }

            this.log('Total extraído:', allFiles?.length || 0);
            
            if (!allFiles || allFiles.length === 0) {
                throw new Error('Nenhum artefato encontrado na conversa');
            }
            
            button.disabled = false;
            button.innerHTML = originalContent;
            
            this.log('Abrindo modal...');
            const filesToUpload = await this.showFileSelectionModal(allFiles);
            
            if (!filesToUpload || filesToUpload.length === 0) {
                this.log('Cancelado pelo usuário');
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
            
            if (response.success) {
                this.showSuccess(button);
                button.title = `Enviados ${filesToUpload.length} artefatos`;
                setTimeout(() => { button.disabled = false; button.innerHTML = originalContent; }, 2000);
            } else {
                throw new Error(response.error || 'Erro ao fazer upsert');
            }
        } catch (error) {
            this.error('Erro:', error);
            this.showError(button, error.message);
            setTimeout(() => { button.disabled = false; button.innerHTML = originalContent; }, 3000);
        }
    }

    isMarkdownFile(filePath) {
        return filePath.toLowerCase().endsWith('.md');
    }

    showFileSelectionModal(files) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-50 flex items-center justify-center';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            
            const modal = document.createElement('div');
            modal.className = 'bg-bg-000 border border-border-300 rounded-2xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col';
            // Ajuste para tema do Gemini se necessário
            if (window.location.hostname.includes('gemini.google.com')) {
                modal.style.backgroundColor = '#1e1f20';
                modal.style.color = '#e3e3e3';
            }
            
            const selectedFiles = new Set();
            const mdFiles = new Set();
            
            files.forEach((file, i) => {
                if (this.isMarkdownFile(file.path)) {
                    mdFiles.add(i);
                } else {
                    selectedFiles.add(i);
                }
            });
            
            let includeMd = false;
            
            const totalFiles = files.length;
            const mdCount = mdFiles.size;
            
            modal.innerHTML = `
                <div class="flex items-center justify-between p-6 border-b border-border-300" style="border-color: #444;">
                    <h2 class="text-text-100 font-base-bold text-lg">Selecionar Artefatos</h2>
                    <button class="cms-modal-close inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-bg-300 text-text-300 hover:text-text-100 transition">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.14645 5.14645C5.34171 4.95118 5.65829 4.95118 5.85355 5.14645L10 9.29289L14.1464 5.14645C14.3417 4.95118 14.6583 4.95118 14.8536 5.14645C15.0488 5.34171 15.0488 5.65829 14.8536 5.85355L10.7071 10L14.8536 14.1464C15.0488 14.3417 15.0488 14.6583 14.8536 14.8536C14.6583 15.0488 14.3417 15.0488 14.1464 14.8536L10 10.7071L5.85355 14.8536C5.65829 15.0488 5.34171 15.0488 5.14645 14.8536C4.95118 14.6583 4.95118 14.3417 5.14645 14.1464L9.29289 10L5.14645 5.85355C4.95118 5.65829 4.95118 5.34171 5.14645 5.14645Z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="flex flex-col gap-2 px-6 py-3 border-b border-border-300" style="border-color: #444;">
                    <div class="flex items-center gap-2">
                        <button class="cms-select-all inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 text-xs font-base transition" style="background: #333; color: white;">
                            Selecionar Todos
                        </button>
                        <button class="cms-deselect-all inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 text-xs font-base transition" style="background: #333; color: white;">
                            Desselecionar Todos
                        </button>
                        <span class="cms-selected-count ml-auto text-text-300 text-xs">
                            ${selectedFiles.size} de ${totalFiles} selecionados
                        </span>
                    </div>
                    ${mdCount > 0 ? `
                    <div class="flex items-center gap-2 pt-2 border-t border-border-400" style="border-color: #444;">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="cms-include-md" class="w-4 h-4 rounded border-2 border-border-300 cursor-pointer">
                            <span class="text-text-300 text-xs">
                                Incluir arquivos Markdown (${mdCount} arquivo${mdCount > 1 ? 's' : ''})
                            </span>
                        </label>
                    </div>
                    ` : ''}
                </div>
                
                <div class="cms-file-list flex-1 overflow-y-auto px-6 py-4">
                    ${files.map((file, index) => {
                        const isMd = this.isMarkdownFile(file.path);
                        const isChecked = !isMd;
                        return `
                        <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-200 cursor-pointer transition ${isMd ? 'cms-md-file opacity-50' : ''} hover:bg-gray-800">
                            <input type="checkbox" ${isChecked ? 'checked' : ''} class="cms-file-checkbox w-4 h-4 rounded border-2 border-border-300 cursor-pointer" data-index="${index}" data-is-md="${isMd}">
                            <span class="text-text-100 text-sm font-base flex-1 truncate" title="${file.path}">
                                ${file.path}
                                ${isMd ? '<span class="text-text-500 text-xs ml-2">(md)</span>' : ''}
                            </span>
                            <span class="text-text-500 text-xs">${this.formatFileSize(file.content.length)}</span>
                        </label>
                    `}).join('')}
                </div>
                
                <div class="flex items-center justify-end gap-3 p-6 border-t border-border-300" style="border-color: #444;">
                    <button class="cms-modal-cancel inline-flex items-center justify-center px-4 py-2 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 font-base transition" style="background: #333; color: white;">
                        Cancelar
                    </button>
                    <button class="cms-modal-confirm inline-flex items-center justify-center px-4 py-2 rounded-lg bg-accent-secondary-100 hover:bg-accent-secondary-200 text-text-100 font-base-bold transition" style="background: #da7756; color: white;">
                        Confirmar (${selectedFiles.size})
                    </button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            const updateCount = () => {
                const count = selectedFiles.size;
                const countSpan = modal.querySelector('.cms-selected-count');
                const confirmBtn = modal.querySelector('.cms-modal-confirm');
                if (countSpan) countSpan.textContent = `${count} de ${totalFiles} selecionados`;
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
            
            const includeMdCheckbox = modal.querySelector('#cms-include-md');
            if (includeMdCheckbox) {
                includeMdCheckbox.addEventListener('change', () => {
                    includeMd = includeMdCheckbox.checked;
                    const mdFileLabels = modal.querySelectorAll('.cms-md-file');
                    checkboxes.forEach(cb => {
                        if (cb.dataset.isMd === 'true') {
                            cb.checked = includeMd;
                            const index = parseInt(cb.dataset.index);
                            if (includeMd) {
                                selectedFiles.add(index);
                            } else {
                                selectedFiles.delete(index);
                            }
                        }
                    });
                    mdFileLabels.forEach(label => {
                        label.style.opacity = includeMd ? '1' : '0.5';
                    });
                    updateCount();
                });
            }
            
            modal.querySelector('.cms-select-all')?.addEventListener('click', () => {
                checkboxes.forEach(cb => {
                    if (cb.dataset.isMd === 'false' || includeMd) {
                        cb.checked = true;
                        selectedFiles.add(parseInt(cb.dataset.index));
                    }
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

    normalizeFilePath(path) {
        path = path.replace(/^\/mnt\/user-data\/outputs\//, '');
        path = path.replace(/^\/home\/claude\//, '');
        
        return path;
    }

    // Método para extração via Gemini Service
    async extractAllArtifactsFromGemini() {
        this.log('Usando Gemini Service para extração...');
        try {
            if (!geminiService) {
                throw new Error('Gemini Service não disponível');
            }
            const artifacts = await geminiService.getAllFiles();
            
            // Mapeia para o formato esperado pelo modal ({path, content})
            return artifacts.map(artifact => ({
                path: artifact.name || artifact.title || `artifact_${artifact.id}.txt`,
                content: artifact.code || ''
            }));
            
        } catch (error) {
            this.error('Erro ao extrair do Gemini:', error);
            return [];
        }
    }

    async extractAllArtifactsFromClaude() {
        this.log('=== DEBUG: INICIANDO EXTRAÇÃO CLAUDE ===');
        try {
            const conversationData = await this.fetchClaudeConversation();
            
            // ... (logs de debug removidos para brevidade, mantendo lógica original)
            
            if (!conversationData) {
                this.error('DEBUG: Dados da conversa não disponíveis');
                return [];
            }
            
            const messages = conversationData.chat_messages || conversationData.messages || [];
            const files = [];
            const seenPaths = new Set();
            
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                if (!message?.content) continue;
                
                const contentParts = Array.isArray(message.content) ? message.content : [message.content];
                
                for (let j = 0; j < contentParts.length; j++) {
                    const part = contentParts[j];
                    
                    if (part?.type === 'tool_use' && part?.name === 'create_file') {
                        let filePath = part.input?.path;
                        const fileContent = part.input?.file_text || part.input?.content;
                        
                        if (filePath && fileContent) {
                            filePath = this.normalizeFilePath(filePath);

                            if (!seenPaths.has(filePath)) {
                                files.push({ path: filePath, content: fileContent });
                                seenPaths.add(filePath);
                            }
                        }
                    }
                    
                    if (part?.type === 'tool_result') {
                        const toolContent = Array.isArray(part.content) ? part.content : [part.content];
                        
                        for (const item of toolContent) {
                            const text = typeof item === 'string' ? item : item?.text || '';
                            
                            const createdMatch = text.match(/(?:Created file|File created):\s*(.+?)(?:\n|$)/);
                            if (createdMatch) {
                                const rawPath = createdMatch[1].trim();
                                const filePath = this.normalizeFilePath(rawPath);
                                
                                if (!seenPaths.has(filePath)) {
                                    const contentMatch = text.match(/```[\w]*\n([\s\S]*?)\n```/);
                                    const fileContent = contentMatch ? contentMatch[1] : '';
                                    
                                    if (fileContent) {
                                        files.push({ path: filePath, content: fileContent });
                                        seenPaths.add(filePath);
                                    }
                                }
                            }
                        }
                    }
                    
                    const textContent = typeof part === 'string' ? part : (part?.text || '');
                    if (textContent) {
                        const linkRegex = /computer:\/\/\/mnt\/user-data\/outputs\/([^\s)\]"']+)/g;
                        const links = [...textContent.matchAll(linkRegex)];
                        
                        for (const match of links) {
                            const filePath = this.normalizeFilePath(match[1]);
                            if (!seenPaths.has(filePath)) {
                                files.push({ path: filePath, content: '', needsFetch: true });
                                seenPaths.add(filePath);
                            }
                        }
                    }
                }
            }
            
            const uniqueFilesMap = new Map();
            files.forEach(f => uniqueFilesMap.set(f.path, f));
            const uniqueFiles = Array.from(uniqueFilesMap.values());

            for (const file of uniqueFiles) {
                if (file.needsFetch) {
                    const content = await this.fetchFileContent(file.path);
                    file.content = content || '';
                    delete file.needsFetch;
                }
            }
            
            const finalFiles = uniqueFiles.filter(f => f.content.length > 0);
            return finalFiles;
            
        } catch (error) {
            this.error('DEBUG: Erro ao extrair artefatos:', error);
            return [];
        }
    }

    async fetchFileContent(filePath) {
        try {
            const orgId = document.cookie.split('; ').find(c => c.startsWith('lastActiveOrg='))?.split('=')[1];
            const chatId = window.location.pathname.split('/').pop();
            
            if (!orgId || !chatId) {
                return '';
            }
            
            const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${chatId}/outputs/${filePath}`;
            
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'accept': '*/*',
                    'anthropic-client-platform': 'web_claude_ai'
                }
            });
            
            if (!response.ok) {
                return '';
            }
            
            const content = await response.text();
            return content;
            
        } catch (error) {
            return '';
        }
    }

    async fetchClaudeConversation() {
        try {
            const orgId = document.cookie.split('; ').find(c => c.startsWith('lastActiveOrg='))?.split('=')[1];
            const deviceId = document.cookie.split('; ').find(c => c.startsWith('anthropic-device-id='))?.split('=')[1];
            const chatId = window.location.pathname.split('/').pop();
            const anonymousId = localStorage.getItem('ajs_anonymous_id')?.replace(/^"|"$/g, '');
            
            if (!orgId || !chatId) {
                return null;
            }
            
            const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${chatId}?tree=True&rendering_mode=messages&render_all_tools=true`;
            
            const response = await fetch(url, {
                headers: {
                    "accept": "*/*",
                    "anthropic-anonymous-id": anonymousId || "",
                    "anthropic-client-platform": "web_claude_ai",
                    "anthropic-device-id": deviceId || ""
                },
                method: "GET",
                mode: "cors",
                credentials: "include"
            });
            
            if (!response.ok) {
                return null;
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            return null;
        }
    }

    async sendUpsert(filesArray) {
        const payload = { files: filesArray };
        
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: 'FETCH_URL',
                url: `${this.config.serverUrl}/upsert`,
                options: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
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