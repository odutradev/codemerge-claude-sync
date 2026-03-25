import { ToggleButtonGroup, FormControlLabel, InputAdornment, ToggleButton, Typography, IconButton, TextField, Checkbox, Snackbar, Divider, Button, Alert, Paper, Box } from '@mui/material';
import { SettingsBrightness, PushPinOutlined, LibraryAddCheck, NotificationsOff, DeleteSweep, Notifications, ErrorOutline, AutoFixHigh, ViewHeadline, ViewCompact, RestartAlt, ColorLens, LightMode, DarkMode, PushPin, Terminal, Translate, Timer } from '@mui/icons-material';
import React, { useRef, useState, useEffect } from 'react';

import useSelectionStore from '../../store/selectionStore';
import useConfigStore from '../../store/configStore';

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
                        <ToggleButton value="light"><LightMode fontSize="small" sx={{ mr: 1 }} />Claro</ToggleButton>
                        <ToggleButton value="system"><SettingsBrightness fontSize="small" sx={{ mr: 1 }} />Auto</ToggleButton>
                        <ToggleButton value="dark"><DarkMode fontSize="small" sx={{ mr: 1 }} />Escuro</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Densidade</Typography>
                    <ToggleButtonGroup value={compactMode ? 'compact' : 'normal'} exclusive onChange={(_, v) => v && setCompactMode(v === 'compact')} size="small" fullWidth>
                        <ToggleButton value="normal"><ViewHeadline fontSize="small" sx={{ mr: 1 }} />Normal</ToggleButton>
                        <ToggleButton value="compact"><ViewCompact fontSize="small" sx={{ mr: 1 }} />Compacto</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Notificações</Typography>
                    <ToggleButtonGroup value={verbosity} exclusive onChange={(_, v) => v && setVerbosity(v)} size="small" fullWidth>
                        <ToggleButton value="all"><Notifications fontSize="small" sx={{ mr: 1 }} />Tudo</ToggleButton>
                        <ToggleButton value="errors"><ErrorOutline fontSize="small" sx={{ mr: 1 }} />Erros</ToggleButton>
                        <ToggleButton value="silent"><NotificationsOff fontSize="small" sx={{ mr: 1 }} />Mudo</ToggleButton>
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
                                <ColorLens fontSize="small" style={{ color: primaryColor }} />
                            </IconButton>
                            <input ref={colorInputRef} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <AutoFixHigh fontSize="small" sx={{ mr: 1 }} /> Git & Comandos
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Tradução Automática de Commits</Typography>
                    <ToggleButtonGroup value={translateCommit ? 'on' : 'off'} exclusive onChange={(_, v) => v && setTranslateCommit(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off">Inativo</ToggleButton>
                        <ToggleButton value="on" color="primary"><Translate fontSize="small" sx={{ mr: 1 }} />Ativo</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Modal de Output</Typography>
                    <ToggleButtonGroup value={showCommandModal ? 'on' : 'off'} exclusive onChange={(_, v) => v && setShowCommandModal(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off">Ocultar</ToggleButton>
                        <ToggleButton value="on" color="primary"><Terminal fontSize="small" sx={{ mr: 1 }} />Exibir</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <AutoFixHigh fontSize="small" sx={{ mr: 1 }} /> Limpeza de Código
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
                        <ToggleButton value="off"><PushPinOutlined fontSize="small" sx={{ mr: 1 }} />Volátil</ToggleButton>
                        <ToggleButton value="on"><PushPin fontSize="small" sx={{ mr: 1 }} />Manter Seleção</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Auto-selecionar Artefatos</Typography>
                    <ToggleButtonGroup value={autoSelectSynced ? 'on' : 'off'} exclusive onChange={(_, v) => v && setAutoSelectSynced(v === 'on')} size="small" fullWidth>
                        <ToggleButton value="off">Inativo</ToggleButton>
                        <ToggleButton value="on" color="primary"><LibraryAddCheck fontSize="small" sx={{ mr: 1 }} />Ativo</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Button variant="outlined" color="warning" startIcon={<DeleteSweep />} onClick={() => { clearAllSelections(); setMessage({ open: true, text: 'Cache limpo', type: 'success' }); }} fullWidth size="small" sx={{ mb: 2 }}>Limpar Cache de Seleções</Button>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Check Interval (ms)</Typography>
                <TextField fullWidth variant="outlined" size="small" type="number" value={checkInterval} onChange={(e) => setCheckInterval(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Timer fontSize="small" /></InputAdornment>) }} sx={{ mb: 2 }} />
                <Button variant="outlined" color="error" startIcon={<RestartAlt />} onClick={handleReset} fullWidth size="small">Restaurar Padrões</Button>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>CodeMerge Sync v{version}</Typography>
            <Snackbar open={message.open} autoHideDuration={2000} onClose={() => setMessage({ ...message, open: false })}>
                <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
            </Snackbar>
        </Box>
    );
};

export default SettingsView;