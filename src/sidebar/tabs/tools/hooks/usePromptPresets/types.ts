import type { Preset } from '@/sidebar/types'

export default interface UsePromptPresetsReturn {
  state: {
    presets: Preset[]
    dialogOpen: boolean
    formData: {
      id: string | null
      title: string
      prompt: string
    }
  }
  actions: {
    handleOpenDialog: (preset?: Preset | null) => void
    handleCloseDialog: () => void
    handleSave: () => void
    handleDelete: (id: string) => void
    handleCopy: (promptText: string) => void
    handleInject: (promptText: string) => void
    setFormData: (data: { id: string | null; title: string; prompt: string }) => void
  }
}