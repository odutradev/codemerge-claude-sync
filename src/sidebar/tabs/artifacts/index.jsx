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
    Alert,
    Tooltip,
    IconButton
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import CodeIcon from '@mui/icons-material/Code';
import FileIcon from '../../components/fileIcon';
import useConfigStore from '../../store/configStore';
import { removeComments } from '../../utils/codeProcessor';

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
    const { serverUrl, checkInterval, verbosity, compactMode, removeComments: removeCommentsEnabled, setRemoveComments } = useConfigStore();
    const [artifacts, setArtifacts] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    
    const [serverStatus, setServerStatus] = useState('checking'); 
    const [isChecking, setIsChecking] = useState(false);

    const showNotification = useCallback((text, type = 'info') => {
        if (verbosity === 'silent') return;
        if (verbosity === 'errors' && type !== 'error') return;
        setMessage({ open: true, text, type });
    }, [verbosity]);

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => {
            if (!serverUrl) return;
            if (isMounted) setIsChecking(true);
            try {
                const response = await fetchViaBackground(`${serverUrl}/health`);
                if (isMounted) {
                    setServerStatus(response.success ? 'connected' : 'disconnected');
                }
            } catch (error) {
                if (isMounted) setServerStatus('disconnected');
            } finally {
                setTimeout(() => { if (isMounted) setIsChecking(false); }, 500);
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, checkInterval);
        return () => { isMounted = false; clearInterval(interval); };
    }, [serverUrl, checkInterval, fetchViaBackground]);

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
                if (!artifact.name.toLowerCase().endsWith('.md')) initialSelection.add(index);
            });
            setSelectedIndices(initialSelection);
            if (!silent) showNotification(`${response.artifacts?.length || 0} artefatos encontrados`, 'success');

        } catch (error) {
            if (!silent) showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, [showNotification]);

    useEffect(() => {
        if (serverStatus === 'connected') handleFetchArtifacts(true);
    }, [serverStatus, handleFetchArtifacts]);

    const handleSync = async () => {
        if (selectedIndices.size === 0) return;
        setLoading(true);
        try {
            const selectedFiles = Array.from(selectedIndices).map(index => {
                const artifact = artifacts[index];
                let content = artifact.code;
                if (removeCommentsEnabled) {
                    content = removeComments(content);
                }
                return { path: artifact.name, content };
            });

            const response = await fetchViaBackground(`${serverUrl}/upsert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: selectedFiles })
            });

            if (!response.success) throw new Error(response.error);
            showNotification('Artefatos enviados!', 'success');
        } catch (error) {
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const statusProps = {
        connected: { color: 'success.main', animation: `${pulseGreen} 3s infinite`, text: 'Online' },
        disconnected: { color: 'error.main', animation: `${pulseRed} 2s infinite`, text: 'Offline' },
        checking: { color: 'warning.main', animation: `${pulseOrange} 1.5s infinite`, text: 'Verificando...' }
    }[isChecking ? 'checking' : serverStatus] || { color: 'text.disabled', animation: 'none', text: '...' };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    {statusProps.text}
                </Typography>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: statusProps.color, animation: statusProps.animation }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button 
                    variant="outlined" 
                    startIcon={<DownloadIcon />} 
                    onClick={() => handleFetchArtifacts(false)}
                    disabled={loading}
                    fullWidth
                >
                    Buscar Artefatos
                </Button>
                <Tooltip title={removeCommentsEnabled ? "Limpeza de código ativa" : "Limpeza de código inativa"}>
                    <IconButton 
                        color={removeCommentsEnabled ? "primary" : "default"}
                        onClick={() => setRemoveComments(!removeCommentsEnabled)}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                    >
                        {removeCommentsEnabled ? <CodeOffIcon /> : <CodeIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            {fetching ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
            ) : artifacts.length > 0 ? (
                <>
                    <Paper variant="outlined" sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                        <List dense={compactMode}>
                            {artifacts.map((artifact, index) => (
                                <ListItem key={index} button onClick={() => {
                                    const next = new Set(selectedIndices);
                                    if (next.has(index)) next.delete(index); else next.add(index);
                                    setSelectedIndices(next);
                                }} divider>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox edge="start" checked={selectedIndices.has(index)} size="small" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={<Box sx={{ display: 'flex', alignItems: 'center' }}><FileIcon fileName={artifact.name} sx={{ mr: 1 }} /><Typography variant="body2" noWrap>{artifact.name}</Typography></Box>}
                                        secondary={`${artifact.code.split('\n').length} linhas`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Button variant="contained" onClick={handleSync} disabled={loading || selectedIndices.size === 0 || serverStatus !== 'connected'} fullWidth startIcon={<UploadIcon />}>
                        Fazer Upsert Local ({selectedIndices.size})
                    </Button>
                </>
            ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}><Typography variant="body2">Vazio</Typography></Box>
            )}
            <Snackbar open={message.open} autoHideDuration={2000} onClose={() => setMessage({ ...message, open: false })}><Alert severity={message.type}>{message.text}</Alert></Snackbar>
        </Box>
    );
};

export default ArtifactsView;