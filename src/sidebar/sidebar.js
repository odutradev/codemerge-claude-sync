class CodeMergeSidebar {
    constructor() {
        this.config = {
            serverUrl: 'http://localhost:9876'
        };
        this.projectStructure = null;
        this.selectedPaths = new Set();
        this.flatFileList = [];
        this.collapsedDirs = new Set();
        
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.attachEventListeners();
        this.updateUI();
    }

    async loadConfig() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['config'], (result) => {
                if (result.config?.serverUrl) {
                    this.config.serverUrl = result.config.serverUrl;
                    const urlInput = document.getElementById('server-url');
                    if (urlInput) urlInput.value = this.config.serverUrl;
                }
                resolve();
            });
        });
    }

    async saveConfig() {
        return new Promise((resolve) => {
            chrome.storage.local.set({ config: this.config }, resolve);
        });
    }

    attachEventListeners() {
        const serverUrlInput = document.getElementById('server-url');
        if (serverUrlInput) {
            serverUrlInput.addEventListener('change', (e) => {
                this.config.serverUrl = e.target.value.trim();
                this.saveConfig();
            });
        }

        const fetchBtn = document.getElementById('fetch-structure');
        if (fetchBtn) {
            fetchBtn.addEventListener('click', () => {
                this.fetchStructure();
            });
        }

        const selectAllBtn = document.getElementById('select-all');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.selectAll();
            });
        }

        const deselectAllBtn = document.getElementById('deselect-all');
        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', () => {
                this.deselectAll();
            });
        }

        const syncSelectedBtn = document.getElementById('sync-selected');
        if (syncSelectedBtn) {
            syncSelectedBtn.addEventListener('click', () => {
                this.syncSelected();
            });
        }

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterFiles(e.target.value);
            });
        }
    }

    setStatus(status) {
        const indicator = document.getElementById('status-indicator');
        if (indicator) {
            indicator.className = `status-indicator ${status}`;
        }
    }

    showMessage(message, type = 'success') {
        const messageEl = document.getElementById('status-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `status-message ${type} show`;
            
            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 5000); // Aumentado para 5s para dar tempo de ler erros
        }
    }

    async fetchStructure() {
        try {
            this.setStatus('loading');
            
            const response = await this.fetchViaBackground(`${this.config.serverUrl}/structure`);
            
            if (!response.success) {
                throw new Error(response.error || 'Erro ao buscar estrutura');
            }

            const data = JSON.parse(response.data);
            this.projectStructure = data;
            this.flatFileList = this.flattenStructure(data.root);
            
            this.selectAll();
            
            this.renderFileTree(data.root);
            this.setStatus('success');
            this.showMessage('Estrutura carregada com sucesso');
            
        } catch (error) {
            console.error('Erro ao buscar estrutura:', error);
            this.setStatus('error');
            this.showMessage(error.message, 'error');
        }
    }

    flattenStructure(node, basePath = '') {
        const files = [];
        
        if (node.type === 'file') {
            files.push({
                path: node.path,
                name: node.name,
                lines: node.lines || 0
            });
        } else if (node.children) {
            for (const child of node.children) {
                files.push(...this.flattenStructure(child, node.path));
            }
        }
        
        return files;
    }

    renderFileTree(root) {
        const treeContainer = document.getElementById('file-tree');
        if (!treeContainer) return;
        
        treeContainer.innerHTML = '';
        
        const tree = this.createTreeNode(root);
        treeContainer.appendChild(tree);
    }

    createTreeNode(node, level = 0) {
        const item = document.createElement('div');
        item.className = 'tree-item';

        const nodeEl = document.createElement('div');
        nodeEl.className = `tree-node ${node.type}`;
        nodeEl.style.paddingLeft = `${level * 12}px`;

        if (node.type === 'directory') {
            const toggle = document.createElement('div');
            toggle.className = 'tree-toggle';
            toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
            </svg>`;
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDirectory(node, item);
            });
            nodeEl.appendChild(toggle);
        } else {
            const spacer = document.createElement('div');
            spacer.style.width = '16px';
            spacer.style.marginRight = '4px';
            nodeEl.appendChild(spacer);
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.path = node.path;
        checkbox.dataset.type = node.type;
        checkbox.checked = this.selectedPaths.has(node.path) || 
                          (node.type === 'directory' && this.isDirSelected(node));

        if (node.type === 'file') {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedPaths.add(node.path);
                } else {
                    this.selectedPaths.delete(node.path);
                }
                this.updateParentCheckboxes();
                this.updateSelectedCount();
            });
        } else {
            checkbox.addEventListener('change', (e) => {
                this.toggleDirectorySelection(node, e.target.checked);
            });
        }
        
        nodeEl.appendChild(checkbox);

        const icon = document.createElement('span');
        icon.className = 'tree-icon';
        icon.innerHTML = node.type === 'file' 
            ? this.getFileIcon(node.name)
            : this.getFolderIcon();
        nodeEl.appendChild(icon);

        const label = document.createElement('span');
        label.className = 'tree-label';
        label.textContent = node.name || 'Root';
        nodeEl.appendChild(label);

        if (node.type === 'file' && node.lines) {
            const stats = document.createElement('span');
            stats.className = 'tree-stats';
            stats.textContent = `${node.lines} linhas`;
            nodeEl.appendChild(stats);
        }

        item.appendChild(nodeEl);

        if (node.children && node.children.length > 0) {
            const children = document.createElement('div');
            children.className = 'tree-children';
            children.dataset.path = node.path;
            
            for (const child of node.children) {
                children.appendChild(this.createTreeNode(child, level + 1));
            }
            
            item.appendChild(children);
        }

        return item;
    }

    toggleDirectory(node, item) {
        const children = item.querySelector('.tree-children');
        const toggle = item.querySelector('.tree-toggle');
        
        if (!children || !toggle) return;

        const isCollapsed = children.classList.contains('collapsed');
        
        if (isCollapsed) {
            children.classList.remove('collapsed');
            toggle.classList.remove('collapsed');
            this.collapsedDirs.delete(node.path);
        } else {
            children.classList.add('collapsed');
            toggle.classList.add('collapsed');
            this.collapsedDirs.add(node.path);
        }
    }

    isDirSelected(node) {
        const files = this.flattenStructure(node);
        if (files.length === 0) return false;
        
        return files.some(file => this.selectedPaths.has(file.path));
    }

    toggleDirectorySelection(node, checked) {
        const files = this.flattenStructure(node);
        
        files.forEach(file => {
            if (checked) {
                this.selectedPaths.add(file.path);
            } else {
                this.selectedPaths.delete(file.path);
            }
        });

        const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-path]`);
        checkboxes.forEach(cb => {
            if (cb.dataset.type === 'file' && files.some(f => f.path === cb.dataset.path)) {
                cb.checked = checked;
            }
        });

        this.updateParentCheckboxes();
        this.updateSelectedCount();
    }

    updateParentCheckboxes() {
        const dirCheckboxes = document.querySelectorAll(`input[type="checkbox"][data-type="directory"]`);
        
        dirCheckboxes.forEach(cb => {
            const path = cb.dataset.path;
            const treeItem = cb.closest('.tree-item');
            const childrenContainer = treeItem?.querySelector('.tree-children');
            
            if (childrenContainer) {
                const childCheckboxes = childrenContainer.querySelectorAll(`input[type="checkbox"][data-type="file"]`);
                const checkedChildren = Array.from(childCheckboxes).filter(c => c.checked);
                
                cb.checked = checkedChildren.length > 0;
                cb.indeterminate = checkedChildren.length > 0 && checkedChildren.length < childCheckboxes.length;
            }
        });
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            js: '<svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#f7df1e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#000" font-size="14" font-weight="bold">JS</text></svg>',
            ts: '<svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#3178c6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">TS</text></svg>',
            jsx: '<svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#61dafb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#000" font-size="12" font-weight="bold">JSX</text></svg>',
            tsx: '<svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#3178c6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">TSX</text></svg>',
            json: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#ffd700"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>',
            md: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/></svg>',
            html: '<svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#e34c26"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">HTML</text></svg>',
            css: '<svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#264de4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">CSS</text></svg>',
        };
        return icons[ext] || '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>';
    }

    getFolderIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>';
    }

    selectAll() {
        this.flatFileList.forEach(file => {
            this.selectedPaths.add(file.path);
        });
        
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
        
        this.updateSelectedCount();
    }

    deselectAll() {
        this.selectedPaths.clear();
        
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.indeterminate = false;
        });
        
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const count = this.selectedPaths.size;
        const totalLines = this.flatFileList
            .filter(f => this.selectedPaths.has(f.path))
            .reduce((sum, f) => sum + (f.lines || 0), 0);
        
        const countEl = document.getElementById('selected-count');
        if (countEl) {
            countEl.textContent = `${count} arquivo${count !== 1 ? 's' : ''} selecionado${count !== 1 ? 's' : ''}`;
        }
        
        const linesEl = document.getElementById('total-lines');
        if (linesEl) {
            linesEl.textContent = `${totalLines.toLocaleString('pt-BR')} linha${totalLines !== 1 ? 's' : ''}`;
        }
        
        const syncButton = document.getElementById('sync-selected');
        if (syncButton) {
            syncButton.disabled = count === 0;
        }
    }

    filterFiles(searchTerm) {
        const term = searchTerm.toLowerCase();
        const treeItems = document.querySelectorAll('.tree-item');
        
        if (!term) {
            treeItems.forEach(item => item.style.display = 'block');
            return;
        }
        
        treeItems.forEach(item => {
            const label = item.querySelector('.tree-label');
            if (label) {
                const text = label.textContent.toLowerCase();
                const matches = text.includes(term);
                item.style.display = matches ? 'block' : 'none';
                
                if (matches) {
                    let parent = item.parentElement;
                    while (parent && parent.classList.contains('tree-children')) {
                        parent.style.display = 'block';
                        parent.classList.remove('collapsed');
                        const toggle = parent.previousElementSibling?.querySelector('.tree-toggle');
                        if (toggle) toggle.classList.remove('collapsed');
                        parent = parent.parentElement?.parentElement;
                    }
                }
            }
        });
    }

    async syncSelected() {
        console.log('[Sidebar] === INICIANDO SINCRONIZAÇÃO ===');
        
        if (this.selectedPaths.size === 0) {
            console.log('[Sidebar] ❌ Nenhum arquivo selecionado');
            this.showMessage('Nenhum arquivo selecionado', 'error');
            return;
        }

        console.log('[Sidebar] Arquivos selecionados:', this.selectedPaths.size);

        try {
            this.setStatus('loading');
            
            const selectedPathsArray = Array.from(this.selectedPaths);
            
            console.log('[Sidebar] 1. Buscando conteúdo do servidor...');
            const response = await this.fetchViaBackground(
                `${this.config.serverUrl}/selective-content`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedPaths: selectedPathsArray })
                }
            );

            if (!response.success) {
                throw new Error(response.error || 'Erro ao buscar conteúdo');
            }

            const content = response.data;
            console.log('[Sidebar] Conteúdo recebido, tamanho:', content.length);
            
            console.log('[Sidebar] 2. Obtendo aba ativa...');
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            
            if (!activeTab) {
                throw new Error('Nenhuma aba ativa encontrada');
            }

            const isGemini = activeTab.url.includes('gemini.google.com');
            const isClaude = activeTab.url.includes('claude.ai/project/');
            
            console.log('[Sidebar] Plataforma:', isGemini ? 'Gemini' : isClaude ? 'Claude' : 'Desconhecida', activeTab.url);
            
            if (!isGemini && !isClaude) {
                throw new Error('Abra uma página do Gemini ou Claude Projects');
            }

            const messageType = isGemini ? 'ADD_FILE_GEMINI' : 'ADD_FILE';
            console.log('[Sidebar] 3. Enviando mensagem:', messageType);
            
            try {
                const messageResponse = await chrome.tabs.sendMessage(activeTab.id, {
                    type: messageType,
                    fileName: 'codemerge-selected.txt',
                    content: content
                });

                console.log('[Sidebar] Resposta da mensagem:', messageResponse);

                if (messageResponse && messageResponse.success === false) {
                    throw new Error(messageResponse.error || 'Erro ao enviar arquivo');
                }

                this.setStatus('success');
                this.showMessage(`${this.selectedPaths.size} arquivos sincronizados com sucesso`);
                console.log('[Sidebar] ✅ SINCRONIZAÇÃO CONCLUÍDA');
            } catch (msgError) {
                // Tratamento específico para erro de conexão (script não injetado ou extensão recarregada)
                if (msgError.message.includes('Could not establish connection') || 
                    msgError.message.includes('Receiving end does not exist')) {
                    throw new Error('⚠️ Conexão perdida. Por favor, recarregue a página (F5) para ativar a extensão.');
                }
                throw msgError;
            }
            
        } catch (error) {
            console.error('[Sidebar] ❌ ERRO NA SINCRONIZAÇÃO:', error);
            this.setStatus('error');
            this.showMessage(error.message, 'error');
        }
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

    updateUI() {
        this.updateSelectedCount();
    }
}

new CodeMergeSidebar();