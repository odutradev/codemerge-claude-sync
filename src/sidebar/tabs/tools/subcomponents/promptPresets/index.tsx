import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, TextField, IconButton, List, ListItem, Tooltip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { MdContentCopy, MdExpandMore, MdDelete, MdInput, MdEdit, MdAdd } from 'react-icons/md';

import { accordionStyles, accordionSummaryStyles, accordionDetailsStyles, headerBoxStyles, listStyles, listItemStyles, itemHeaderStyles, actionsBoxStyles, promptTextStyles } from './styles';
import { usePromptPresets } from '@/sidebar/tabs/tools/hooks/usePromptPresets';

import type { MessageState } from '@/sidebar/types';

interface Props { showNotification: (text: string, type: MessageState['type']) => void; }

export const PromptPresets = ({ showNotification }: Props) => {
    const { state, actions } = usePromptPresets(showNotification);

    return (
        <>
            <Accordion sx={accordionStyles}>
                <AccordionSummary expandIcon={<MdExpandMore size={24} />} sx={accordionSummaryStyles}>
                    <Box sx={headerBoxStyles}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>PRESETS DE PROMPT</Typography>
                        <Button size="small" startIcon={<MdAdd size={20} />} onClick={(e) => { e.stopPropagation(); actions.handleOpenDialog(); }} sx={{ fontSize: '0.75rem', textTransform: 'none' }}>Novo Preset</Button>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsStyles}>
                    {state.presets.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>Nenhum preset cadastrado.</Typography> : (
                        <List sx={listStyles}>
                            {state.presets.map((preset) => (
                                <ListItem key={preset.id} sx={listItemStyles}>
                                    <Box sx={itemHeaderStyles}>
                                        <Typography variant="body2" fontWeight="bold">{preset.title}</Typography>
                                        <Box sx={actionsBoxStyles}>
                                            <Tooltip title="Inserir no chat"><IconButton size="small" onClick={() => actions.handleInject(preset.prompt)} sx={{ color: '#ffffff' }}><MdInput size={20} /></IconButton></Tooltip>
                                            <Tooltip title="Copiar Prompt"><IconButton size="small" onClick={() => actions.handleCopy(preset.prompt)} sx={{ color: '#ffffff' }}><MdContentCopy size={20} /></IconButton></Tooltip>
                                            <Tooltip title="Editar"><IconButton size="small" onClick={() => actions.handleOpenDialog(preset)} sx={{ color: '#ffffff' }}><MdEdit size={20} /></IconButton></Tooltip>
                                            <Tooltip title="Remover"><IconButton size="small" onClick={() => actions.handleDelete(preset.id)} sx={{ color: '#ffffff' }}><MdDelete size={20} /></IconButton></Tooltip>
                                        </Box>
                                    </Box>
                                    <Box sx={promptTextStyles}>{preset.prompt}</Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </AccordionDetails>
            </Accordion>
            <Dialog open={state.dialogOpen} onClose={actions.handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
                <DialogTitle sx={{ pb: 1, fontSize: '1rem', fontWeight: 600 }}>{state.formData.id ? 'Editar Preset' : 'Novo Preset'}</DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Título" size="small" fullWidth value={state.formData.title} onChange={(e) => actions.setFormData({ ...state.formData, title: e.target.value })} />
                    <TextField label="Prompt" size="small" fullWidth multiline minRows={4} maxRows={10} value={state.formData.prompt} onChange={(e) => actions.setFormData({ ...state.formData, prompt: e.target.value })} sx={{ '& .MuiInputBase-root': { fontSize: '0.85rem', fontFamily: 'monospace' } }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={actions.handleCloseDialog} color="inherit" sx={{ textTransform: 'none' }}>Cancelar</Button>
                    <Button onClick={actions.handleSave} variant="contained" disableElevation sx={{ textTransform: 'none' }}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};