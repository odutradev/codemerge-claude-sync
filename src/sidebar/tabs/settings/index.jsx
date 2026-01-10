import React, { useRef } from 'react';
import { 
    Box, 
    TextField, 
    Typography, 
    Paper, 
    InputAdornment, 
    ToggleButton, 
    ToggleButtonGroup,
    IconButton,
    Switch,
    FormControlLabel
} from '@mui/material';
import useConfigStore from '../../store/configStore';
import TimerIcon from '@mui/icons-material/Timer';
import DnsIcon from '@mui/icons-material/Dns';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PREDEFINED_COLORS = [
    '#da7756',
    '#2196f3',
    '#4caf50',
    '#9c27b0',
    '#f44336',
];

const SettingsView = () => {
    const { 
        serverUrl, 
        checkInterval, 
        themeMode, 
        primaryColor,
        compactMode,
        verbosity,
        setServerUrl, 
        setCheckInterval,
        setThemeMode,
        setPrimaryColor,
        setCompactMode,
        setVerbosity
    } = useConfigStore();

    const colorInputRef = useRef(null);

    const handleThemeChange = (event, newMode) => {
        if (newMode !== null) {
            setThemeMode(newMode);
        }
    };

    const handleVerbosityChange = (event, newLevel) => {
        if (newLevel !== null) {
            setVerbosity(newLevel);
        }
    };

    return (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Configurações
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                    Interface & UX
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Aparência
                    </Typography>
                    <ToggleButtonGroup
                        value={themeMode}
                        exclusive
                        onChange={handleThemeChange}
                        aria-label="theme mode"
                        size="small"
                        fullWidth
                    >
                        <ToggleButton value="light">
                            <LightModeIcon fontSize="small" sx={{ mr: 1 }} />
                            Claro
                        </ToggleButton>
                        <ToggleButton value="system">
                            <SettingsBrightnessIcon fontSize="small" sx={{ mr: 1 }} />
                            Auto
                        </ToggleButton>
                        <ToggleButton value="dark">
                            <DarkModeIcon fontSize="small" sx={{ mr: 1 }} />
                            Escuro
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ mb: 3 }}>
                     <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Densidade da Lista
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={compactMode} 
                                onChange={(e) => setCompactMode(e.target.checked)} 
                                size="small"
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {compactMode ? <ViewCompactIcon fontSize="small" /> : <ViewHeadlineIcon fontSize="small" />}
                                <Typography variant="body2">
                                    {compactMode ? "Modo Compacto" : "Modo Normal"}
                                </Typography>
                            </Box>
                        }
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Notificações (Verbosity)
                    </Typography>
                    <ToggleButtonGroup
                        value={verbosity}
                        exclusive
                        onChange={handleVerbosityChange}
                        aria-label="verbosity"
                        size="small"
                        fullWidth
                    >
                        <ToggleButton value="all">
                            <NotificationsIcon fontSize="small" sx={{ mr: 1 }} />
                            Tudo
                        </ToggleButton>
                        <ToggleButton value="errors">
                            <ErrorOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                            Erros
                        </ToggleButton>
                        <ToggleButton value="silent">
                            <NotificationsOffIcon fontSize="small" sx={{ mr: 1 }} />
                            Mudo
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Cor Principal
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        {PREDEFINED_COLORS.map((color) => (
                            <Box
                                key={color}
                                onClick={() => setPrimaryColor(color)}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: color,
                                    cursor: 'pointer',
                                    border: primaryColor === color ? '2px solid white' : '2px solid transparent',
                                    outline: primaryColor === color ? `2px solid ${color}` : 'none',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'scale(1.1)' }
                                }}
                            />
                        ))}
                        
                        <Box sx={{ position: 'relative' }}>
                            <IconButton 
                                onClick={() => colorInputRef.current?.click()}
                                sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    p: 0
                                }}
                            >
                                <ColorLensIcon fontSize="small" style={{ color: primaryColor }} />
                            </IconButton>
                            <input
                                ref={colorInputRef}
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                    Conexão & Sistema
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        URL do Servidor
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DnsIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Intervalo de Checagem (ms)
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="number"
                        value={checkInterval}
                        onChange={(e) => setCheckInterval(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TimerIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
                CodeMerge Sync v2.2.0
            </Typography>
        </Box>
    );
};

export default SettingsView;
