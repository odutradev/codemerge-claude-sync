console.log('[GeminiHelper] Content script carregado');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[GeminiHelper] Mensagem recebida:', message);
    
    if (message.type === 'ADD_FILE_GEMINI') {
        console.log('[GeminiHelper] Iniciando handleAddFileGemini');
        console.log('[GeminiHelper] FileName:', message.fileName);
        console.log('[GeminiHelper] Content length:', message.content?.length);
        
        handleAddFileGemini(message.fileName, message.content)
            .then(() => {
                console.log('[GeminiHelper] ✅ Sucesso');
                sendResponse({ success: true });
            })
            .catch(error => {
                console.error('[GeminiHelper] ❌ Erro:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

async function handleAddFileGemini(fileName, content) {
    console.log('[GeminiHelper] === INICIANDO UPLOAD ===');
    
    console.log('[GeminiHelper] 1. Procurando botão de menu (+)...');
    const menuButton = document.querySelector('button.upload-card-button') ||
                      document.querySelector('button[aria-label*="upload"]') ||
                      document.querySelector('button mat-icon[fonticon="add_2"]')?.closest('button');
    
    console.log('[GeminiHelper] Botão de menu encontrado:', !!menuButton);
    
    if (!menuButton) {
        const allButtons = document.querySelectorAll('button');
        console.log('[GeminiHelper] Total de botões na página:', allButtons.length);
        allButtons.forEach((btn, i) => {
            if (i < 15) {
                const icon = btn.querySelector('mat-icon');
                console.log(`[GeminiHelper] Botão ${i}:`, {
                    text: btn.textContent?.substring(0, 50),
                    class: btn.className,
                    icon: icon?.getAttribute('fonticon'),
                    ariaLabel: btn.getAttribute('aria-label')
                });
            }
        });
        throw new Error('Botão de menu (+) não encontrado');
    }
    
    console.log('[GeminiHelper] Clicando no botão de menu...');
    menuButton.click();
    await wait(800);
    
    console.log('[GeminiHelper] 2. Procurando botão "Enviar arquivos"...');
    const uploadButton = document.querySelector('button[data-test-id="local-images-files-uploader-button"]');
    console.log('[GeminiHelper] Botão "Enviar arquivos" encontrado:', !!uploadButton);
    
    if (!uploadButton) {
        const allMenuButtons = document.querySelectorAll('mat-action-list button');
        console.log('[GeminiHelper] Botões no menu:', allMenuButtons.length);
        allMenuButtons.forEach((btn, i) => {
            console.log(`[GeminiHelper] Menu botão ${i}:`, {
                text: btn.textContent?.trim().substring(0, 50),
                testId: btn.getAttribute('data-test-id')
            });
        });
        throw new Error('Botão "Enviar arquivos" não encontrado no menu');
    }
    
    console.log('[GeminiHelper] Clicando em "Enviar arquivos"...');
    uploadButton.click();
    await wait(800);
    
    console.log('[GeminiHelper] 3. Procurando input de arquivo...');
    const allInputs = document.querySelectorAll('input[type="file"]');
    console.log('[GeminiHelper] Inputs encontrados:', allInputs.length);
    
    allInputs.forEach((input, i) => {
        console.log(`[GeminiHelper] Input ${i}:`, {
            accept: input.accept,
            multiple: input.multiple,
            class: input.className,
            visible: input.offsetParent !== null
        });
    });
    
    const fileInput = Array.from(allInputs).find(input => 
        input.className.includes('hidden-local-file') || 
        input.accept?.includes('text') ||
        input.accept === '*/*'
    ) || allInputs[allInputs.length - 1];
    
    if (!fileInput) {
        throw new Error('Input de upload não encontrado');
    }
    
    console.log('[GeminiHelper] Input selecionado:', {
        accept: fileInput.accept,
        multiple: fileInput.multiple,
        class: fileInput.className
    });
    
    console.log('[GeminiHelper] 4. Criando arquivo...');
    const fileBlob = new File([content], fileName, {
        type: 'text/plain',
        lastModified: Date.now()
    });
    
    console.log('[GeminiHelper] Arquivo criado:', {
        name: fileBlob.name,
        size: fileBlob.size,
        type: fileBlob.type
    });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(fileBlob);
    fileInput.files = dataTransfer.files;
    
    console.log('[GeminiHelper] 5. Disparando eventos...');
    const changeEvent = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    
    const inputEvent = new Event('input', { bubbles: true });
    fileInput.dispatchEvent(inputEvent);
    
    console.log('[GeminiHelper] 6. Aguardando processamento...');
    await wait(1000);
    
    console.log('[GeminiHelper] === UPLOAD FINALIZADO ===');
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}