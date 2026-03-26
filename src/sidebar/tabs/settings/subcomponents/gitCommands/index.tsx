import { MdAutoFixHigh, MdTerminal, MdTranslate } from 'react-icons/md';
import { ToggleButtonGroup, ToggleButton, Typography, Paper, Box } from '@mui/material';

import useConfigStore from '@/sidebar/store/configStore';

export const GitCommands = () => {
    const { translateCommit, showCommandModal, setTranslateCommit, setShowCommandModal } = useConfigStore();

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}><MdAutoFixHigh size={20} style={{ marginRight: 8 }} /> Git & Comandos</Typography>
            <Box sx={{ mb: 3 }}><Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Tradução Automática de Commits</Typography><ToggleButtonGroup value={translateCommit ? 'on' : 'off'} exclusive onChange={(_, v) => v && setTranslateCommit(v === 'on')} size="small" fullWidth><ToggleButton value="off">Inativo</ToggleButton><ToggleButton value="on" color="primary"><MdTranslate size={20} style={{ marginRight: 8 }} />Ativo</ToggleButton></ToggleButtonGroup></Box>
            <Box sx={{ mb: 1 }}><Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Modal de Output</Typography><ToggleButtonGroup value={showCommandModal ? 'on' : 'off'} exclusive onChange={(_, v) => v && setShowCommandModal(v === 'on')} size="small" fullWidth><ToggleButton value="off">Ocultar</ToggleButton><ToggleButton value="on" color="primary"><MdTerminal size={20} style={{ marginRight: 8 }} />Exibir</ToggleButton></ToggleButtonGroup></Box>
        </Paper>
    );
};