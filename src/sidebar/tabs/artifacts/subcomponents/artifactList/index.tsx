import { Box, Typography, Button, List, ListItem, Checkbox, Paper, CircularProgress, Tooltip } from '@mui/material';
import { MdDeselect, MdUpload, MdDelete } from 'react-icons/md';

import { paperStyles, headerBoxStyles, clearBtnStyles, listItemStyles, deleteListItemStyles, emptyBoxStyles } from './styles';
import FileIcon from '@/sidebar/components/fileIcon';
import type { Artifact } from '@/sidebar/types';

interface Props { fetching: boolean; artifacts: Artifact[]; filesToDelete: string[]; selectedIndices: Set<number>; selectedDeletions: Set<string>; toggleSelection: (i: number) => void; toggleDeleteSelection: (p: string) => void; handleDeselectAll: () => void; handleApplyAll: () => void; actionLoading: boolean; serverStatus: string; }

export const ArtifactList = ({ fetching, artifacts, filesToDelete, selectedIndices, selectedDeletions, toggleSelection, toggleDeleteSelection, handleDeselectAll, handleApplyAll, actionLoading, serverStatus }: Props) => {
    if (fetching) return <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={24} /></Box>;
    const totalItems = artifacts.length + filesToDelete.length; const totalSelected = selectedIndices.size + selectedDeletions.size;
    if (totalItems === 0) return <Box sx={emptyBoxStyles}><Box component={MdDeselect} sx={{ fontSize: 40, color: 'text.disabled' }} /><Typography variant="body2" color="text.secondary">Nenhum artefato ou arquivo para apagar</Typography></Box>;
    return (
        <>
            <Paper elevation={0} variant="outlined" sx={paperStyles}>
                <Box sx={headerBoxStyles}><Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>{totalItems} ARQUIVOS ({filesToDelete.length} PARA APAGAR)</Typography><Button size="small" onClick={handleDeselectAll} disabled={totalSelected === 0 || actionLoading} sx={clearBtnStyles}>Limpar Seleção</Button></Box>
                <List sx={{ p: 1, overflowY: 'auto', flexGrow: 1 }}>
                    {filesToDelete.map((path) => (
                        <ListItem key={`del-${path}`} button onClick={() => toggleDeleteSelection(path)} sx={deleteListItemStyles(selectedDeletions.has(path))}><Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, width: '100%' }}><Checkbox checked={selectedDeletions.has(path)} size="small" sx={{ p: 0.5, mr: 1.5, color: 'error.main', '&.Mui-checked': { color: 'error.main' } }} /><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, color: 'error.main', width: 24, height: 24 }}><FileIcon fileName={path} /></Box><Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}><Tooltip title={path} placement="top-start" enterDelay={500}><Typography variant="body2" noWrap sx={{ color: 'error.main', fontWeight: 500, textDecoration: selectedDeletions.has(path) ? 'line-through' : 'none' }}>{path}</Typography></Tooltip></Box><Box component={MdDelete} sx={{ fontSize: 16, color: 'error.main', opacity: 0.7 }} /></Box></ListItem>
                    ))}
                    {artifacts.map((artifact, index) => (
                        <ListItem key={`art-${index}`} button onClick={() => toggleSelection(index)} sx={listItemStyles(selectedIndices.has(index))}><Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, width: '100%' }}><Checkbox checked={selectedIndices.has(index)} size="small" sx={{ p: 0.5, mr: 1.5 }} /><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, color: 'text.secondary', width: 24, height: 24 }}><FileIcon fileName={artifact.name} /></Box><Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}><Tooltip title={artifact.name} placement="top-start" enterDelay={500}><Typography variant="body2" noWrap sx={{ color: 'text.primary', fontWeight: 500 }}>{artifact.name}</Typography></Tooltip></Box><Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', opacity: 0.7 }}>{artifact.code.split('\n').length}</Typography></Box></ListItem>
                    ))}
                </List>
            </Paper>
            <Button variant="contained" onClick={handleApplyAll} disabled={actionLoading || totalSelected === 0 || serverStatus !== 'connected'} fullWidth disableElevation startIcon={<MdUpload size={20} />} sx={{ textTransform: 'none', py: 1, borderRadius: 2 }}>Aplicar Sincronização</Button>
        </>
    );
};