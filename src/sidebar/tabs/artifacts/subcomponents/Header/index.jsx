import { Box, Typography, Button, Tooltip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import TerminalIcon from '@mui/icons-material/Terminal';
import CodeIcon from '@mui/icons-material/Code';
import React from 'react';

import { getStatusProps, containerStyles, actionsContainerStyles, iconButtonStyles } from './styles';

export const Header = ({ serverStatus, isChecking, handleFetchArtifacts, loading, handleOpenCmdDialog, removeComments, setRemoveComments }) => {
    const statusProps = getStatusProps(serverStatus, isChecking);

    return (
        <>
            <Box sx={containerStyles}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusProps.color, animation: statusProps.animation, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {statusProps.text}
                </Typography>
            </Box>

            <Box sx={actionsContainerStyles}>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => handleFetchArtifacts(false)} disabled={loading} fullWidth size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
                    Buscar
                </Button>

                <Tooltip title="Output do Comando (Hooks)">
                    <IconButton size="small" onClick={handleOpenCmdDialog} disabled={serverStatus !== 'connected'} sx={iconButtonStyles(false)}>
                        <TerminalIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title={removeComments ? "Limpeza ativa" : "Limpeza inativa"}>
                    <IconButton size="small" color={removeComments ? "primary" : "default"} onClick={() => setRemoveComments(!removeComments)} sx={iconButtonStyles(removeComments)}>
                        {removeComments ? <CodeOffIcon fontSize="small" /> : <CodeIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Box>
        </>
    );
};