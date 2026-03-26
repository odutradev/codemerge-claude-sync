import { MdSettingsBrightness, MdOutlinePushPin, MdLibraryAddCheck, MdNotificationsOff, MdDeleteForever, MdDeleteSweep, MdNotifications, MdErrorOutline, MdAutoFixHigh, MdViewHeadline, MdViewCompact, MdColorLens, MdLightMode, MdDarkMode, MdPushPin, MdTerminal, MdTranslate, MdHistory, MdRestore, MdTimer } from 'react-icons/md';
import { ToggleButtonGroup, FormControlLabel, InputAdornment, ToggleButton, Typography, IconButton, TextField, Checkbox, Snackbar, Divider, Button, Alert, Paper, Box } from '@mui/material';
import { useRef, useState, useEffect } from 'react';

import useSelectionStore from '@/sidebar/store/selectionStore';
import useHistoryStore from '@/sidebar/store/historyStore';
import useConfigStore from '@/sidebar/store/configStore';

const PREDEFINED_COLORS = ['#da7756', '#2196f3', '#4caf50', '#9c27b0', '#f44336'];

const SettingsView = () => {
    const {
        checkInterval, themeMode, primaryColor, compactMode, verbosity, persistSelection,
        removeComments, removeEmptyLines, removeLogs, translateCommit, showCommandModal, autoSelectSynced,
        setCheckInterval, setThemeMode, setPrimaryColor, setCompactMode, setVerbosity,
        setPersistSelection, setRemoveComments, setRemoveEmptyLines, setRemoveLogs,
        setTranslateCommit, setShowCommandModal, setAutoSelectSynced, resetConfig
    } = useConfigStore();

    const { clearAllSelections } = useSelectionStore();
    const { clearAllHistory } = useHistoryStore();
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    const [version, setVersion] = useState('0.0.0');
    const colorInputRef = useRef(null);

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
            setVersion(chrome.runtime.getManifest().version);
        }
    }, []);

    const handleReset = () => {
        resetConfig();
        setMessage({ open: true, text: 'Configurações restauradas', type: 'success' });
    };

    return (
        <Box sx={{ p: 2, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Configurações</Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>Interface & UX</Typography>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Aparência</Typography>
                    <ToggleButtonGroup value={themeMode} exclusive onChange={(_, v) => v && setThemeMode(v)} size="small" fullWidth>
                        <ToggleButton value="light"><MdLightMode size={20} style={{ marginRight: 8 }} />Claro</ToggleButton>
                        <ToggleButton value="system"><MdSettingsBrightness size={20} style={{ marginRight: 8 }} />Auto</ToggleButton>
                        <ToggleButton value="dark"><MdDarkMode size={20} style={{ marginRight: 8 }} />Escuro</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Densidade</Typography>
                    <ToggleButtonGroup value={compactMode ? 'compact' : 'normal'} exclusive onChange={(_, v) => v && setCompactMode(v === 'compact')} size="small" fullWidth>
                        <ToggleButton value="normal"><MdViewHeadline size={20} style={{ marginRight: 8 }} />Normal</ToggleButton>
                        <ToggleButton value="compact"><MdViewCompact size={20} style={{ marginRight: 8 }} />Compacto</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Notificações</Typography>
                    <ToggleButtonGroup value={verbosity} exclusive onChange={(_, v) => v && setVerbosity(v)} size="small" fullWidth>
                        <ToggleButton value="all"><MdNotifications size={20} style={{ marginRight: 8 }} />Tudo</ToggleButton>
                        <ToggleButton value="errors"><MdErrorOutline size={20} style={{ marginRight: 8 }} />Erros</ToggleButton>
                        <ToggleButton value="silent"><MdNotificationsOff size={20} style={{ marginRight: 8 }} />Mudo</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Cor Principal</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        {PREDEFINED_COLORS.map((color) => (
                            <Box key={color} onClick={() => setPrimaryColor(color)} sx={{
                                width: 32, height: 32, borderRadius: '50%', bgcolor: color, cursor: 'pointer',
                                border: primaryColor === color ? '2px solid white' : '2px solid transparent',
                                outline: primaryColor === color ? `2px solid ${color}` : 'none',
                                transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' }
                            }} />
                        ))}
                        <Box sx={{ position: 'relative' }}>
                            <IconButton onClick={() => colorInputRef.current?.click()} sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'divider', p: 0 }}>
                                <MdColorLens size={20} style={{ color: primaryColor }} />
                            </IconButton>
                            <input ref={colorInputRef} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <MdAutoFixHigh size={20} style={{ marginRight: 8 }} /> Git & Comandos
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Tradução Automática de Commits</Typography>
                    <ToggleButtonGroup value={translateCommit ? 'on' : 'off'} exclusive onChange={(_, v) => v && setTranslateCommit(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off">Inativo</ToggleButton>
                        <ToggleButton value="on" color="primary"><MdTranslate size={20} style={{ marginRight: 8 }} />Ativo</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Modal de Output</Typography>
                    <ToggleButtonGroup value={showCommandModal ? 'on' : 'off'} exclusive onChange={(_, v) => v && setShowCommandModal(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off">Ocultar</ToggleButton>
                        <ToggleButton value="on" color="primary"><MdTerminal size={20} style={{ marginRight: 8 }} />Exibir</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <MdAutoFixHigh size={20} style={{ marginRight: 8 }} /> Limpeza de Código
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <ToggleButtonGroup value={removeComments ? 'on' : 'off'} exclusive onChange={(_, v) => v && setRemoveComments(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off">Não Limpar</ToggleButton>
                        <ToggleButton value="on" color="primary">Limpar</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, opacity: removeComments ? 1 : 0.5, pointerEvents: removeComments ? 'auto' : 'none' }}>
                    <FormControlLabel control={<Checkbox size="small" checked={true} disabled />} label={<Typography variant="caption">Remover Comentários (Base)</Typography>} />
                    <FormControlLabel control={<Checkbox size="small" checked={removeEmptyLines} onChange={(e) => setRemoveEmptyLines(e.target.checked)} />} label={<Typography variant="caption">Remover Linhas Vazias</Typography>} />
                    <FormControlLabel control={<Checkbox size="small" checked={removeLogs} onChange={(e) => setRemoveLogs(e.target.checked)} />} label={<Typography variant="caption">Remover Console Logs</Typography>} />
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>Dados & Sincronização</Typography>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Persistência</Typography>
                    <ToggleButtonGroup value={persistSelection ? 'on' : 'off'} exclusive onChange={(_, v) => v && setPersistSelection(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off"><MdOutlinePushPin size={20} style={{ marginRight: 8 }} />Volátil</ToggleButton>
                        <ToggleButton value="on"><MdPushPin size={20} style={{ marginRight: 8 }} />Manter Seleção</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Auto-selecionar Artefatos</Typography>
                    <ToggleButtonGroup value={autoSelectSynced ? 'on' : 'off'} exclusive onChange={(_, v) => v && setAutoSelectSynced(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off">Inativo</ToggleButton>
                        <ToggleButton value="on" color="primary"><MdLibraryAddCheck size={20} style={{ marginRight: 8 }} />Ativo</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Button variant="outlined" color="warning" startIcon={<MdDeleteSweep size={20} />} onClick={() => { clearAllSelections(); setMessage({ open: true, text: 'Cache de seleções limpo', type: 'success' }); }} fullWidth size="small">Limpar Cache de Seleções</Button>
                    <Button variant="outlined" color="warning" startIcon={<MdHistory size={20} />} onClick={() => { clearAllHistory(); setMessage({ open: true, text: 'Histórico de artefatos limpo', type: 'success' }); }} fullWidth size="small">Limpar Histórico de Artefatos</Button>
                    <Button variant="outlined" color="error" startIcon={<MdDeleteForever size={20} />} onClick={() => { clearAllSelections(); clearAllHistory(); setMessage({ open: true, text: 'Todo o cache foi limpo', type: 'success' }); }} fullWidth size="small">Limpar Todo o Cache</Button>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Check Interval (ms)</Typography>
                <TextField fullWidth variant="outlined" size="small" type="number" value={checkInterval} onChange={(e) => setCheckInterval(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><MdTimer size={20} /></InputAdornment>) }} sx={{ mb: 2 }} />
                <Button variant="outlined" color="error" startIcon={<MdRestore size={20} />} onClick={handleReset} fullWidth size="small">Restaurar Padrões</Button>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>CodeMerge Sync v{version}</Typography>
            <Snackbar open={message.open} autoHideDuration={2000} onClose={() => setMessage({ ...message, open: false })}>
                <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
            </Snackbar>
        </Box>
    );
};

export default SettingsView;