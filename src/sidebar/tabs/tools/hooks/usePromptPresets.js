import { useState, useCallback } from 'react';

import usePromptStore from '../../../store/promptStore';

export const usePromptPresets = (showNotification) => {
    const { presets, addPreset, updatePreset, deletePreset } = usePromptStore();

    const [formData, setFormData] = useState({ id: null, title: '', prompt: '' });
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = useCallback((preset = null) => {
        setFormData(preset || { id: null, title: '', prompt: '' });
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setFormData({ id: null, title: '', prompt: '' });
    }, []);

    const handleSave = useCallback(() => {
        if (!formData.title.trim() || !formData.prompt.trim()) {
            showNotification('Título e prompt são obrigatórios', 'warning');
            return;
        }
        if (formData.id) {
            updatePreset(formData.id, { title: formData.title, prompt: formData.prompt });
            showNotification('Preset atualizado', 'success');
        } else {
            addPreset({ title: formData.title, prompt: formData.prompt });
            showNotification('Preset criado', 'success');
        }
        handleCloseDialog();
    }, [formData, addPreset, updatePreset, showNotification, handleCloseDialog]);

    const handleDelete = useCallback((id) => {
        deletePreset(id);
        showNotification('Preset removido', 'info');
    }, [deletePreset, showNotification]);

    const handleCopy = useCallback((promptText) => {
        navigator.clipboard.writeText(promptText);
        showNotification('Prompt copiado para a área de transferência', 'success');
    }, [showNotification]);

    return {
        state: { presets, dialogOpen, formData },
        actions: { handleOpenDialog, handleCloseDialog, handleSave, handleDelete, handleCopy, setFormData }
    };
};