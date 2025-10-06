// Popup Script'knjknekjnfdskjnksd
document.addEventListener('DOMContentLoaded', async () => {
    const serverUrlInput = document.getElementById('serverUrl');
    const projectNameInput = document.getElementById('projectName');
    const intervalInput = document.getElementById('interval');
    const saveButton = document.getElementById('saveConfig');
    const statusDiv = document.getElementById('status');
    
    // Carregar configuração atual
    chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
        if (response && response.config) {
            serverUrlInput.value = response.config.serverUrl || 'http://localhost:9876';
            projectNameInput.value = response.config.projectName || '';
            intervalInput.value = response.config.updateInterval / 1000 || 5;
        }
    });
    
    // Salvar configuração
    saveButton.onclick = () => {
        const config = {
            serverUrl: serverUrlInput.value.trim(),
            projectName: projectNameInput.value.trim(),
            updateInterval: parseInt(intervalInput.value) * 1000
        };
        
        chrome.runtime.sendMessage({ 
            type: 'UPDATE_CONFIG', 
            config 
        }, (response) => {
            if (response && response.success) {
                statusDiv.textContent = '✅ Configuração salva!';
                statusDiv.style.color = '#28a745';
                
                setTimeout(() => {
                    statusDiv.textContent = 'Configure e acesse claude.ai';
                    statusDiv.style.color = '#888';
                }, 2000);
            }
        });
    };
});
