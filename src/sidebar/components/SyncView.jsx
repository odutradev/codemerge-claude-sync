import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    InputAdornment
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileTreeItem from './FileTreeItem';

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

const flattenStructure = (node) => {
    let files = [];
    if (node.type === 'file') files.push(node);
    if (node.children) {
        node.children.forEach(child => {
            files = [...files, ...flattenStructure(child)];
        });
    }
    return files;
};

const SyncView = ({ config, onConfigChange, fetchViaBackground }) => {
    const [projectStructure, setProjectStructure] = useState(null);
    const [selectedPaths, setSelectedPaths] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    const [stats, setStats] = useState({ files: 0, lines: 0 });
    const [lastUpdated, setLastUpdated] = useState(null);
    const [serverStatus, setServerStatus] = useState('checking'); 
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => {
            if (!config.serverUrl) return;
            
            if (isMounted) setIsChecking(true);
            try {
                const response = await fetchViaBackground(`${config.serverUrl}/health`);
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
        const interval = setInterval(checkHealth, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [config.serverUrl, fetchViaBackground]);

    const handleFetchStructure = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchViaBackground(`${config.serverUrl}/structure`);
            if (!response.success) throw new Error(response.error);
            
            const data = JSON.parse(response.data);
            setProjectStructure(data.root);
            setLastUpdated(new Date());
            
            const allFiles = flattenStructure(data.root);
            const newSet = new Set(allFiles.map(f => f.path));
            setSelectedPaths(newSet);
            
        } catch (error) {
            setMessage({ open: true, text: `Erro: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [config.serverUrl, fetchViaBackground]);

    useEffect(() => {
        if (serverStatus === 'connected' && !projectStructure && !loading) {
            handleFetchStructure();
        }
    }, [serverStatus, projectStructure, handleFetchStructure, loading]);

    const handleToggleSelection = (node, isSelected) => {
        const newSelected = new Set(selectedPaths);
        const toggleNode = (n, select) => {
            if (n.type === 'file') {
                if (select) newSelected.add(n.path);
                else newSelected.delete(n.path);
            }
            if (n.children) n.children.forEach(c => toggleNode(c, select));
        };
        toggleNode(node, isSelected);
        setSelectedPaths(newSelected);
    };

    useEffect(() => {
        if (!projectStructure) return;
        const allFiles = flattenStructure(projectStructure);
        const selectedFiles = allFiles.filter(f => selectedPaths.has(f.path));
        const lines = selectedFiles.reduce((acc, f) => acc + (f.lines || 0), 0);
        setStats({ files: selectedFiles.length, lines });
    }, [selectedPaths, projectStructure]);

    const handleSync = async () => {
        if (selectedPaths.size === 0) return;
        setLoading(true);
        try {
            const selectedPathsArray = Array.from(selectedPaths);
            
            const response = await fetchViaBackground(
                `${config.serverUrl}/selective-content`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedPaths: selectedPathsArray })
                }
            );

            if (!response.success) throw new Error(response.error);
            const content = response.data;

            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            
            if (!activeTab) throw new Error('Nenhuma aba ativa');

            const isGemini = activeTab.url.includes('gemini.google.com');
            const messageType = isGemini ? 'ADD_FILE_GEMINI' : 'ADD_FILE';

            const msgResponse = await chrome.tabs.sendMessage(activeTab.id, {
                type: messageType,
                fileName: 'codemerge-selected.txt',
                content: content
            });

            if (msgResponse && msgResponse.success === false) {
                throw new Error(msgResponse.error);
            }

            setMessage({ open: true, text: `Sincronizado: ${stats.files} arquivos`, type: 'success' });

        } catch (error) {
            setMessage({ open: true, text: `Erro: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusProps = () => {
        if (isChecking) {
            return {
                color: 'warning.main',
                borderColor: '#ed6c02',
                borderAnimation: `${pulseOrange} 1.5s infinite`,
                dotAnimation: `${dotBreathing} 1s infinite`
            };
        }
        if (serverStatus === 'connected') {
            return {
                color: 'success.main',
                borderColor: '#4caf50',
                borderAnimation: `${pulseGreen} 3s infinite`,
                dotAnimation: `${dotBreathing} 3s infinite`
            };
        }
        if (serverStatus === 'disconnected') {
            return {
                color: 'error.main',
                borderColor: '#f44336',
                borderAnimation: `${pulseRed} 2s infinite`,
                dotAnimation: `${dotBreathing} 2s infinite`
            };
        }
        return {
            color: 'text.disabled',
            borderColor: undefined,
            borderAnimation: 'none',
            dotAnimation: 'none'
        };
    };

    const statusProps = getStatusProps();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">URL do Servidor</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                        fullWidth 
                        size="small" 
                        variant="outlined" 
                        value={config.serverUrl}
                        onChange={(e) => onConfigChange({ serverUrl: e.target.value })}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor: statusProps.color,
                                            animation: statusProps.dotAnimation,
                                            transition: 'background-color 0.3s ease'
                                        }}
                                    />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                transition: 'all 0.3s ease',
                                animation: statusProps.borderAnimation,
                                '& fieldset': {
                                    borderColor: statusProps.borderColor,
                                    transition: 'border-color 0.3s'
                                },
                                '&:hover fieldset': {
                                    borderColor: statusProps.borderColor,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: statusProps.borderColor,
                                },
                            }
                        }}
                    />
                    <Button 
                        variant="outlined" 
                        onClick={handleFetchStructure}
                        disabled={loading || isChecking || serverStatus !== 'connected'}
                        sx={{ minWidth: 'auto', px: 2 }}
                        title="Buscar Estrutura"
                    >
                        {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                    </Button>
                </Box>
            </Box>

            {projectStructure && (
                <>
                    <TextField 
                        fullWidth 
                        size="small" 
                        placeholder="Filtrar arquivos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            flexGrow: 1, 
                            overflow: 'auto', 
                            mb: 2, 
                            p: 0,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent', 
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                            },
                            '&::-webkit-scrollbar-corner': {
                                background: 'transparent',
                            }
                        }}
                    >
                        <FileTreeItem 
                            node={projectStructure} 
                            selectedPaths={selectedPaths}
                            onToggleSelection={handleToggleSelection}
                            searchTerm={searchTerm}
                        />
                    </Paper>

                    <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                             <Typography variant="caption" color="text.secondary">
                                Arquivos: {stats.files}
                             </Typography>
                             <Typography variant="caption" color="text.secondary">
                                Linhas: {stats.lines.toLocaleString()}
                             </Typography>
                             {lastUpdated && (
                                <Typography variant="caption" color="text.secondary">
                                    Atualizado: {lastUpdated.toLocaleTimeString()}
                                </Typography>
                             )}
                        </Box>
                        
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                            onClick={handleSync}
                            disabled={loading || stats.files === 0 || serverStatus !== 'connected'}
                            fullWidth
                        >
                            Sincronizar Selecionados
                        </Button>
                    </Box>
                </>
            )}

            <Snackbar 
                open={message.open} 
                autoHideDuration={4000} 
                onClose={() => setMessage({ ...message, open: false })}
            >
                <Alert severity={message.type} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SyncView;