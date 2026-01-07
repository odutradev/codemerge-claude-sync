chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ADD_FILE') {
        handleAddFile(message.fileName, message.content)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

async function handleAddFile(fileName, content) {
    const existingFile = await findExistingFile(fileName);
    
    if (existingFile) {
        await removeFile(existingFile);
        await wait(1000);
    }
    
    await addFile(fileName, content);
    await wait(500);
}

async function findExistingFile(fileName) {
    const thumbnails = document.querySelectorAll('[data-testid="file-thumbnail"]');
    
    for (const thumbnail of thumbnails) {
        const nameElement = thumbnail.querySelector('h3');
        if (nameElement?.textContent.trim() === fileName) {
            const deleteButton = thumbnail.querySelector('button');
            return { element: thumbnail, deleteButton };
        }
    }
    
    return null;
}

async function removeFile(fileInfo) {
    if (fileInfo.deleteButton) {
        fileInfo.deleteButton.click();
    } else {
        fileInfo.element.click();
    }

    await wait(500);
    
    const confirmButtons = document.querySelectorAll('button');
    for (const button of confirmButtons) {
        const text = button.textContent.toLowerCase();
        if (text.includes('excluir') || text.includes('delete') || text.includes('remove')) {
            if (button.offsetParent !== null) {
                button.click();
                break;
            }
        }
    }
}

async function addFile(fileName, content) {
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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('CodeMerge Project Helper carregado');
