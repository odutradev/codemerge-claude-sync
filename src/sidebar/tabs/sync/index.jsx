import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    InputAdornment,
    IconButton,
    Tooltip
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import CodeIcon from '@mui/icons-material/Code';
import FileTreeItem from './subcomponents/filetreeItem';
import useConfigStore from '../../store/configStore';
import useSelectionStore from '../../store/selectionStore';
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

const flattenStructure = (node) => {
    let files = [];
    if (node.type === 'file') files.push(node);
    if (node.children) node.children.forEach(child => { files = [...files, ...flattenStructure(child)]; });
    return files;
};

const SyncView = ({ fetchViaBackground }) => {
    const { serverUrl, checkInterval, setServerUrl, verbosity, persistSelection, setPersistSelection, removeComments, removeEmptyLines, removeLogs, setRemoveComments } = useConfigStore();
    const { selections, setProjectSelection, hasStoredSelection } = useSelectionStore();
    
    const [projectStructure, setProjectStructure] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    const [serverStatus, setServerStatus] = useState('checking'); 
    const [isChecking, setIsChecking] = useState(false);

    const selectedPaths = useMemo(() => projectId ? new Set(selections[projectId] || []) : new Set(), [selections, projectId]);

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
                if (isMounted) setServerStatus(response.success ? 'connected' : 'disconnected');
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

    const handleFetchStructure = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchViaBackground(`${serverUrl}/structure`);
            if (!response.success) throw new Error(response.error);
            const data = JSON.parse(response.data);
            setProjectStructure(data.root);
            const newProjectId = data.project || 'default-project';
            setProjectId(newProjectId);
            if (!persistSelection || !hasStoredSelection(newProjectId)) {
                const allFiles = flattenStructure(data.root);
                const defaultSelection = allFiles.filter(f => !f.name.toLowerCase().endsWith('.md')).map(f => f.path);
                setProjectSelection(newProjectId, defaultSelection);
            }
        } catch (error) {
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [serverUrl, fetchViaBackground, showNotification, persistSelection, hasStoredSelection, setProjectSelection]);

    useEffect(() => {
        if (serverStatus === 'connected' && !projectStructure && !loading) handleFetchStructure();
    }, [serverStatus, projectStructure, handleFetchStructure, loading]);

    const handleSync = async () => {
        if (selectedPaths.size === 0) return;
        setLoading(true);
        try {
            const response = await fetchViaBackground(`${serverUrl}/selective-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedPaths: Array.from(selectedPaths) })
            });

            if (!response.success) throw new Error(response.error);
            let content = response.data;

            if (removeComments) {
                content = content.split('STARTOFFILE:').map((part, i) => {
                    if (i === 0) return part;
                    const lines = part.split('\n');
                    const header = lines[0]; 
                    const bodyAndFooter = lines.slice(1).join('\n');
                    const marker = '----------------------------------------\nENDOFFILE:';
                    const [body, ...footerParts] = bodyAndFooter.split(marker);
                    
                    const cleanedBody = processCode(body, { 
                        removeComments: true, 
                        removeEmptyLines, 
                        removeLogs 
                    });

                    return `${header}\n${cleanedBody}\n${marker}${footerParts.join(marker)}`;
                }).join('STARTOFFILE:');
            }

            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            if (!activeTab) throw new Error('Aba não encontrada');

            const isGemini = activeTab.url.includes('gemini.google.com');
            await chrome.tabs.sendMessage(activeTab.id, {
                type: isGemini ? 'ADD_FILE_GEMINI' : 'ADD_FILE',
                fileName: 'codemerge-selected.txt',
                content: content
            });

            showNotification(`Sincronizado!`, 'success');
        } catch (error) {
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const statusProps = {
        connected: { color: 'success.main', borderColor: '#4caf50', borderAnimation: `${pulseGreen} 3s infinite` },
        disconnected: { color: 'error.main', borderColor: '#f44336', borderAnimation: `${pulseRed} 2s infinite` },
        checking: { color: 'warning.main', borderColor: '#ed6c02', borderAnimation: `${pulseOrange} 1.5s infinite` }
    }[isChecking ? 'checking' : serverStatus] || { color: 'text.disabled' };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">URL do Servidor</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField fullWidth size="small" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)}
                        InputProps={{ endAdornment: <InputAdornment position="end"><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: statusProps.color }} /></InputAdornment> }}
                        sx={{ '& .MuiOutlinedInput-root': { animation: statusProps.borderAnimation, '& fieldset': { borderColor: statusProps.borderColor } } }}
                    />
                    <Button variant="outlined" onClick={handleFetchStructure} disabled={loading || isChecking || serverStatus !== 'connected'} sx={{ minWidth: 'auto', px: 2 }}>
                        {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                    </Button>
                </Box>
            </Box>

            {projectStructure && (
                <>
                    <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mb: 2 }}>
                        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
                            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                            <input style={{ border: 'none', outline: 'none', flexGrow: 1, background: 'transparent', color: 'inherit', fontSize: '0.875rem' }}
                                placeholder="Filtrar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Tooltip title={removeComments ? "Limpeza ativa" : "Limpeza inativa"}>
                                <IconButton size="small" onClick={() => setRemoveComments(!removeComments)} color={removeComments ? "primary" : "default"} sx={{ ml: 1 }}>
                                    {removeComments ? <CodeOffIcon fontSize="small" /> : <CodeIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                            <IconButton size="small" onClick={() => setPersistSelection(!persistSelection)} color={persistSelection ? "primary" : "default"}>
                                {persistSelection ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                            </IconButton>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                            <FileTreeItem node={projectStructure} selectedPaths={selectedPaths} onToggleSelection={(n, s) => {
                                const collect = (node) => {
                                    let p = []; if (node.type === 'file') p.push(node.path);
                                    if (node.children) node.children.forEach(c => p = [...p, ...collect(c)]);
                                    return p;
                                };
                                const target = collect(n);
                                const next = new Set(selectedPaths);
                                target.forEach(p => s ? next.add(p) : next.delete(p));
                                setProjectSelection(projectId, Array.from(next));
                            }} searchTerm={searchTerm} />
                        </Box>
                    </Paper>
                    <Button variant="contained" onClick={handleSync} disabled={loading || selectedPaths.size === 0 || serverStatus !== 'connected'} fullWidth startIcon={<CloudUploadIcon />}>
                        Sincronizar Selecionados
                    </Button>
                </>
            )}
            <Snackbar open={message.open} autoHideDuration={1000} onClose={() => setMessage({ ...message, open: false })}><Alert severity={message.type}>{message.text}</Alert></Snackbar>
        </Box>
    );
};

export default SyncView;