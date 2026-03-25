import { Box, Typography, Button, Tooltip, IconButton, CircularProgress } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DownloadIcon from '@mui/icons-material/Download';
import TerminalIcon from '@mui/icons-material/Terminal';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import CodeIcon from '@mui/icons-material/Code';

import { getStatusProps, containerStyles, actionsContainerStyles, iconButtonStyles, historyBoxStyles } from './styles';

export const Header = ({ serverStatus, isChecking, handleFetchArtifacts, loading, handleOpenCmdDialog, removeComments, setRemoveComments, historyLength, currentHistoryIndex, handlePrevHistory, handleNextHistory, hookStatus }) => {
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
                {historyLength > 0 && (
                    <Box sx={historyBoxStyles}>
                        <IconButton size="small" onClick={handlePrevHistory} disabled={currentHistoryIndex <= 0 || loading} sx={{ p: 0.25 }}>
                            <ChevronLeftIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600, color: 'text.secondary' }}>
                            {currentHistoryIndex + 1}/{historyLength}
                        </Typography>
                        <IconButton size="small" onClick={handleNextHistory} disabled={currentHistoryIndex >= historyLength - 1 || loading} sx={{ p: 0.25 }}>
                            <ChevronRightIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}

                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => handleFetchArtifacts(false)} disabled={loading} fullWidth size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
                    Buscar
                </Button>

                <Tooltip title="Output do Comando (Hooks)">
                    <IconButton size="small" onClick={handleOpenCmdDialog} disabled={serverStatus !== 'connected' || hookStatus === 'loading'} sx={iconButtonStyles(false, hookStatus)}>
                        {hookStatus === 'loading' ? <CircularProgress size={16} color="inherit" /> : <TerminalIcon fontSize="small" />}
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