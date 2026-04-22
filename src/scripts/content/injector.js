const resolveTargetEditor = (isClaudeEnvironment) => {
  if (isClaudeEnvironment) {
    const claudeEditor = document.querySelector('.ProseMirror') ?? document.querySelector('div[contenteditable="true"]')
    return claudeEditor
  }
  const defaultEditor = document.querySelector('div[contenteditable="true"]') ?? document.querySelector('.ql-editor') ?? document.querySelector('rich-textarea textarea') ?? document.querySelector('rich-textarea')
  return defaultEditor
}

const executeTextInjection = async (editor, text, isClaudeEnvironment) => {
  editor.focus()
  if (!isClaudeEnvironment) await new Promise((resolve) => setTimeout(resolve, 100))
  const isNativeExecSuccessful = document.execCommand('insertText', false, text)
  if (!isNativeExecSuccessful) {
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('text/plain', text)
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
      clipboardData: dataTransfer
    })
    editor.dispatchEvent(pasteEvent)
  }
  const inputEvent = new Event('input', {
    bubbles: true,
    composed: true
  })
  editor.dispatchEvent(inputEvent)
}

const executeFileUpload = async (fileName, content, isClaudeEnvironment) => {
  try {
    const file = new File([content], fileName, {
      type: 'text/plain',
      lastModified: Date.now()
    })
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    const targetFileInput = document.querySelector('input[type="file"]')
    if (targetFileInput) {
      Object.defineProperty(targetFileInput, 'files', {
        value: dataTransfer.files,
        writable: false,
        configurable: true
      })
      targetFileInput.dispatchEvent(new Event('change', { bubbles: true }))
      targetFileInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    const editor = resolveTargetEditor(isClaudeEnvironment)
    const dropTarget = editor ?? document.body
    dropTarget.dispatchEvent(new DragEvent('dragenter', {
      bubbles: true,
      cancelable: true,
      composed: true,
      dataTransfer
    }))
    dropTarget.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      composed: true,
      dataTransfer
    }))
    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      composed: true,
      dataTransfer
    })
    dropTarget.dispatchEvent(dropEvent)
    if (editor) {
      editor.focus()
      if (!isClaudeEnvironment) await new Promise((resolve) => setTimeout(resolve, 100))
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        composed: true
      })
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: dataTransfer,
        writable: false,
        configurable: true
      })
      editor.dispatchEvent(pasteEvent)
    }
    window.postMessage({ type: 'AI_UPLOAD_SUCCESS' }, '*')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown exception occurred'
    window.postMessage({
      type: 'AI_UPLOAD_ERROR',
      error: errorMessage
    }, '*')
  }
}

window.addEventListener('message', async (event) => {
  if (event.source !== window) return
  if (!event.data) return
  const eventType = event.data.type
  if (!eventType) return
  const isClaudeEnvironment = window.location.hostname.includes('claude.ai')
  if (eventType === 'AI_INJECT_TEXT') {
    if (!event.data.text) return
    const editor = resolveTargetEditor(isClaudeEnvironment)
    if (!editor) return
    await executeTextInjection(editor, event.data.text, isClaudeEnvironment)
    return
  }
  if (eventType === 'AI_UPLOAD_FILE') {
    if (!event.data.fileName || !event.data.content) return
    await executeFileUpload(event.data.fileName, event.data.content, isClaudeEnvironment)
  }
})