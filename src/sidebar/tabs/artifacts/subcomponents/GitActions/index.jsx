import { Box, Typography, Button, TextField, Paper, IconButton, Select, MenuItem, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TranslateIcon from '@mui/icons-material/Translate';
import { useState, useEffect, useMemo } from 'react';
import CommitIcon from '@mui/icons-material/Commit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';

import FileTreeItem from '../../../sync/subcomponents/filetreeItem';
import { buildTreeFromPaths } from '../../../../utils/treeBuilder';

const COMMIT_TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];

export const GitActions = ({
    commitType,
    setCommitType,
    translateCommit,
    setTranslateCommit,
    commitMessage,
    setCommitMessage,
    originalCommitMessage,
    originalCommitType,
    handleCommit,
    filesToDelete,
    handleDeleteFiles,
    actionLoading,
    serverStatus
}) => {
    const [selectedPaths, setSelectedPaths] = useState(new Set());
    const [expandedPaths, setExpandedPaths] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setSelectedPaths(new Set(filesToDelete));
        setExpandedPaths(new Set());
    }, [filesToDelete]);

    const treeRoot = useMemo(() => buildTreeFromPaths(filesToDelete), [filesToDelete]);

    const handleToggleSelection = (node, shouldSelect) => {
        const collect = (n) => {
            let p = [];
            if (n.type === 'file') p.push(n.path);
            if (n.children) n.children.forEach(c => p = [...p, ...collect(c)]);
            return p;
        };
        const target = collect(node);
        const next = new Set(selectedPaths);
        target.forEach(p => shouldSelect ? next.add(p) : next.delete(p));
        setSelectedPaths(next);
    };

    const handleToggleExpansion = (path) => {
        const next = new Set(expandedPaths);
        next.has(path) ? next.delete(path) : next.add(path);
        setExpandedPaths(next);
    };

    const handleClearSelection = () => setSelectedPaths(new Set());
    const handleResetCommit = () => { setCommitMessage(originalCommitMessage); setCommitType(originalCommitType); };

    if (!filesToDelete.length && !commitMessage && !originalCommitMessage) return null;

    return (
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {(originalCommitMessage || commitMessage) && (
                <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>MENSAGEM DE COMMIT</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <Select size="small" value={commitType} onChange={(e) => setCommitType(e.target.value)} disabled={actionLoading} sx={{ height: 28, fontSize: '0.75rem', fontFamily: 'monospace', mr: 0.5 }}>
                                {COMMIT_TYPES.map(type => <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{type}</MenuItem>)}
                            </Select>
                            <Tooltip title={translateCommit ? 'Tradução Automática: Ativada' : 'Tradução Automática: Desativada'}>
                                <IconButton size="small" onClick={() => setTranslateCommit(!translateCommit)} color={translateCommit ? 'primary' : 'default'} disabled={actionLoading}>
                                    <TranslateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Restaurar Mensagem Original">
                                <IconButton size="small" onClick={handleResetCommit} disabled={(commitMessage === originalCommitMessage && commitType === originalCommitType) || actionLoading}>
                                    <RestartAltIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={5}
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        disabled={actionLoading}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.85rem', fontFamily: 'monospace' } }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleCommit}
                        disabled={actionLoading || !commitMessage.trim() || serverStatus !== 'connected'}
                        startIcon={<CommitIcon />}
                        fullWidth
                        disableElevation
                        sx={{ textTransform: 'none' }}
                    >
                        Commitar Alterações
                    </Button>
                </Paper>
            )}

            {filesToDelete.length > 0 && (
                <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main' }}>
                            DELETAR ARQUIVOS ({selectedPaths.size}/{filesToDelete.length})
                        </Typography>
                        <Button size="small" onClick={handleClearSelection} disabled={selectedPaths.size === 0 || actionLoading} sx={{ fontSize: '0.7rem', minWidth: 'auto', p: 0, textTransform: 'none', color: 'text.secondary' }}>
                            Limpar
                        </Button>
                    </Box>
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                        <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
                        <input
                            style={{ border: 'none', outline: 'none', flexGrow: 1, background: 'transparent', color: 'inherit', fontSize: '0.8rem' }}
                            placeholder="Filtrar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ maxHeight: 200, overflow: 'auto', p: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.1), borderRadius: '3px' } }}>
                        {treeRoot.children.map(child => (
                            <FileTreeItem
                                key={child.path}
                                node={child}
                                selectedPaths={selectedPaths}
                                expandedPaths={expandedPaths}
                                onToggleSelection={handleToggleSelection}
                                onToggleExpansion={handleToggleExpansion}
                                searchTerm={searchTerm}
                            />
                        ))}
                    </Box>
                    <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteFiles(Array.from(selectedPaths))}
                            disabled={actionLoading || selectedPaths.size === 0 || serverStatus !== 'connected'}
                            startIcon={<DeleteIcon />}
                            fullWidth
                            disableElevation
                            sx={{ textTransform: 'none' }}
                        >
                            Apagar Selecionados
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};