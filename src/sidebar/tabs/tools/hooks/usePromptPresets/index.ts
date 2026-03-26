import { useState, useCallback } from 'react';

import useNotificationStore from '@/sidebar/stores/notification';
import usePromptStore from '@/sidebar/stores/prompt';

import type { UsePromptPresetsReturn } from './types';
import type { Preset } from '@/sidebar/types';

export const usePromptPresets = (): UsePromptPresetsReturn => {
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { presets, addPreset, updatePreset, deletePreset } = usePromptStore();
    const [formData, setFormData] = useState<{ id: string | null; title: string; prompt: string }>({ id: null, title: '', prompt: '' });
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = useCallback((preset: Preset | null = null) => { setFormData(preset || { id: null, title: '', prompt: '' }); setDialogOpen(true); }, []);
    const handleCloseDialog = useCallback(() => { setDialogOpen(false); setFormData({ id: null, title: '', prompt: '' }); }, []);

    const handleSave = useCallback(() => {
        if (!formData.title.trim() || !formData.prompt.trim()) return showNotification('Título e prompt são obrigatórios', 'warning');
        if (formData.id) { updatePreset(formData.id, { title: formData.title, prompt: formData.prompt }); showNotification('Preset atualizado', 'success'); } else { addPreset({ title: formData.title, prompt: formData.prompt }); showNotification('Preset criado', 'success'); }
        handleCloseDialog();
    }, [formData, addPreset, updatePreset, showNotification, handleCloseDialog]);

    const handleDelete = useCallback((id: string) => { deletePreset(id); showNotification('Preset removido', 'info'); }, [deletePreset, showNotification]);
    const handleCopy = useCallback((promptText: string) => { navigator.clipboard.writeText(promptText); showNotification('Prompt copiado para a área de transferência', 'success'); }, [showNotification]);

    const handleInject = useCallback(async (promptText: string) => {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]) throw new Error('Aba ativa não encontrada');
            await chrome.tabs.sendMessage(tabs[0].id!, { type: 'INJECT_TEXT', text: promptText });
            showNotification('Prompt inserido no chat', 'success');
        } catch (err: any) { showNotification(`Erro ao inserir no chat: ${err.message}`, 'error'); }
    }, [showNotification]);

    return { state: { presets, dialogOpen, formData }, actions: { handleOpenDialog, handleCloseDialog, handleSave, handleDelete, handleCopy, handleInject, setFormData } };
};