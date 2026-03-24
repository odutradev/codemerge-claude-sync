import { Box, Typography, Button, List, ListItem, Checkbox, Paper, CircularProgress } from '@mui/material';
import DeselectIcon from '@mui/icons-material/Deselect';
import UploadIcon from '@mui/icons-material/Upload';
import React from 'react';

import { paperStyles, headerBoxStyles, clearBtnStyles, listItemStyles, emptyBoxStyles } from './styles';
import FileIcon from '../../../../components/fileIcon';

export const ArtifactList = ({ fetching, artifacts, selectedIndices, toggleSelection, handleDeselectAll, handleSync, loading, serverStatus }) => {
    if (fetching) return <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={24} /></Box>;

    if (artifacts.length === 0) {
        return (
            <Box sx={emptyBoxStyles}>
                <DeselectIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">Nenhum artefato encontrado</Typography>
            </Box>
        );
    }

    return (
        <>
            <Paper elevation={0} variant="outlined" sx={paperStyles}>
                <Box sx={headerBoxStyles}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {artifacts.length} ARQUIVOS
                    </Typography>
                    <Button size="small" onClick={handleDeselectAll} disabled={selectedIndices.size === 0} sx={clearBtnStyles}>
                        Limpar
                    </Button>
                </Box>
                <List sx={{ p: 1, overflowY: 'auto', flexGrow: 1 }}>
                    {artifacts.map((artifact, index) => (
                        <ListItem key={index} button onClick={() => toggleSelection(index)} sx={listItemStyles(selectedIndices.has(index))}>
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
            </Paper>
            <Button variant="contained" onClick={handleSync} disabled={loading || selectedIndices.size === 0 || serverStatus !== 'connected'} fullWidth disableElevation startIcon={<UploadIcon />} sx={{ textTransform: 'none', py: 1, borderRadius: 2 }}>
                Sincronizar ({selectedIndices.size})
            </Button>
        </>
    );
};