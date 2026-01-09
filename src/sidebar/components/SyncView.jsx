import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Paper,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileTreeItem from './FileTreeItem';

const SyncView = ({ config, onConfigChange, fetchViaBackground }) => {
    const [projectStructure, setProjectStructure] = useState(null);
    const [selectedPaths, setSelectedPaths] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    const [stats, setStats] = useState({ files: 0, lines: 0 });
    const [lastUpdated, setLastUpdated] = useState(null);

    const handleFetchStructure = async () => {
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
    };

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
                    />
                    <Button 
                        variant="outlined" 
                        onClick={handleFetchStructure}
                        disabled={loading}
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
                            p: 1,
                            // Scrollbar styling
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
                            disabled={loading || stats.files === 0}
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
