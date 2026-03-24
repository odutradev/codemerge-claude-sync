import { Box, Typography, Button, List, ListItem, Checkbox, Paper, CircularProgress, TextField, IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeselectIcon from '@mui/icons-material/Deselect';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';

import { paperStyles, headerBoxStyles, clearBtnStyles, listItemStyles, deleteListItemStyles, emptyBoxStyles } from './styles';
import FileIcon from '../../../../components/fileIcon';

export const ArtifactList = ({ fetching, artifacts, filesToDelete, selectedIndices, selectedDeletions, toggleSelection, toggleDeleteSelection, handleDeselectAll, handleApplyAll, actionLoading, serverStatus, commitMessage, setCommitMessage, originalCommitMessage }) => {
    if (fetching) return <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={24} /></Box>;

    const totalItems = artifacts.length + filesToDelete.length;
    const totalSelected = selectedIndices.size + selectedDeletions.size;
    const hasActions = totalSelected > 0 || commitMessage.trim().length > 0;

    if (totalItems === 0 && !commitMessage) {
        return (
            <Box sx={emptyBoxStyles}>
                <DeselectIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">Nenhum artefato ou ação pendente</Typography>
            </Box>
        );
    }

    return (
        <>
            <Paper elevation={0} variant="outlined" sx={paperStyles}>
                <Box sx={headerBoxStyles}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {totalItems} ARQUIVOS ({filesToDelete.length} PARA APAGAR)
                    </Typography>
                    <Button size="small" onClick={handleDeselectAll} disabled={totalSelected === 0 || actionLoading} sx={clearBtnStyles}>
                        Limpar Seleção
                    </Button>
                </Box>
                <List sx={{ p: 1, overflowY: 'auto', flexGrow: 1 }}>
                    {filesToDelete.map((path) => (
                        <ListItem key={`del-${path}`} button onClick={() => toggleDeleteSelection(path)} sx={deleteListItemStyles(selectedDeletions.has(path))}>
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, width: '100%' }}>
                                <Checkbox checked={selectedDeletions.has(path)} size="small" sx={{ p: 0.5, mr: 1.5, color: 'error.main', '&.Mui-checked': { color: 'error.main' } }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, color: 'error.main', width: 24, height: 24 }}>
                                    <FileIcon fileName={path} />
                                </Box>
                                <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
                                    <Typography variant="body2" noWrap sx={{ color: 'error.main', fontWeight: 500, textDecoration: selectedDeletions.has(path) ? 'line-through' : 'none' }}>
                                        {path}
                                    </Typography>
                                </Box>
                                <DeleteIcon sx={{ fontSize: 16, color: 'error.main', opacity: 0.7 }} />
                            </Box>
                        </ListItem>
                    ))}
                    {artifacts.map((artifact, index) => (
                        <ListItem key={`art-${index}`} button onClick={() => toggleSelection(index)} sx={listItemStyles(selectedIndices.has(index))}>
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, width: '100%' }}>
                                <Checkbox checked={selectedIndices.has(index)} size="small" sx={{ p: 0.5, mr: 1.5 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, color: 'text.secondary', width: 24, height: 24 }}>
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
                {(originalCommitMessage || commitMessage) && (
                    <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>MENSAGEM DE COMMIT</Typography>
                            <IconButton size="small" onClick={() => setCommitMessage(originalCommitMessage)} disabled={commitMessage === originalCommitMessage || actionLoading}>
                                <RestartAltIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            disabled={actionLoading}
                            size="small"
                            sx={{ '& .MuiInputBase-root': { fontSize: '0.85rem', fontFamily: 'monospace' } }}
                        />
                    </Box>
                )}
            </Paper>
            <Button variant="contained" onClick={handleApplyAll} disabled={actionLoading || !hasActions || serverStatus !== 'connected'} fullWidth disableElevation startIcon={<UploadIcon />} sx={{ textTransform: 'none', py: 1, borderRadius: 2 }}>
                Aplicar Alterações
            </Button>
        </>
    );
};