import { MdChevronRight, MdChevronLeft, MdDownload, MdTerminal, MdCodeOff, MdCode } from 'react-icons/md';
import { Box, Typography, Button, Tooltip, IconButton, CircularProgress } from '@mui/material';

import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator';
import { containerStyles, actionsContainerStyles, historyBoxStyles, iconButtonStyles } from './styles';

import type { HeaderProps } from './types';

export const Header = ({ serverStatus, isChecking, handleFetchArtifacts, loading, handleOpenCmdDialog, removeComments, setRemoveComments, historyLength, currentHistoryIndex, handlePrevHistory, handleNextHistory, hookStatus }: HeaderProps) => {
    return (
        <Box sx={containerStyles}>
            <ServerStatusIndicator status={serverStatus} isChecking={isChecking} />

            <Box sx={actionsContainerStyles}>
                {historyLength > 0 && (
                    <Box sx={historyBoxStyles}>
                        <IconButton
                            size="small"
                            onClick={handlePrevHistory}
                            disabled={currentHistoryIndex <= 0 || loading}
                            sx={{ p: 0.25 }}
                        >
                            <MdChevronLeft size={20} />
                        </IconButton>
                        <Typography
                            variant="caption"
                            sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600, color: 'text.secondary' }}
                        >
                            {currentHistoryIndex + 1}/{historyLength}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={handleNextHistory}
                            disabled={currentHistoryIndex >= historyLength - 1 || loading}
                            sx={{ p: 0.25 }}
                        >
                            <MdChevronRight size={20} />
                        </IconButton>
                    </Box>
                )}

                <Button
                    variant="outlined"
                    startIcon={<MdDownload size={20} />}
                    onClick={() => handleFetchArtifacts(false)}
                    disabled={loading}
                    fullWidth
                    size="small"
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Buscar
                </Button>

                <Tooltip title="Output do Comando (Hooks)">
                    <IconButton
                        size="small"
                        onClick={handleOpenCmdDialog}
                        disabled={serverStatus !== 'connected' || hookStatus === 'loading'}
                        sx={iconButtonStyles(false, hookStatus)}
                    >
                        {hookStatus === 'loading' ? <CircularProgress size={16} color="inherit" /> : <MdTerminal size={20} />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={removeComments ? "Limpeza ativa" : "Limpeza inativa"}>
                    <IconButton
                        size="small"
                        color={removeComments ? "primary" : "default"}
                        onClick={() => setRemoveComments(!removeComments)}
                        sx={iconButtonStyles(removeComments)}
                    >
                        {removeComments ? <MdCodeOff size={20} /> : <MdCode size={20} />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};