// Content Script - CodeMerge Claude Sync (Integrado ao Claude UI)

class CodeMergeClaudeSync {
    constructor() {
        this.config = {
            serverUrl: 'http://localhost:9876',
            projectName: '',
            updateInterval: 5000
        };
        
        this.isRunning = false;
        this.updateIntervalId = null;
        this.lastHash = null;
        this.lastSyncTime = null;
        this.syncStatus = 'idle'; // 'idle', 'syncing', 'success', 'error'
        
        this.init();
    }
    
    async init() {
        await this.loadConfig();
        this.injectUI();
        console.log('🚀 CodeMerge Claude Sync iniciado');
    }
    
    async loadConfig() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response?.config) {
                    this.config = { ...this.config, ...response.config };
                }
                resolve();
            });
        });
    }
    
    async saveConfig() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ 
                type: 'UPDATE_CONFIG', 
                config: this.config 
            }, resolve);
        });
    }
    
    async fetchViaBackground(url, options = {}) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: 'FETCH_URL',
                url: url,
                options: options
            }, resolve);
        });
    }
    
    injectUI() {
        // Aguardar o container estar disponível
        const checkInterval = setInterval(() => {
            const instructionsContainer = document.querySelector('[class*="border-0.5"][class*="border-border-300"][class*="rounded-2xl"]');
            
            if (instructionsContainer?.parentElement) {
                clearInterval(checkInterval);
                this.createIntegratedUI(instructionsContainer.parentElement);
            }
        }, 500);
        
        // Timeout de segurança
        setTimeout(() => clearInterval(checkInterval), 10000);
    }
    
    createIntegratedUI(parentElement) {
        const container = document.createElement('div');
        container.className = 'border-0.5 border-border-300 rounded-2xl transition-all duration-300 ease-out flex flex-col mt-3';
        container.id = 'codemerge-sync-container';
        
        container.innerHTML = `
            <div class="w-full px-[1.375rem] py-4 flex flex-row items-center justify-between gap-4 mt-1">
                <div class="w-full flex flex-col gap-0.5">
                    <div class="h-6 w-full flex flex-row items-center justify-between gap-4">
                        <h3 class="text-text-300 font-base-bold">CodeMerge Sync</h3>
                        <div class="flex flex-row items-center gap-2">
                            <div id="cms-status-indicator" class="w-2 h-2 rounded-full bg-border-300 transition-colors"></div>
                        </div>
                    </div>
                    <p class="text-text-500 font-small line-clamp-2">
                        <span class="opacity-60">Sincronização automática com servidor CodeMerge</span>
                    </p>
                </div>
            </div>
            
            <div class="h-[0.5px] w-full bg-border-300"></div>
            
            <div class="w-full px-[1.375rem] py-4 flex flex-col gap-3 mb-1">
                <div class="flex flex-col gap-2">
                    <label class="text-text-300 text-[12px] font-medium">Nome do Projeto</label>
                    <input 
                        id="cms-project-name"
                        type="text" 
                        value="${this.config.projectName}"
                        placeholder="Digite o nome do projeto"
                        class="w-full px-3 py-2 bg-bg-000 border-0.5 border-border-300 rounded-lg text-text-100 text-[14px] focus:outline-none focus:border-border-200 transition-colors"
                    />
                </div>
                
                <div class="flex flex-col gap-2">
                    <label class="text-text-300 text-[12px] font-medium">Intervalo (segundos)</label>
                    <input 
                        id="cms-interval"
                        type="number" 
                        min="2" 
                        max="300" 
                        value="${this.config.updateInterval / 1000}"
                        class="w-full px-3 py-2 bg-bg-000 border-0.5 border-border-300 rounded-lg text-text-100 text-[14px] focus:outline-none focus:border-border-200 transition-colors"
                    />
                </div>
                
                <button 
                    id="cms-toggle-sync"
                    class="inline-flex items-center justify-center relative shrink-0 select-none transition duration-300 font-medium h-9 px-4 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 border-0.5 border-border-300 disabled:opacity-50 disabled:pointer-events-none"
                >
                    <span id="cms-button-text">Iniciar Sincronização</span>
                </button>
                
                <div class="flex items-center justify-between pt-2 border-t-0.5 border-border-300">
                    <div class="flex flex-col gap-0.5">
                        <span class="text-text-500 text-[11px]">Status</span>
                        <span id="cms-status-text" class="text-text-300 text-[12px] font-medium">Aguardando início</span>
                    </div>
                    <div class="flex flex-col gap-0.5 text-right">
                        <span class="text-text-500 text-[11px]">Última sync</span>
                        <span id="cms-last-sync" class="text-text-300 text-[12px] font-medium">--:--</span>
                    </div>
                </div>
            </div>
        `;
        
        parentElement.appendChild(container);
        this.attachEventListeners();
        this.updateUIState();
    }
    
    attachEventListeners() {
        const projectInput = document.getElementById('cms-project-name');
        const intervalInput = document.getElementById('cms-interval');
        const toggleButton = document.getElementById('cms-toggle-sync');
        
        projectInput?.addEventListener('change', (e) => {
            this.config.projectName = e.target.value.trim();
            this.saveConfig();
        });
        
        intervalInput?.addEventListener('change', (e) => {
            this.config.updateInterval = parseInt(e.target.value) * 1000;
            this.saveConfig();
            if (this.isRunning) {
                this.stopSync();
                this.startSync();
            }
        });
        
        toggleButton?.addEventListener('click', () => {
            if (this.isRunning) {
                this.stopSync();
            } else {
                this.startSync();
            }
        });
    }
    
    updateUIState() {
        const indicator = document.getElementById('cms-status-indicator');
        const buttonText = document.getElementById('cms-button-text');
        const statusText = document.getElementById('cms-status-text');
        const lastSync = document.getElementById('cms-last-sync');
        const toggleButton = document.getElementById('cms-toggle-sync');
        
        if (!indicator || !buttonText || !statusText) return;
        
        // Atualizar indicador de status
        if (this.syncStatus === 'success') {
            indicator.className = 'w-2 h-2 rounded-full bg-green-500 transition-colors';
        } else if (this.syncStatus === 'syncing') {
            indicator.className = 'w-2 h-2 rounded-full bg-yellow-500 transition-colors animate-pulse';
        } else if (this.syncStatus === 'error') {
            indicator.className = 'w-2 h-2 rounded-full bg-red-500 transition-colors';
        } else {
            indicator.className = 'w-2 h-2 rounded-full bg-border-300 transition-colors';
        }
        
        // Atualizar botão
        if (this.isRunning) {
            buttonText.textContent = 'Parar Sincronização';
            toggleButton.classList.remove('bg-bg-300', 'hover:bg-bg-400');
            toggleButton.classList.add('bg-accent-secondary-100', 'hover:bg-accent-secondary-200');
        } else {
            buttonText.textContent = 'Iniciar Sincronização';
            toggleButton.classList.remove('bg-accent-secondary-100', 'hover:bg-accent-secondary-200');
            toggleButton.classList.add('bg-bg-300', 'hover:bg-bg-400');
        }
        
        // Atualizar texto de status
        if (this.syncStatus === 'syncing') {
            statusText.textContent = 'Sincronizando...';
        } else if (this.syncStatus === 'success') {
            statusText.textContent = 'Sincronizado';
        } else if (this.syncStatus === 'error') {
            statusText.textContent = 'Erro na sincronização';
        } else if (this.isRunning) {
            statusText.textContent = 'Aguardando próxima sync';
        } else {
            statusText.textContent = 'Aguardando início';
        }
        
        // Atualizar última sync
        if (lastSync && this.lastSyncTime) {
            lastSync.textContent = this.lastSyncTime;
        }
    }
    
    startSync() {
        if (!this.config.projectName) {
            alert('Configure o nome do projeto antes de iniciar');
            return;
        }
        
        this.isRunning = true;
        this.syncStatus = 'idle';
        this.updateUIState();
        
        // Primeira sincronização imediata
        this.performSync();
        
        // Configurar intervalo
        this.updateIntervalId = setInterval(() => {
            this.performSync();
        }, this.config.updateInterval);
    }
    
    stopSync() {
        this.isRunning = false;
        this.syncStatus = 'idle';
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
        this.updateUIState();
    }
    
    async performSync() {
        if (!this.config.projectName) return;
        
        try {
            this.syncStatus = 'syncing';
            this.updateUIState();
            
            // Buscar conteúdo do servidor
            const response = await this.fetchViaBackground(
                `${this.config.serverUrl}/${this.config.projectName}`
            );
            
            if (!response.success) {
                throw new Error(response.error || 'Erro ao buscar conteúdo');
            }
            
            const content = response.data;
            const contentHash = this.hashCode(content);
            
            // Verificar se mudou
            if (contentHash === this.lastHash) {
                this.syncStatus = 'success';
                this.updateUIState();
                return;
            }
            
            // Atualizar arquivo no Claude
            const fileName = `${this.config.projectName}-merged.txt`;
            await this.updateClaudeFile(fileName, content);
            
            this.lastHash = contentHash;
            this.lastSyncTime = new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            this.syncStatus = 'success';
            
        } catch (error) {
            console.error('Erro na sincronização:', error);
            this.syncStatus = 'error';
        }
        
        this.updateUIState();
    }
    
    async updateClaudeFile(fileName, content) {
        // Procurar arquivo existente
        const existingFile = await this.findExistingFile(fileName);
        
        // Remover se existir
        if (existingFile) {
            await this.removeFile(existingFile);
            await this.wait(1000);
        }
        
        // Adicionar novo arquivo
        await this.addFile(fileName, content);
        await this.wait(500);
    }
    
    async findExistingFile(fileName) {
        const thumbnails = document.querySelectorAll('[data-testid="file-thumbnail"]');
        
        for (const thumbnail of thumbnails) {
            const nameElement = thumbnail.querySelector('h3');
            if (nameElement?.textContent.trim() === fileName) {
                const deleteButton = thumbnail.querySelector('button[data-state="closed"]:last-child');
                return { element: thumbnail, deleteButton };
            }
        }
        
        return null;
    }
    
    async removeFile(fileInfo) {
        if (!fileInfo.deleteButton) {
            throw new Error('Botão de deletar não encontrado');
        }
        
        fileInfo.deleteButton.click();
        await this.wait(500);
        
        // Confirmar exclusão
        const confirmButtons = document.querySelectorAll('button');
        for (const button of confirmButtons) {
            const text = button.textContent.toLowerCase();
            if (text.includes('excluir') || text.includes('delete')) {
                button.click();
                break;
            }
        }
    }
    
    async addFile(fileName, content) {
        const uploadInput = document.querySelector('input[data-testid="project-doc-upload"]');
        
        if (!uploadInput) {
            throw new Error('Input de upload não encontrado');
        }
        
        const fileBlob = new File([content], fileName, {
            type: 'text/plain',
            lastModified: Date.now()
        });
        
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(fileBlob);
        uploadInput.files = dataTransfer.files;
        
        const changeEvent = new Event('change', { bubbles: true });
        uploadInput.dispatchEvent(changeEvent);
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CodeMergeClaudeSync();
    });
} else {
    new CodeMergeClaudeSync();
}