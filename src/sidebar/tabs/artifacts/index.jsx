import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    Checkbox,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    alpha
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import CodeIcon from '@mui/icons-material/Code';
import DeselectIcon from '@mui/icons-material/Deselect';
import TerminalIcon from '@mui/icons-material/Terminal';
import InputIcon from '@mui/icons-material/Input';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

import FileIcon from '../../components/fileIcon';
import useConfigStore from '../../store/configStore';
import { processCode } from '../../utils/codeProcessor';

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

const ArtifactsView = ({ fetchViaBackground }) => {
    const { serverUrl, checkInterval, verbosity, removeComments, removeEmptyLines, removeLogs, setRemoveComments } = useConfigStore();
    const [artifacts, setArtifacts] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    const [serverStatus, setServerStatus] = useState('checking');
    const [isChecking, setIsChecking] = useState(false);

    const [cmdDialogOpen, setCmdDialogOpen] = useState(false);
    const [cmdOutput, setCmdOutput] = useState(null);
    const [cmdLoading, setCmdLoading] = useState(false);

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
                if (removeComments) {
                    content = processCode(content, {
                        removeComments: true,
                        removeEmptyLines,
                        removeLogs
                    });
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

    const handleFetchCommandOutput = async () => {
        setCmdLoading(true);
        try {
            const response = await fetchViaBackground(`${serverUrl}/command-output`);
            if (!response.success) throw new Error(response.error);
            const data = JSON.parse(response.data);
            setCmdOutput(data);
        } catch (error) {
            showNotification(`Erro ao buscar output: ${error.message}`, 'error');
            setCmdOutput({ error: error.message });
        } finally {
            setCmdLoading(false);
        }
    };

    const handleOpenCmdDialog = () => {
        setCmdDialogOpen(true);
        handleFetchCommandOutput();
    };

    const handleInjectOutput = async () => {
        if (!cmdOutput) return;

        const content = cmdOutput.status === 'no_command_executed'
            ? 'Nenhum comando foi executado recentemente.'
            : `COMMAND: ${cmdOutput.command}\nTIMESTAMP: ${cmdOutput.timestamp}\nSTATUS: ${cmdOutput.success ? 'SUCCESS' : 'ERROR'}\n\nOUTPUT:\n${cmdOutput.output || cmdOutput.error || ''}`;

        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            if (!activeTab) throw new Error('Aba ativa não encontrada');

            const isGemini = activeTab.url.includes('gemini.google.com');
            const response = await chrome.tabs.sendMessage(activeTab.id, {
                type: isGemini ? 'ADD_FILE_GEMINI' : 'ADD_FILE',
                fileName: 'command-output.txt',
                content: content
            });

            if (!response?.success && response?.error) throw new Error(response.error);
            showNotification('Output inserido no input!', 'success');
            setCmdDialogOpen(false);
        } catch (error) {
            showNotification(`Erro ao injetar: ${error.message}`, 'error');
        }
    };

    const handleDeselectAll = () => {
        setSelectedIndices(new Set());
    };

    const statusProps = {
        connected: { color: 'success.main', animation: `${pulseGreen} 3s infinite`, text: 'Online' },
        disconnected: { color: 'error.main', animation: `${pulseRed} 2s infinite`, text: 'Offline' },
        checking: { color: 'warning.main', animation: `${pulseOrange} 1.5s infinite`, text: 'Verificando...' }
    }[isChecking ? 'checking' : serverStatus] || { color: 'text.disabled', animation: 'none', text: '...' };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusProps.color, animation: statusProps.animation, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {statusProps.text}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleFetchArtifacts(false)}
                    disabled={loading}
                    fullWidth
                    size="small"
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Buscar
                </Button>

                <Tooltip title="Output do Comando (Hooks)">
                    <IconButton
                        size="small"
                        onClick={handleOpenCmdDialog}
                        disabled={serverStatus !== 'connected'}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            width: 36,
                            height: 36
                        }}
                    >
                        <TerminalIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title={removeComments ? "Limpeza ativa" : "Limpeza inativa"}>
                    <IconButton
                        size="small"
                        color={removeComments ? "primary" : "default"}
                        onClick={() => setRemoveComments(!removeComments)}
                        sx={{
                            border: '1px solid',
                            borderColor: removeComments ? 'primary.main' : 'divider',
                            borderRadius: 2,
                            width: 36,
                            height: 36
                        }}
                    >
                        {removeComments ? <CodeOffIcon fontSize="small" /> : <CodeIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Box>

            {fetching ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
            ) : artifacts.length > 0 ? (
                <>
                    <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{
                            flexGrow: 1,
                            overflow: 'hidden',
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            borderColor: 'divider'
                        }}
                    >
                        <Box
                            sx={{
                                px: 2,
                                py: 1.5,
                                borderBottom: 1,
                                borderColor: 'divider',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02)
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {artifacts.length} ARQUIVOS
                            </Typography>
                            <Button
                                size="small"
                                onClick={handleDeselectAll}
                                disabled={selectedIndices.size === 0}
                                sx={{
                                    fontSize: '0.7rem',
                                    minWidth: 'auto',
                                    p: 0,
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                    '&:hover': { color: 'error.main', bgcolor: 'transparent' }
                                }}
                            >
                                Limpar
                            </Button>
                        </Box>

                        <List sx={{ p: 1, overflowY: 'auto', flexGrow: 1 }}>
                            {artifacts.map((artifact, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    onClick={() => {
                                        const next = new Set(selectedIndices);
                                        if (next.has(index)) next.delete(index); else next.add(index);
                                        setSelectedIndices(next);
                                    }}
                                    sx={{
                                        borderRadius: 1.5,
                                        mb: 0.5,
                                        p: 1,
                                        transition: 'all 0.2s',
                                        bgcolor: selectedIndices.has(index) ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                        '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12) }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, width: '100%' }}>
                                        <Checkbox
                                            checked={selectedIndices.has(index)}
                                            size="small"
                                            sx={{ p: 0.5, mr: 1.5 }}
                                        />

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            color: 'text.secondary',
                                            width: 24,
                                            height: 24
                                        }}>
                                            <FileIcon fileName={artifact.name} />
                                        </Box>

                                        <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
                                            <Typography variant="body2" noWrap sx={{ color: 'text.primary', fontWeight: 500 }}>
                                                {artifact.name}
                                            </Typography>
                                        </Box>

                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', opacity: 0.7 }}>
                                            {artifact.code.split('\n').length}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Button
                        variant="contained"
                        onClick={handleSync}
                        disabled={loading || selectedIndices.size === 0 || serverStatus !== 'connected'}
                        fullWidth
                        disableElevation
                        startIcon={<UploadIcon />}
                        sx={{ textTransform: 'none', py: 1, borderRadius: 2 }}
                    >
                        Sincronizar ({selectedIndices.size})
                    </Button>
                </>
            ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5, gap: 1 }}>
                    <DeselectIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary">Nenhum artefato encontrado</Typography>
                </Box>
            )}

            <Dialog
                open={cmdDialogOpen}
                onClose={() => setCmdDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TerminalIcon color="primary" />
                        <Typography variant="h6">Output do Comando</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setCmdDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {cmdLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box>
                            {cmdOutput?.status === 'no_command_executed' ? (
                                <Alert severity="info" variant="outlined">
                                    Nenhum comando configurado ou executado recentemente.
                                </Alert>
                            ) : (
                                <>
                                    <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Comando</Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, borderRadius: 1 }}>
                                                {cmdOutput?.command || '-'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Horário</Typography>
                                            <Typography variant="body2">
                                                {cmdOutput?.timestamp ? new Date(cmdOutput.timestamp).toLocaleTimeString() : '-'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Status</Typography>
                                            <Typography variant="body2" color={cmdOutput?.success ? 'success.main' : 'error.main'} fontWeight="bold">
                                                {cmdOutput?.success ? 'SUCESSO' : 'ERRO'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={10}
                                        maxRows={20}
                                        value={cmdOutput?.output || cmdOutput?.error || ''}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                            sx: { fontFamily: 'monospace', fontSize: '0.85rem', bgcolor: 'background.default' }
                                        }}
                                    />
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        startIcon={<RefreshIcon />}
                        onClick={handleFetchCommandOutput}
                        disabled={cmdLoading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<InputIcon />}
                        onClick={handleInjectOutput}
                        disabled={cmdLoading || !cmdOutput || cmdOutput.status === 'no_command_executed'}
                        disableElevation
                    >
                        Inserir no Chat
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={message.open} autoHideDuration={2000} onClose={() => setMessage({ ...message, open: false })}>
                <Alert severity={message.type} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ArtifactsView;