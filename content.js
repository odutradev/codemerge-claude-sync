// Content Script - CodeMerge Claude Sync (COM CORS BYPASS)

class CodeMergeClaudeSync {
    constructor() {
        this.config = {
            serverUrl: 'http://localhost:9876',
            projectName: '',
            updateInterval: 5000,
            autoUpdate: false
        };
        
        this.isRunning = false;
        this.updateIntervalId = null;
        this.lastContent = null;
        this.lastHash = null;
        this.serverStatus = 'disconnected';
        this.availableProjectFiles = [];
        
        this.init();
    }
    
    async init() {
        await this.loadConfig();
        this.createUI();
        this.setupFileListObserver();
        this.discoverProjectFiles();
        console.log('🚀 CodeMerge Claude Sync iniciado (CORS bypass enabled)');
    }
    
    async loadConfig() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response && response.config) {
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
            }, (response) => {
                resolve(response);
            });
        });
    }
    
    // Helper: fazer fetch via background worker (sem CORS)
    async fetchViaBackground(url, options = {}) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: 'FETCH_URL',
                url: url,
                options: options
            }, (response) => {
                resolve(response);
            });
        });
    }
    
    createUI() {
        const container = document.createElement('div');
        container.id = 'codemerge-sync-widget';
        container.innerHTML = `
            <div class="cms-header">
                <h3>📄 CodeMerge Sync</h3>
                <button id="cms-toggle">−</button>
            </div>
            
            <div id="cms-content">
                <!-- Configuração do Servidor -->
                <div class="cms-section">
                    <label class="cms-label">🌐 Servidor CodeMerge:</label>
                    <input 
                        id="cms-server-url" 
                        type="text" 
                        value="${this.config.serverUrl}"
                        placeholder="http://localhost:9876"
                        class="cms-input"
                    />
                    <button id="cms-test-connection" class="cms-button cms-button-secondary">
                        🔌 Testar Conexão
                    </button>
                    <div id="cms-server-status" class="cms-status-badge">⚪ Desconectado</div>
                </div>
                
                <!-- Nome do Projeto -->
                <div class="cms-section">
                    <label class="cms-label">📦 Nome do Projeto:</label>
                    <input 
                        id="cms-project-name" 
                        type="text" 
                        value="${this.config.projectName}"
                        placeholder="Digite o nome do projeto"
                        class="cms-input"
                    />
                    <div class="cms-hint">Nome retornado pelo endpoint /health</div>
                </div>
                
                <!-- Intervalo de Atualização -->
                <div class="cms-section">
                    <label class="cms-label">⏱️ Intervalo (segundos):</label>
                    <input 
                        id="cms-interval" 
                        type="number" 
                        min="2" 
                        max="300" 
                        value="${this.config.updateInterval / 1000}"
                        class="cms-input"
                    />
                </div>
                
                <!-- Status do Projeto Claude -->
                <div class="cms-section">
                    <label class="cms-label">🎯 Status do Projeto:</label>
                    <div id="cms-project-status" class="cms-info-box">
                        <div id="cms-project-file-count">Descobrindo arquivos...</div>
                        <div id="cms-project-file-match"></div>
                    </div>
                </div>
                
                <!-- Controles -->
                <div class="cms-controls">
                    <button id="cms-sync-now" class="cms-button cms-button-primary" disabled>
                        🚀 Sincronizar Agora
                    </button>
                    <button id="cms-toggle-auto" class="cms-button cms-button-toggle">
                        ⏰ Auto: OFF
                    </button>
                </div>
                
                <!-- Status Geral -->
                <div id="cms-status" class="cms-status">
                    Configure o servidor e nome do projeto para começar
                </div>
                
                <!-- Info -->
                <div class="cms-info">
                    <strong>Funcionamento:</strong> A extensão busca código do CodeMerge 
                    via HTTP e faz UPSERT automático no Claude Project.
                    <br><small>🔓 CORS bypass via background worker</small>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Toggle widget
        document.getElementById('cms-toggle').onclick = () => {
            const content = document.getElementById('cms-content');
            const button = document.getElementById('cms-toggle');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                button.textContent = '−';
            } else {
                content.style.display = 'none';
                button.textContent = '+';
            }
        };
        
        // Server URL
        document.getElementById('cms-server-url').onchange = (e) => {
            this.config.serverUrl = e.target.value.trim();
            this.saveConfig();
        };
        
        // Project Name
        document.getElementById('cms-project-name').onchange = (e) => {
            this.config.projectName = e.target.value.trim();
            this.saveConfig();
            this.updateProjectStatus();
            this.checkCanSync();
        };
        
        // Interval
        document.getElementById('cms-interval').onchange = (e) => {
            this.config.updateInterval = parseInt(e.target.value) * 1000;
            this.saveConfig();
            if (this.isRunning) {
                this.stopAutoUpdate();
                this.startAutoUpdate();
            }
        };
        
        // Test Connection
        document.getElementById('cms-test-connection').onclick = () => {
            this.testConnection();
        };
        
        // Sync Now
        document.getElementById('cms-sync-now').onclick = () => {
            this.syncNow();
        };
        
        // Toggle Auto
        document.getElementById('cms-toggle-auto').onclick = () => {
            this.toggleAutoUpdate();
        };
    }
    
    async testConnection() {
        this.updateStatus('Testando conexão...', 'loading');
        
        try {
            // Usar background worker para evitar CORS
            const healthResponse = await this.fetchViaBackground(
                `${this.config.serverUrl}/health`,
                { method: 'GET' }
            );
            
            if (!healthResponse.success) {
                throw new Error(healthResponse.error || 'Erro desconhecido');
            }
            
            const data = JSON.parse(healthResponse.data);
            this.serverStatus = 'connected';
            
            // Atualizar nome do projeto se não estiver definido
            if (!this.config.projectName && data.project) {
                this.config.projectName = data.project;
                document.getElementById('cms-project-name').value = data.project;
                await this.saveConfig();
            }
            
            this.updateServerStatus('connected', data);
            this.updateStatus(`✅ Conectado! Projeto: ${data.project}`, 'success');
            this.checkCanSync();
            
        } catch (error) {
            this.serverStatus = 'error';
            this.updateServerStatus('error');
            this.updateStatus(`❌ Erro: ${error.message}`, 'error');
        }
    }
    
    updateServerStatus(status, data = null) {
        const badge = document.getElementById('cms-server-status');
        
        if (status === 'connected') {
            badge.textContent = `🟢 Conectado`;
            badge.style.background = '#28a74520';
            badge.style.borderLeft = '3px solid #28a745';
            
            if (data) {
                badge.title = `Projeto: ${data.project}\nEndpoint: ${data.endpoint}\nMerge Ready: ${data.mergeReady}`;
            }
        } else if (status === 'error') {
            badge.textContent = `🔴 Erro`;
            badge.style.background = '#dc354520';
            badge.style.borderLeft = '3px solid #dc3545';
        } else {
            badge.textContent = `⚪ Desconectado`;
            badge.style.background = '#6c757d20';
            badge.style.borderLeft = '3px solid #6c757d';
        }
    }
    
    discoverProjectFiles() {
        this.availableProjectFiles = [];
        
        const fileThumbnails = document.querySelectorAll('[data-testid="file-thumbnail"]');
        
        fileThumbnails.forEach((thumbnail) => {
            const nameElement = thumbnail.querySelector('h3');
            const linesElement = thumbnail.querySelector('p');
            const deleteButton = thumbnail.querySelector('button[data-state="closed"]:last-child');
            
            if (nameElement && linesElement) {
                this.availableProjectFiles.push({
                    name: nameElement.textContent.trim(),
                    lines: linesElement.textContent.trim(),
                    element: thumbnail,
                    deleteButton: deleteButton
                });
            }
        });
        
        this.updateProjectStatus();
    }
    
    updateProjectStatus() {
        const countElement = document.getElementById('cms-project-file-count');
        const matchElement = document.getElementById('cms-project-file-match');
        
        countElement.textContent = `📁 ${this.availableProjectFiles.length} arquivo(s) no projeto`;
        
        if (this.config.projectName) {
            const fileName = `${this.config.projectName}-merged.txt`;
            const existingFile = this.availableProjectFiles.find(f => f.name === fileName);
            
            if (existingFile) {
                matchElement.textContent = `📄 "${fileName}" será SUBSTITUÍDO (${existingFile.lines})`;
                matchElement.style.color = '#ffc107';
            } else {
                matchElement.textContent = `➕ "${fileName}" será ADICIONADO como novo arquivo`;
                matchElement.style.color = '#28a745';
            }
        } else {
            matchElement.textContent = 'Configure o nome do projeto';
            matchElement.style.color = '#6c757d';
        }
    }
    
    checkCanSync() {
        const canSync = this.config.serverUrl && this.config.projectName;
        document.getElementById('cms-sync-now').disabled = !canSync;
        document.getElementById('cms-toggle-auto').disabled = !canSync;
    }
    
    async syncNow() {
        if (!this.config.serverUrl || !this.config.projectName) {
            this.updateStatus('Configure servidor e nome do projeto', 'error');
            return;
        }
        
        try {
            this.updateStatus('Buscando código do CodeMerge...', 'loading');
            
            // Usar background worker para evitar CORS
            const fetchResponse = await this.fetchViaBackground(
                `${this.config.serverUrl}/${this.config.projectName}`,
                { method: 'GET' }
            );
            
            if (!fetchResponse.success) {
                if (fetchResponse.status === 503) {
                    throw new Error('Merge ainda não está pronto no servidor');
                }
                throw new Error(fetchResponse.error || 'Erro na requisição');
            }
            
            const content = fetchResponse.data;
            const contentHash = this.hashCode(content);
            
            // Verificar se conteúdo mudou
            if (contentHash === this.lastHash) {
                this.updateStatus('✅ Conteúdo já está atualizado', 'success');
                return;
            }
            
            // Atualizar arquivos do projeto
            this.discoverProjectFiles();
            
            const fileName = `${this.config.projectName}-merged.txt`;
            const existingFile = this.availableProjectFiles.find(f => f.name === fileName);
            
            // Remover arquivo existente se necessário
            if (existingFile) {
                this.updateStatus(`Removendo "${fileName}" existente...`, 'loading');
                await this.removeFile(existingFile);
                await this.wait(1000);
            }
            
            // Adicionar novo arquivo
            this.updateStatus(`Adicionando novo "${fileName}"...`, 'loading');
            await this.addFile(fileName, content);
            
            this.lastContent = content;
            this.lastHash = contentHash;
            
            this.updateStatus(`✅ Sincronizado! ${new Date().toLocaleTimeString('pt-BR')}`, 'success');
            
            setTimeout(() => this.discoverProjectFiles(), 1500);
            
        } catch (error) {
            console.error('Erro na sincronização:', error);
            this.updateStatus(`❌ Erro: ${error.message}`, 'error');
        }
    }
    
    async removeFile(fileInfo) {
        if (!fileInfo.deleteButton) {
            throw new Error('Botão de deletar não encontrado');
        }
        
        fileInfo.deleteButton.click();
        await this.wait(500);
        
        // Procurar confirmação
        const confirmButtons = document.querySelectorAll('button');
        for (const button of confirmButtons) {
            const text = button.textContent.toLowerCase();
            if (text.includes('excluir') || text.includes('delete') || 
                text.includes('remover') || text.includes('confirmar')) {
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
    
    toggleAutoUpdate() {
        if (this.isRunning) {
            this.stopAutoUpdate();
        } else {
            this.startAutoUpdate();
        }
    }
    
    startAutoUpdate() {
        this.isRunning = true;
        this.updateIntervalId = setInterval(() => {
            this.syncNow();
        }, this.config.updateInterval);
        
        const button = document.getElementById('cms-toggle-auto');
        button.textContent = '⏰ Auto: ON';
        button.classList.add('active');
        
        this.updateStatus(`Auto-sync ativado (${this.config.updateInterval / 1000}s)`, 'success');
        
        // Primeira sincronização imediata
        this.syncNow();
    }
    
    stopAutoUpdate() {
        this.isRunning = false;
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
        
        const button = document.getElementById('cms-toggle-auto');
        button.textContent = '⏰ Auto: OFF';
        button.classList.remove('active');
        
        this.updateStatus('Auto-sync desativado', 'info');
    }
    
    setupFileListObserver() {
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                this.discoverProjectFiles();
            }, 800);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    updateStatus(message, type = 'info') {
        const status = document.getElementById('cms-status');
        status.textContent = message;
        status.className = `cms-status cms-status-${type}`;
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

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CodeMergeClaudeSync();
    });
} else {
    new CodeMergeClaudeSync();
}