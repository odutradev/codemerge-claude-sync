import { MdOutlinePushPin, MdLibraryAddCheck, MdDeleteForever, MdDeleteSweep, MdPushPin, MdHistory, MdRestore, MdTimer } from 'react-icons/md';
import { ToggleButtonGroup, InputAdornment, ToggleButton, Typography, TextField, Divider, Button, Paper, Box } from '@mui/material';

import useSelectionStore from '@/sidebar/stores/selection';
import useHistoryStore from '@/sidebar/stores/history';
import useConfigStore from '@/sidebar/stores/config';

import type { MessageState } from '@/sidebar/types';

interface Props { setMsg: (msg: MessageState) => void; }

export const DataSync = ({ setMsg }: Props) => {
    const { checkInterval, persistSelection, autoSelectSynced, setCheckInterval, setPersistSelection, setAutoSelectSynced, resetConfig } = useConfigStore();
    const { clearAllSelections } = useSelectionStore();
    const { clearAllHistory } = useHistoryStore();

    const handleReset = () => { resetConfig(); setMsg({ open: true, text: 'Configurações restauradas', type: 'success' }); };

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>Dados & Sincronização</Typography>
            <Box sx={{ mb: 3 }}><Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Persistência</Typography><ToggleButtonGroup value={persistSelection ? 'on' : 'off'} exclusive onChange={(_, v) => v && setPersistSelection(v === 'on')} size="small" fullWidth><ToggleButton value="off"><MdOutlinePushPin size={20} style={{ marginRight: 8 }} />Volátil</ToggleButton><ToggleButton value="on"><MdPushPin size={20} style={{ marginRight: 8 }} />Manter Seleção</ToggleButton></ToggleButtonGroup></Box>
            <Box sx={{ mb: 3 }}><Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Auto-selecionar Artefatos</Typography><ToggleButtonGroup value={autoSelectSynced ? 'on' : 'off'} exclusive onChange={(_, v) => v && setAutoSelectSynced(v === 'on')} size="small" fullWidth><ToggleButton value="off">Inativo</ToggleButton><ToggleButton value="on" color="primary"><MdLibraryAddCheck size={20} style={{ marginRight: 8 }} />Ativo</ToggleButton></ToggleButtonGroup></Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}><Button variant="outlined" color="warning" startIcon={<MdDeleteSweep size={20} />} onClick={() => { clearAllSelections(); setMsg({ open: true, text: 'Cache de seleções limpo', type: 'success' }); }} fullWidth size="small">Limpar Cache de Seleções</Button><Button variant="outlined" color="warning" startIcon={<MdHistory size={20} />} onClick={() => { clearAllHistory(); setMsg({ open: true, text: 'Histórico limpo', type: 'success' }); }} fullWidth size="small">Limpar Histórico de Artefatos</Button><Button variant="outlined" color="error" startIcon={<MdDeleteForever size={20} />} onClick={() => { clearAllSelections(); clearAllHistory(); setMsg({ open: true, text: 'Todo cache limpo', type: 'success' }); }} fullWidth size="small">Limpar Todo o Cache</Button></Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Check Interval (ms)</Typography>
            <TextField fullWidth variant="outlined" size="small" type="number" value={checkInterval} onChange={(e) => setCheckInterval(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><MdTimer size={20} /></InputAdornment>) }} sx={{ mb: 2 }} />
            <Button variant="outlined" color="error" startIcon={<MdRestore size={20} />} onClick={handleReset} fullWidth size="small">Restaurar Padrões</Button>
        </Paper>
    );
};