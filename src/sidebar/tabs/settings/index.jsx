import React, { useRef, useState, useMemo, useEffect } from 'react';
import { 
    Box, 
    TextField, 
    Typography, 
    Paper, 
    InputAdornment, 
    ToggleButton, 
    ToggleButtonGroup,
    IconButton,
    Button,
    Divider,
    Snackbar,
    Alert,
    createTheme,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import TimerIcon from '@mui/icons-material/Timer';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import CodeIcon from '@mui/icons-material/Code';

const DEFAULT_CONFIG = {
    serverUrl: 'http://localhost:9876',
    checkInterval: 5000,
    themeMode: 'system',
    primaryColor: '#da7756',
    compactMode: false,
    verbosity: 'all',
    persistSelection: true,
    removeComments: false,
};

const useConfigStore = create((set, get) => ({
    ...DEFAULT_CONFIG,
    setServerUrl: (url) => set({ serverUrl: url }),
    setCheckInterval: (interval) => {
        const val = parseInt(interval, 10);
        if (!isNaN(val) && val > 0) set({ checkInterval: val });
    },
    setThemeMode: (mode) => set({ themeMode: mode }),
    setPrimaryColor: (color) => set({ primaryColor: color }),
    setCompactMode: (mode) => set({ compactMode: mode }),
    setVerbosity: (level) => set({ verbosity: level }),
    setPersistSelection: (enabled) => set({ persistSelection: enabled }),
    setRemoveComments: (enabled) => set({ removeComments: enabled }),
    resetConfig: () => set(DEFAULT_CONFIG),
    syncToBackground: () => {
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
            chrome.runtime.sendMessage({ type: 'UPDATE_CONFIG', config: get() });
        }
    }
}));

const useSelectionStore = create(
    persist(
        (set) => ({
            selections: {},
            timestamps: {},
            clearAllSelections: () => set({ selections: {}, timestamps: {} }),
        }),
        { name: 'codemerge-selection-storage' }
    )
);

const PREDEFINED_COLORS = ['#da7756', '#2196f3', '#4caf50', '#9c27b0', '#f44336'];

const SettingsView = () => {
    const { 
        checkInterval, themeMode, primaryColor, compactMode, verbosity, persistSelection, removeComments,
        setCheckInterval, setThemeMode, setPrimaryColor, setCompactMode, setVerbosity,
        setPersistSelection, setRemoveComments, resetConfig
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

    const handleThemeChange = (event, newMode) => { if (newMode !== null) setThemeMode(newMode); };
    const handleCompactChange = (event, newMode) => { if (newMode !== null) setCompactMode(newMode === 'compact'); };
    const handleVerbosityChange = (event, newLevel) => { if (newLevel !== null) setVerbosity(newLevel); };
    const handlePersistChange = (event, newValue) => { if (newValue !== null) setPersistSelection(newValue === 'on'); };
    const handleCommentsChange = (event, newValue) => { if (newValue !== null) setRemoveComments(newValue === 'on'); };

    const handleReset = () => {
        resetConfig();
        setMessage({ open: true, text: 'Configurações restauradas', type: 'success' });
    };

    const handleClearCache = () => {
        clearAllSelections();
        setMessage({ open: true, text: 'Cache de seleções limpo', type: 'success' });
    };

    return (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Configurações</Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>Interface & UX</Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Aparência</Typography>
                    <ToggleButtonGroup value={themeMode} exclusive onChange={handleThemeChange} size="small" fullWidth>
                        <ToggleButton value="light"><LightModeIcon fontSize="small" sx={{ mr: 1 }} />Claro</ToggleButton>
                        <ToggleButton value="system"><SettingsBrightnessIcon fontSize="small" sx={{ mr: 1 }} />Auto</ToggleButton>
                        <ToggleButton value="dark"><DarkModeIcon fontSize="small" sx={{ mr: 1 }} />Escuro</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Densidade da Lista</Typography>
                    <ToggleButtonGroup value={compactMode ? 'compact' : 'normal'} exclusive onChange={handleCompactChange} size="small" fullWidth>
                        <ToggleButton value="normal"><ViewHeadlineIcon fontSize="small" sx={{ mr: 1 }} />Normal</ToggleButton>
                        <ToggleButton value="compact"><ViewCompactIcon fontSize="small" sx={{ mr: 1 }} />Compacto</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Limpeza de Código</Typography>
                    <ToggleButtonGroup value={removeComments ? 'on' : 'off'} exclusive onChange={handleCommentsChange} size="small" fullWidth>
                        <ToggleButton value="off"><CodeIcon fontSize="small" sx={{ mr: 1 }} />Preservar</ToggleButton>
                        <ToggleButton value="on"><CodeOffIcon fontSize="small" sx={{ mr: 1 }} />Limpar Comentários</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Notificações</Typography>
                    <ToggleButtonGroup value={verbosity} exclusive onChange={handleVerbosityChange} size="small" fullWidth>
                        <ToggleButton value="all"><NotificationsIcon fontSize="small" sx={{ mr: 1 }} />Tudo</ToggleButton>
                        <ToggleButton value="errors"><ErrorOutlineIcon fontSize="small" sx={{ mr: 1 }} />Erros</ToggleButton>
                        <ToggleButton value="silent"><NotificationsOffIcon fontSize="small" sx={{ mr: 1 }} />Mudo</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Manter Seleção</Typography>
                    <ToggleButtonGroup value={persistSelection ? 'on' : 'off'} exclusive onChange={handlePersistChange} size="small" fullWidth>
                        <ToggleButton value="off"><PushPinOutlinedIcon fontSize="small" sx={{ mr: 1 }} />Desativado</ToggleButton>
                        <ToggleButton value="on"><PushPinIcon fontSize="small" sx={{ mr: 1 }} />Ativado</ToggleButton>
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
                                <ColorLensIcon fontSize="small" style={{ color: primaryColor }} />
                            </IconButton>
                            <input ref={colorInputRef} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>Dados & Armazenamento</Typography>
                <Button variant="outlined" color="warning" startIcon={<DeleteSweepIcon />} onClick={handleClearCache} fullWidth size="small" sx={{ mb: 2 }}>Limpar Cache de Seleções</Button>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Intervalo de Checagem (ms)</Typography>
                <TextField fullWidth variant="outlined" size="small" type="number" value={checkInterval} onChange={(e) => setCheckInterval(e.target.value)}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><TimerIcon fontSize="small" /></InputAdornment>), }} sx={{ mb: 2 }} />
                <Button variant="outlined" color="error" startIcon={<RestartAltIcon />} onClick={handleReset} fullWidth size="small">Restaurar Padrões</Button>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>CodeMerge Sync v{version}</Typography>
            <Snackbar open={message.open} autoHideDuration={2000} onClose={() => setMessage({ ...message, open: false })}>
                <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
            </Snackbar>
        </Box>
    );
};

export default function App() {
    const { themeMode, primaryColor } = useConfigStore();
    const theme = useMemo(() => createTheme({
        palette: {
            mode: themeMode === 'system' ? 'dark' : themeMode,
            primary: { main: primaryColor },
            background: {
                default: themeMode === 'light' ? '#f5f5f5' : '#1a1a1a',
                paper: themeMode === 'light' ? '#ffffff' : '#262626',
            },
        },
        typography: { fontSize: 12 },
    }), [themeMode, primaryColor]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SettingsView />
        </ThemeProvider>
    );
}