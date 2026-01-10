import React from 'react';
import { Box, TextField, Typography, Paper, InputAdornment } from '@mui/material';
import useConfigStore from '../../store/configStore';
import TimerIcon from '@mui/icons-material/Timer';
import DnsIcon from '@mui/icons-material/Dns';

const SettingsView = () => {
    const { serverUrl, checkInterval, setServerUrl, setCheckInterval } = useConfigStore();

    return (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Configurações
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Conexão
                    </Typography>
                    <TextField
                        fullWidth
                        label="URL do Servidor"
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
                        Performance & Monitoramento
                    </Typography>
                    <TextField
                        fullWidth
                        label="Intervalo de Checagem (ms)"
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
                        helperText="Tempo entre verificações de status do servidor"
                    />
                </Box>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
                CodeMerge Sync v2.0.9
            </Typography>
        </Box>
    );
};

export default SettingsView;