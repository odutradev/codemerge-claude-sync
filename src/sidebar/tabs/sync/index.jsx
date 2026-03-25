import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert, Snackbar, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { PushPinOutlined, FormatAlignLeft, InsertDriveFile, ContentCopy, CloudUpload, AccessTime, PushPin, Refresh, Search, Star } from '@mui/icons-material';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { keyframes, alpha } from '@mui/material/styles';

import FileTreeItem from './subcomponents/filetreeItem/index.jsx';
import useSelectionStore from '../../store/selectionStore.js';
import useConfigStore from '../../store/configStore.js';
import { processCode } from '../../utils/codeProcessor.js';

const pulseGreen = keyframes`0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); } 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }`;
const pulseRed = keyframes`0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }`;
const pulseOrange = keyframes`0% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(237, 108, 2, 0); } 100% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0); }`;

const flattenStructure = (node) => [...(node.type === 'file' ? [node] : []), ...(node.children ? node.children.flatMap(flattenStructure) : [])];

const SyncView = ({ fetchViaBackground }) => {
    const { serverUrl, checkInterval, setServerUrl, verbosity, persistSelection, setPersistSelection, removeComments, removeEmptyLines, removeLogs } = useConfigStore();
    const { selections, expansions, pinned, setProjectSelection, hasStoredSelection, toggleExpansion, togglePin } = useSelectionStore();

    const [projectStructure, setProjectStructure] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });
    const [serverStatus, setServerStatus] = useState('checking');
    const [isChecking, setIsChecking] = useState(false);
    const [lastTreeFetchTime, setLastTreeFetchTime] = useState(null);
    const [isCopyMode, setIsCopyMode] = useState(false);

    const selectedPaths = useMemo(() => projectId ? new Set(selections[projectId] || []) : new Set(), [selections, projectId]);
    const expandedPaths = useMemo(() => projectId ? new Set(expansions[projectId] || []) : new Set(), [expansions, projectId]);
    const pinnedPaths = useMemo(() => projectId ? new Set(pinned[projectId] || []) : new Set(), [pinned, projectId]);

    const stats = useMemo(() => {
        if (!projectStructure || !projectId) return { files: 0, lines: 0, lastUpdate: '-' };
        const allFiles = flattenStructure(projectStructure);
        const fileMap = allFiles.reduce((acc, file) => ({ ...acc, [file.path]: file.lines || 0 }), {});
        const selectedList = Array.from(selectedPaths);
        const filesCount = selectedList.length;
        const totalLines = selectedList.reduce((sum, path) => sum + (fileMap[path] || 0), 0);
        const lastUpdate = lastTreeFetchTime ? new Date(lastTreeFetchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
        return { files: filesCount, lines: totalLines, lastUpdate };
    }, [projectStructure, selectedPaths, projectId, lastTreeFetchTime]);

    const showNotification = useCallback((text, type = 'info') => {
        if (verbosity === 'silent') return;
        if (verbosity === 'errors' && type !== 'error') return;
        setMessage({ open: true, text, type });
    }, [verbosity]);

    const handleCopyPath = useCallback((path) => {
        const formattedPath = `{${path}}`;
        navigator.clipboard.writeText(formattedPath);
        showNotification(`Caminho copiado: ${formattedPath}`, 'success');
    }, [showNotification]);

    const handleToggleSelection = useCallback((node, shouldSelect) => {
        const collect = (n) => [...(n.type === 'file' ? [n.path] : []), ...(n.children ? n.children.flatMap(collect) : [])];
        const target = collect(node);
        const next = new Set(selectedPaths);
        target.forEach(p => {
            if (shouldSelect) {
                next.add(p);
            } else {
                if (node.type === 'file' && node.path === p) {
                    next.delete(p);
                    if (pinnedPaths.has(p)) togglePin(projectId, p);
                } else if (!pinnedPaths.has(p)) {
                    next.delete(p);
                }
            }
        });
        setProjectSelection(projectId, Array.from(next));
    }, [selectedPaths, projectId, setProjectSelection, pinnedPaths, togglePin]);

    const handleTogglePin = useCallback((path) => {
        if (!projectId) return;
        const isPinning = !pinnedPaths.has(path);
        togglePin(projectId, path);
        if (isPinning && !selectedPaths.has(path)) {
            const next = new Set(selectedPaths);
            next.add(path);
            setProjectSelection(projectId, Array.from(next));
        }
    }, [projectId, togglePin, pinnedPaths, selectedPaths, setProjectSelection]);

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => {
            if (!serverUrl) return;
            if (isMounted) setIsChecking(true);
            try {
                const response = await fetchViaBackground(`${serverUrl}/health`);
                if (isMounted) setServerStatus(response.success ? 'connected' : 'disconnected');
            } catch {
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
            setLastTreeFetchTime(Date.now());
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
                content = content.split('----------------------------------------\nENDOFFILE:').map((part, i) => {
                    if (i === 0) return part;
                    const lines = part.split('\n');
                    const header = lines[0];
                    const bodyAndFooter = lines.slice(1).join('\n');
                    const marker = '----------------------------------------\nENDOFFILE:';
                    const parts = bodyAndFooter.split(marker);
                    const body = parts[0];
                    const footer = parts.slice(1).join(marker);
                    const cleanedBody = processCode(body, { removeComments: true, removeEmptyLines, removeLogs });
                    return `${header}\n${cleanedBody}\n${marker}${footer}`;
                }).join('----------------------------------------\nENDOFFILE:');
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
                        {loading ? <CircularProgress size={20} /> : <Refresh />}
                    </Button>
                </Box>
            </Box>

            {projectStructure && (
                <>
                    <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mb: 2 }}>
                        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
                            <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                            <input style={{ border: 'none', outline: 'none', flexGrow: 1, background: 'transparent', color: 'inherit', fontSize: '0.875rem' }}
                                placeholder="Filtrar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Tooltip title={isCopyMode ? "Modo de cópia ativado" : "Ativar modo de cópia de caminho"}>
                                <IconButton size="small" onClick={() => setIsCopyMode(!isCopyMode)} color={isCopyMode ? "primary" : "default"}>
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={persistSelection ? "Manter seleção ativa" : "Manter seleção inativa"}>
                                <IconButton size="small" onClick={() => setPersistSelection(!persistSelection)} color={persistSelection ? "primary" : "default"}>
                                    {persistSelection ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ flexGrow: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: '6px', height: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.1), borderRadius: '3px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.2) } }}>
                            <FileTreeItem
                                node={projectStructure}
                                selectedPaths={selectedPaths}
                                expandedPaths={expandedPaths}
                                pinnedPaths={pinnedPaths}
                                isCopyMode={isCopyMode}
                                onCopyPath={handleCopyPath}
                                onToggleSelection={handleToggleSelection}
                                onToggleExpansion={(path) => toggleExpansion(projectId, path)}
                                onTogglePin={handleTogglePin}
                                searchTerm={searchTerm}
                            />
                        </Box>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 1, mb: 2, bgcolor: 'background.paper', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Tooltip title="Arquivos selecionados">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <InsertDriveFile sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{stats.files}</Typography>
                                    </Box>
                                </Tooltip>
                                <Tooltip title="Total de linhas">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <FormatAlignLeft sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{stats.lines}</Typography>
                                    </Box>
                                </Tooltip>
                                <Tooltip title="Favoritos">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Star sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{pinnedPaths.size}</Typography>
                                    </Box>
                                </Tooltip>
                            </Box>
                            <Tooltip title="Última atualização da árvore">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">{stats.lastUpdate}</Typography>
                                </Box>
                            </Tooltip>
                        </Box>
                    </Paper>

                    <Button variant="contained" onClick={handleSync} disabled={loading || selectedPaths.size === 0 || serverStatus !== 'connected'} fullWidth startIcon={<CloudUpload />}>
                        Sincronizar Selecionados
                    </Button>
                </>
            )}
            <Snackbar open={message.open} autoHideDuration={1000} onClose={() => setMessage({ ...message, open: false })}><Alert severity={message.type}>{message.text}</Alert></Snackbar>
        </Box>
    );
};

export default SyncView;