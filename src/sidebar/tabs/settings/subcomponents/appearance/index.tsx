import { MdSettingsBrightness, MdLightMode, MdDarkMode, MdViewHeadline, MdViewCompact, MdNotifications, MdErrorOutline, MdNotificationsOff, MdColorLens } from 'react-icons/md';
import { ToggleButtonGroup, ToggleButton, Typography, IconButton, Paper, Box } from '@mui/material';
import { useRef } from 'react';

import useConfigStore from '@/sidebar/stores/config';

const PREDEFINED_COLORS = ['#da7756', '#2196f3', '#4caf50', '#9c27b0', '#f44336'];

export const Appearance = () => {
    const { themeMode, primaryColor, compactMode, verbosity, setThemeMode, setPrimaryColor, setCompactMode, setVerbosity } = useConfigStore();
    const colorRef = useRef<HTMLInputElement>(null);

    return (
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
                    onChange={(_, v) => v && setThemeMode(v)}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="light">
                        <MdLightMode size={20} style={{ marginRight: 8 }} />
                        Claro
                    </ToggleButton>
                    <ToggleButton value="system">
                        <MdSettingsBrightness size={20} style={{ marginRight: 8 }} />
                        Auto
                    </ToggleButton>
                    <ToggleButton value="dark">
                        <MdDarkMode size={20} style={{ marginRight: 8 }} />
                        Escuro
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Densidade
                </Typography>
                <ToggleButtonGroup
                    value={compactMode ? 'compact' : 'normal'}
                    exclusive
                    onChange={(_, v) => v && setCompactMode(v === 'compact')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="normal">
                        <MdViewHeadline size={20} style={{ marginRight: 8 }} />
                        Normal
                    </ToggleButton>
                    <ToggleButton value="compact">
                        <MdViewCompact size={20} style={{ marginRight: 8 }} />
                        Compacto
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Notificações
                </Typography>
                <ToggleButtonGroup
                    value={verbosity}
                    exclusive
                    onChange={(_, v) => v && setVerbosity(v)}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="all">
                        <MdNotifications size={20} style={{ marginRight: 8 }} />
                        Tudo
                    </ToggleButton>
                    <ToggleButton value="errors">
                        <MdErrorOutline size={20} style={{ marginRight: 8 }} />
                        Erros
                    </ToggleButton>
                    <ToggleButton value="silent">
                        <MdNotificationsOff size={20} style={{ marginRight: 8 }} />
                        Mudo
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Cor Principal
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    {PREDEFINED_COLORS.map(c => (
                        <Box
                            key={c}
                            onClick={() => setPrimaryColor(c)}
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: c,
                                cursor: 'pointer',
                                border: primaryColor === c ? '2px solid white' : '2px solid transparent',
                                outline: primaryColor === c ? `2px solid ${c}` : 'none',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.1)' }
                            }}
                        />
                    ))}
                    <Box sx={{ position: 'relative' }}>
                        <IconButton
                            onClick={() => colorRef.current?.click()}
                            sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'divider', p: 0 }}
                        >
                            <MdColorLens size={20} style={{ color: primaryColor }} />
                        </IconButton>
                        <input
                            ref={colorRef}
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};