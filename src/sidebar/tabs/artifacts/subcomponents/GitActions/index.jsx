import { Box, TextField, Button, Typography, Chip, Collapse } from '@mui/material';
import CommitIcon from '@mui/icons-material/Commit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

import { chipContainerStyles, sectionStyles, containerStyles } from './styles';

export const GitActions = ({ commitMessage, setCommitMessage, handleCommit, filesToDelete, handleDeleteFiles, actionLoading, serverStatus }) => {
    const hasCommit = commitMessage.length > 0;
    const hasFiles = filesToDelete.length > 0;
    const disabled = serverStatus !== 'connected' || actionLoading;

    if (!hasCommit && !hasFiles) return null;

    return (
        <Box sx={containerStyles}>
            <Collapse in={hasFiles}>
                <Box sx={sectionStyles}>
                    <Typography variant="caption" color="error.main" fontWeight="bold">Arquivos para Remoção ({filesToDelete.length})</Typography>
                    <Box sx={chipContainerStyles}>
                        {filesToDelete.map((file, idx) => (
                            <Chip key={idx} label={file} size="small" color="error" variant="outlined" />
                        ))}
                    </Box>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteFiles} disabled={disabled} size="small" fullWidth sx={{ mt: 1 }}>
                        Apagar Arquivos
                    </Button>
                </Box>
            </Collapse>
            <Collapse in={hasCommit}>
                <Box sx={sectionStyles}>
                    <Typography variant="caption" color="primary.main" fontWeight="bold">Mensagem de Commit</Typography>
                    <TextField size="small" fullWidth value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} disabled={disabled} placeholder="feat: update something" sx={{ mt: 1, mb: 1 }} />
                    <Button variant="contained" color="primary" startIcon={<CommitIcon />} onClick={handleCommit} disabled={disabled || !commitMessage.trim()} size="small" fullWidth disableElevation>
                        Commitar Alterações
                    </Button>
                </Box>
            </Collapse>
        </Box>
    );
};