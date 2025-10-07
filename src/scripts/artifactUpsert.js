class ArtifactUpsertManager {
    constructor() {
        this.config = {
            serverUrl: 'http://localhost:9876'
        };
        
        this.observer = null;
        this.init();
    }
    
    async init() {
        await this.loadConfig();
        this.observeInputArea();
        console.log('🚀 Artifact Upsert Manager iniciado');
    }
    
    async loadConfig() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response?.config?.serverUrl) {
                    this.config.serverUrl = response.config.serverUrl;
                }
                console.log('⚙️ Config carregada:', this.config.serverUrl);
                resolve();
            });
        });
    }
    
    observeInputArea() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        this.checkForInputArea(node);
                    }
                });
            });
        });
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        this.checkForInputArea(document.body);
        console.log('👁️ Observer ativo - aguardando área de input');
    }
    
    checkForInputArea(node) {
        if (!node.querySelector) return;
        
        const sendButton = node.querySelector('button[aria-label="Enviar mensagem"]') || 
                          node.querySelector('button[aria-label="Send Message"]');
        
        if (!sendButton) return;
        
        console.log('✨ Botão de enviar detectado');
        
        const buttonContainer = sendButton.parentElement;
        if (!buttonContainer) {
            console.log('⚠️ Container do botão não encontrado');
            return;
        }
        
        console.log('📦 Container encontrado');
        this.injectUpsertButton(buttonContainer, sendButton);
    }
    
    injectUpsertButton(container, sendButton) {
        if (container.querySelector('.cms-upsert-button')) {
            console.log('⏭️ Botão já existe');
            return;
        }
        
        const upsertButton = this.createUpsertButton();
        container.insertBefore(upsertButton, sendButton);
        console.log('✅ Botão Upsert injetado ao lado do enviar');
    }
    
    createUpsertButton() {
        const button = document.createElement('button');
        button.className = 'cms-upsert-button inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none text-text-300 border-transparent transition font-base duration-300 ease-[cubic-bezier(0.165,0.85,0.45,1)] hover:bg-bg-300 aria-checked:bg-bg-400 aria-expanded:bg-bg-400 hover:text-text-100 aria-pressed:text-text-100 aria-checked:text-text-100 aria-expanded:text-text-100 h-8 rounded-md px-3 min-w-[4rem] active:scale-[0.985] whitespace-nowrap mr-2';
        button.type = 'button';
        button.title = 'Fazer upsert do último artefato';
        
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
            
            console.log('📤 Iniciando upsert...');
            
            const artifactData = await this.extractLastArtifact();
            if (!artifactData) {
                throw new Error('Nenhum artefato encontrado na conversa');
            }
            
            console.log('📝 Dados extraídos:', { path: artifactData.path, size: artifactData.content.length });
            
            const response = await this.sendUpsert(artifactData);
            
            if (response.success) {
                console.log('✅ Upsert bem-sucedido:', response);
                this.showSuccess(button);
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = originalContent;
                }, 2000);
            } else {
                throw new Error(response.error || 'Erro ao fazer upsert');
            }
            
        } catch (error) {
            console.error('❌ Erro no upsert:', error);
            this.showError(button, error.message);
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalContent;
            }, 3000);
        }
    }
    
    async extractLastArtifact() {
        const artifacts = document.querySelectorAll('[data-testid="artifact-version-trigger"]');
        if (artifacts.length === 0) {
            console.log('⚠️ Nenhum artefato encontrado');
            return null;
        }
        
        const lastArtifact = artifacts[artifacts.length - 1];
        console.log('🔍 Último artefato encontrado');
        
        const headerContainer = lastArtifact.closest('.pr-2');
        if (!headerContainer) {
            console.log('⚠️ Header do artefato não encontrado');
            return null;
        }
        
        const artifactContainer = headerContainer.parentElement;
        if (!artifactContainer) {
            console.log('⚠️ Container do artefato não encontrado');
            return null;
        }
        
        const titleContainer = artifactContainer.previousElementSibling;
        const titleElement = titleContainer?.querySelector('span.font-base-bold');
        const fileName = titleElement?.textContent.trim() || 'artifact.txt';
        
        const codeElement = artifactContainer.querySelector('code');
        const content = codeElement?.textContent || '';
        
        console.log('📄 Arquivo:', fileName);
        
        return {
            path: fileName,
            content: content
        };
    }
    
    async sendUpsert(artifactData) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: 'FETCH_URL',
                url: `${this.config.serverUrl}/upsert`,
                options: {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        files: [artifactData]
                    })
                }
            }, (response) => {
                if (response.success) {
                    try {
                        const data = JSON.parse(response.data);
                        resolve(data);
                    } catch {
                        resolve({ success: true });
                    }
                } else {
                    resolve({ 
                        success: false, 
                        error: response.error || 'Erro desconhecido' 
                    });
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
    document.addEventListener('DOMContentLoaded', () => {
        new ArtifactUpsertManager();
    });
} else {
    new ArtifactUpsertManager();
}