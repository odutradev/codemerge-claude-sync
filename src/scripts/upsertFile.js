class CodeMergeClaudeSync {
    constructor() {
        this.config = {
            serverUrl: 'http://localhost:9876',
            projectName: '',
            updateInterval: 5000
        };
        
        this.constants = {
            UI_CHECK_INTERVAL: 500,
            UI_CHECK_TIMEOUT: 10000,
            SYNC_DELAY: 1000,
            FILE_OPERATION_DELAY: 500,
            FILE_REMOVE_DELAY: 1000,
            INDICATOR_SIZE: 'w-2 h-2 rounded-full',
            TRANSITION: 'transition-colors'
        };
        
        this.isRunning = false;
        this.updateIntervalId = null;
        this.lastHash = null;
        this.lastSyncTime = null;
        this.syncStatus = 'idle';
        this.projectId = null;
        
        this.init();
    }
    
    async init() {
        this.projectId = this.extractProjectId();
        await this.loadConfig();
        await this.loadProjectState();
        this.injectUI();
        
        if (this.isRunning) {
            setTimeout(() => this.startSync(), this.constants.SYNC_DELAY);
        }
        
        console.log('🚀 CodeMerge Claude Sync iniciado - Projeto:', this.projectId);
    }
    
    extractProjectId() {
        const match = window.location.pathname.match(/\/project\/([a-f0-9-]+)/);
        return match ? match[1] : 'default';
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
    
    async loadProjectState() {
        return new Promise((resolve) => {
            const storageKey = `project_${this.projectId}`;
            chrome.storage.local.get([storageKey], (result) => {
                const state = result[storageKey];
                if (state) {
                    this.config.projectName = state.projectName || '';
                    this.isRunning = state.isRunning || false;
                    this.lastHash = state.lastHash || null;
                    this.lastSyncTime = state.lastSyncTime || null;
                }
                resolve();
            });
        });
    }
    
    async saveProjectState() {
        const state = {
            projectName: this.config.projectName,
            isRunning: this.isRunning,
            lastHash: this.lastHash,
            lastSyncTime: this.lastSyncTime
        };
        
        return new Promise((resolve) => {
            const storageKey = `project_${this.projectId}`;
            chrome.storage.local.set({ [storageKey]: state }, resolve);
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
        const checkInterval = setInterval(() => {
            const filesHeader = Array.from(document.querySelectorAll('h3')).find(
                h3 => h3.textContent.trim() === 'Arquivos'
            );
            
            if (filesHeader) {
                clearInterval(checkInterval);
                const mainContainer = filesHeader.closest('.border-0\\.5.border-border-300.rounded-2xl');
                if (mainContainer) {
                    this.createIntegratedUI(mainContainer, filesHeader);
                }
            }
        }, this.constants.UI_CHECK_INTERVAL);
        
        setTimeout(() => clearInterval(checkInterval), this.constants.UI_CHECK_TIMEOUT);
    }
    
    createIntegratedUI(mainContainer, filesHeader) {
        if (document.getElementById('cms-sync-section')) return;
        
        const filesSection = filesHeader.closest('.w-full.px-\\[1\\.375rem\\]');
        const dividerBeforeFiles = filesSection?.previousElementSibling;
        
        const syncSection = document.createElement('div');
        syncSection.id = 'cms-sync-section';
        syncSection.innerHTML = this.getUITemplate();
        
        if (dividerBeforeFiles) {
            mainContainer.insertBefore(syncSection, dividerBeforeFiles);
        } else {
            mainContainer.insertBefore(syncSection, filesSection);
        }
        
        this.attachEventListeners();
        this.updateUIState();
    }
    
    getUITemplate() {
        return `
            <div class="h-[0.5px] w-full bg-border-300"></div>
            
            <div class="w-full px-[1.375rem] py-4 flex flex-row items-center justify-between gap-4 mt-1">
                <div class="w-full flex flex-col gap-0.5">
                    <div class="h-6 w-full flex flex-row items-center justify-between gap-4">
                        <h3 class="text-text-300 font-base-bold">CodeMerge Sync</h3>
                        <div class="flex flex-row items-center gap-2">
                            <div id="cms-status-indicator" class="${this.constants.INDICATOR_SIZE} bg-border-300 ${this.constants.TRANSITION}"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="w-full px-[1.375rem] py-4 flex flex-col gap-3 mb-1">
                <div class="flex flex-row gap-2 items-center">
                    <input 
                        id="cms-project-name"
                        type="text" 
                        value="${this.config.projectName}"
                        placeholder="Nome do projeto"
                        class="flex-1 px-3 py-2 bg-bg-000 border-0.5 border-border-300 rounded-lg text-text-100 text-[14px] focus:outline-none focus:border-border-200 transition-colors"
                    />
                    <button 
                        id="cms-reload-sync"
                        class="inline-flex items-center justify-center relative shrink-0 select-none transition duration-300 w-10 h-10 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 border-0.5 border-border-300 disabled:opacity-50 disabled:pointer-events-none"
                        title="Recarregar sincronização"
                    >
                        ${this.getReloadIcon()}
                    </button>
                    <button 
                        id="cms-toggle-sync"
                        class="inline-flex items-center justify-center relative shrink-0 select-none transition duration-300 w-10 h-10 rounded-lg bg-bg-300 hover:bg-bg-400 text-text-100 border-0.5 border-border-300 disabled:opacity-50 disabled:pointer-events-none"
                        title="Iniciar/Parar sincronização"
                    >
                        ${this.getPlayIcon()}
                        ${this.getStopIcon()}
                    </button>
                </div>
                
                <div class="flex items-center justify-between pt-2 border-border-300">
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
    }
    
    getReloadIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>`;
    }
    
    getPlayIcon() {
        return `<svg id="cms-play-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: block;">
            <path d="M8 5v14l11-7z"/>
        </svg>`;
    }
    
    getStopIcon() {
        return `<svg id="cms-stop-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
            <path d="M6 6h12v12H6z"/>
        </svg>`;
    }
    
    attachEventListeners() {
        const projectInput = document.getElementById('cms-project-name');
        const toggleButton = document.getElementById('cms-toggle-sync');
        const reloadButton = document.getElementById('cms-reload-sync');
        
        projectInput?.addEventListener('change', (e) => this.handleProjectNameChange(e));
        projectInput?.addEventListener('blur', (e) => this.handleProjectNameChange(e));
        toggleButton?.addEventListener('click', () => this.handleToggleSync());
        reloadButton?.addEventListener('click', () => this.handleReloadSync());
    }
    
    async handleProjectNameChange(e) {
        this.config.projectName = e.target.value.trim();
        await this.saveConfig();
        await this.saveProjectState();
    }
    
    handleToggleSync() {
        if (this.isRunning) {
            this.stopSync();
        } else {
            this.startSync();
        }
    }
    
    async handleReloadSync() {
        if (!this.config.projectName) {
            alert('Configure o nome do projeto antes de recarregar');
            return;
        }
        
        this.lastHash = null;
        await this.performSync();
    }
    
    updateUIState() {
        this.updateStatusIndicator();
        this.updateToggleButton();
        this.updateStatusText();
        this.updateLastSyncTime();
    }
    
    updateStatusIndicator() {
        const indicator = document.getElementById('cms-status-indicator');
        if (!indicator) return;
        
        const statusClasses = {
            success: `${this.constants.INDICATOR_SIZE} bg-green-500 ${this.constants.TRANSITION}`,
            syncing: `${this.constants.INDICATOR_SIZE} bg-yellow-500 ${this.constants.TRANSITION} animate-pulse`,
            error: `${this.constants.INDICATOR_SIZE} bg-red-500 ${this.constants.TRANSITION}`,
            idle: `${this.constants.INDICATOR_SIZE} bg-border-300 ${this.constants.TRANSITION}`
        };
        
        indicator.className = statusClasses[this.syncStatus] || statusClasses.idle;
    }
    
    updateToggleButton() {
        const playIcon = document.getElementById('cms-play-icon');
        const stopIcon = document.getElementById('cms-stop-icon');
        const toggleButton = document.getElementById('cms-toggle-sync');
        
        if (!playIcon || !stopIcon || !toggleButton) return;
        
        if (this.isRunning) {
            playIcon.style.display = 'none';
            stopIcon.style.display = 'block';
            toggleButton.classList.remove('bg-bg-300', 'hover:bg-bg-400');
            toggleButton.classList.add('bg-accent-secondary-100', 'hover:bg-accent-secondary-200');
            toggleButton.title = 'Parar sincronização';
        } else {
            playIcon.style.display = 'block';
            stopIcon.style.display = 'none';
            toggleButton.classList.remove('bg-accent-secondary-100', 'hover:bg-accent-secondary-200');
            toggleButton.classList.add('bg-bg-300', 'hover:bg-bg-400');
            toggleButton.title = 'Iniciar sincronização';
        }
    }
    
    updateStatusText() {
        const statusText = document.getElementById('cms-status-text');
        if (!statusText) return;
        
        const statusMessages = {
            syncing: 'Sincronizando...',
            success: 'Sincronizado',
            error: 'Erro na sincronização',
            idle: this.isRunning ? 'Aguardando próxima sync' : 'Aguardando início'
        };
        
        statusText.textContent = statusMessages[this.syncStatus] || statusMessages.idle;
    }
    
    updateLastSyncTime() {
        const lastSync = document.getElementById('cms-last-sync');
        if (lastSync && this.lastSyncTime) {
            lastSync.textContent = this.lastSyncTime;
        }
    }
    
    async startSync() {
        if (!this.config.projectName) {
            alert('Configure o nome do projeto antes de iniciar');
            return;
        }
        
        this.isRunning = true;
        this.syncStatus = 'idle';
        await this.saveProjectState();
        this.updateUIState();
        
        this.performSync();
        
        this.updateIntervalId = setInterval(() => {
            this.performSync();
        }, this.config.updateInterval);
    }
    
    async stopSync() {
        this.isRunning = false;
        this.syncStatus = 'idle';
        
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
        
        await this.saveProjectState();
        this.updateUIState();
    }
    
    async performSync() {
        if (!this.config.projectName) return;
        
        try {
            this.syncStatus = 'syncing';
            this.updateUIState();
            
            const response = await this.fetchViaBackground(
                `${this.config.serverUrl}/${this.config.projectName}`
            );
            
            if (!response.success) {
                throw new Error(response.error || 'Erro ao buscar conteúdo');
            }
            
            const content = response.data;
            const contentHash = this.hashCode(content);
            
            if (contentHash === this.lastHash) {
                this.syncStatus = 'success';
                this.updateUIState();
                return;
            }
            
            const fileName = `${this.config.projectName}-merged.txt`;
            await this.updateClaudeFile(fileName, content);
            
            this.lastHash = contentHash;
            this.lastSyncTime = new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            this.syncStatus = 'success';
            
            await this.saveProjectState();
            
        } catch (error) {
            console.error('Erro na sincronização:', error);
            this.syncStatus = 'error';
        }
        
        this.updateUIState();
    }
    
    async updateClaudeFile(fileName, content) {
        const existingFile = await this.findExistingFile(fileName);
        
        if (existingFile) {
            await this.removeFile(existingFile);
            await this.wait(this.constants.FILE_REMOVE_DELAY);
        }
        
        await this.addFile(fileName, content);
        await this.wait(this.constants.FILE_OPERATION_DELAY);
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
        await this.wait(this.constants.FILE_OPERATION_DELAY);
        
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CodeMergeClaudeSync();
    });
} else {
    new CodeMergeClaudeSync();
}