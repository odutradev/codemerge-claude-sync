import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Paper,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import FileIcon from '../../components/fileIcon';
import useConfigStore from '../../store/configStore';

const pulseGreen = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const pulseRed = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
`;

const pulseOrange = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(237, 108, 2, 0); }
  100% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0); }
`;

const dotBreathing = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const ArtifactsView = ({ fetchViaBackground }) => {
    const { serverUrl, checkInterval } = useConfigStore();
    const [artifacts, setArtifacts] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    
    const [serverStatus, setServerStatus] = useState('checking'); 
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => {
            if (!serverUrl) return;
            
            if (isMounted) setIsChecking(true);
            try {
                const response = await fetchViaBackground(`${serverUrl}/health`);
                if (isMounted) {
                    if (response.success) {
                        setServerStatus('connected');
                    } else {
                        setServerStatus('disconnected');
                    }
                }
            } catch (error) {
                if (isMounted) setServerStatus('disconnected');
            } finally {
                setTimeout(() => {
                    if (isMounted) setIsChecking(false);
                }, 500);
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, checkInterval);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [serverUrl, checkInterval, fetchViaBackground]);

    const getStatusProps = () => {
        if (isChecking) {
            return {
                color: 'warning.main',
                pulseAnimation: `${pulseOrange} 1.5s infinite`,
                dotAnimation: `${dotBreathing} 1s infinite`,
                text: 'Verificando...'
            };
        }
        if (serverStatus === 'connected') {
            return {
                color: 'success.main',
                pulseAnimation: `${pulseGreen} 3s infinite`,
                dotAnimation: `${dotBreathing} 3s infinite`,
                text: 'Online'
            };
        }
        if (serverStatus === 'disconnected') {
            return {
                color: 'error.main',
                pulseAnimation: `${pulseRed} 2s infinite`,
                dotAnimation: `${dotBreathing} 2s infinite`,
                text: 'Offline'
            };
        }
        return {
            color: 'text.disabled',
            pulseAnimation: 'none',
            dotAnimation: 'none',
            text: 'Desconhecido'
        };
    };

    const statusProps = getStatusProps();

    const handleFetchArtifacts = useCallback(async (silent = false) => {
        setLoading(true);
        setFetching(true);
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            
            if (!activeTab || !activeTab.url.includes('gemini.google.com')) {
                throw new Error('Esta função só funciona no Gemini');
            }

            const response = await chrome.tabs.sendMessage(activeTab.id, {
                type: 'GET_GEMINI_ARTIFACTS'
            });

            if (!response.success) throw new Error(response.error);
            
            setArtifacts(response.artifacts || []);
            
            const initialSelection = new Set();
            (response.artifacts || []).forEach((artifact, index) => {
                if (!artifact.name.toLowerCase().endsWith('.md')) {
                    initialSelection.add(index);
                }
            });
            setSelectedIndices(initialSelection);
            
            if (!silent) {
                setMessage({ open: true, text: `${response.artifacts?.length || 0} artefatos encontrados`, type: 'success' });
            }

        } catch (error) {
            console.log(error)
            if (!silent) {
                setMessage({ open: true, text: `Erro: ${error.message}`, type: 'error' });
            }
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        if (serverStatus === 'connected') {
            handleFetchArtifacts(true);
        }
    }, [serverStatus, handleFetchArtifacts]);

    const handleToggle = (index) => {
        const newSelected = new Set(selectedIndices);
        if (newSelected.has(index)) newSelected.delete(index);
        else newSelected.add(index);
        setSelectedIndices(newSelected);
    };

    const handleSync = async () => {
        if (selectedIndices.size === 0) return;
        setLoading(true);
        try {
            const selectedFiles = Array.from(selectedIndices).map(index => {
                const artifact = artifacts[index];
                return {
                    path: artifact.name,
                    content: artifact.code
                };
            });

            const response = await fetchViaBackground(
                `${serverUrl}/upsert`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ files: selectedFiles })
                }
            );

            if (!response.success) throw new Error(response.error);

            setMessage({ open: true, text: 'Artefatos enviados com sucesso!', type: 'success' });
        } catch (error) {
            setMessage({ open: true, text: `Erro: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Status do servidor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {statusProps.text}
                    </Typography>
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: statusProps.color,
                            animation: `${statusProps.dotAnimation}, ${statusProps.pulseAnimation}`,
                            transition: 'background-color 0.3s ease'
                        }}
                    />
                </Box>
            </Box>

            <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={() => handleFetchArtifacts(false)}
                disabled={loading}
                fullWidth
                sx={{ mb: 2 }}
            >
                Buscar Artefatos
            </Button>

            {fetching ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary">Buscando artefatos...</Typography>
                </Box>
            ) : artifacts.length > 0 ? (
                <>
                    <Paper variant="outlined" sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                        <List dense>
                            {artifacts.map((artifact, index) => (
                                <ListItem 
                                    key={index}
                                    button 
                                    onClick={() => handleToggle(index)}
                                    divider
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedIndices.has(index)}
                                            tabIndex={-1}
                                            disableRipple
                                            size="small"
                                        />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ mr: 1, display: 'flex' }}>
                                                    <FileIcon fileName={artifact.name} />
                                                </Box>
                                                <Typography variant="body2" noWrap>
                                                    {artifact.name}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {artifact.code.length} chars • {artifact.code.split('\n').length} lines
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
                        onClick={handleSync}
                        disabled={loading || selectedIndices.size === 0 || serverStatus !== 'connected'}
                        fullWidth
                    >
                        Fazer Upsert Local ({selectedIndices.size})
                    </Button>
                </>
            ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                    <Typography variant="body2">Nenhum artefato carregado</Typography>
                </Box>
            )}

            <Snackbar 
                open={message.open} 
                autoHideDuration={1000} 
                onClose={() => setMessage({ ...message, open: false })}
            >
                <Alert severity={message.type} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ArtifactsView;