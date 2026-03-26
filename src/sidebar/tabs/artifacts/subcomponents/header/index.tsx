import { Box, Typography, Button, Tooltip, IconButton, CircularProgress } from '@mui/material';
import { MdChevronRight, MdChevronLeft, MdDownload, MdTerminal, MdCodeOff, MdCode } from 'react-icons/md';

import { getStatusProps, containerStyles, actionsContainerStyles, iconButtonStyles, historyBoxStyles } from './styles';
import type { HookStatus } from '@/sidebar/types';

interface Props { serverStatus: string; isChecking: boolean; handleFetchArtifacts: (s?: boolean) => void; loading: boolean; handleOpenCmdDialog: () => void; removeComments: boolean; setRemoveComments: (v: boolean) => void; historyLength: number; currentHistoryIndex: number; handlePrevHistory: () => void; handleNextHistory: () => void; hookStatus: HookStatus; }

export const Header = ({ serverStatus, isChecking, handleFetchArtifacts, loading, handleOpenCmdDialog, removeComments, setRemoveComments, historyLength, currentHistoryIndex, handlePrevHistory, handleNextHistory, hookStatus }: Props) => {
    const statusProps = getStatusProps(serverStatus, isChecking);
    return (
        <>
            <Box sx={containerStyles}><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusProps.color, animation: statusProps.animation, flexShrink: 0 }} /><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>{statusProps.text}</Typography></Box>
            <Box sx={actionsContainerStyles}>
                {historyLength > 0 && <Box sx={historyBoxStyles}><IconButton size="small" onClick={handlePrevHistory} disabled={currentHistoryIndex <= 0 || loading} sx={{ p: 0.25 }}><MdChevronLeft size={20} /></IconButton><Typography variant="caption" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600, color: 'text.secondary' }}>{currentHistoryIndex + 1}/{historyLength}</Typography><IconButton size="small" onClick={handleNextHistory} disabled={currentHistoryIndex >= historyLength - 1 || loading} sx={{ p: 0.25 }}><MdChevronRight size={20} /></IconButton></Box>}
                <Button variant="outlined" startIcon={<MdDownload size={20} />} onClick={() => handleFetchArtifacts(false)} disabled={loading} fullWidth size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>Buscar</Button>
                <Tooltip title="Output do Comando (Hooks)"><IconButton size="small" onClick={handleOpenCmdDialog} disabled={serverStatus !== 'connected' || hookStatus === 'loading'} sx={iconButtonStyles(false, hookStatus)}>{hookStatus === 'loading' ? <CircularProgress size={16} color="inherit" /> : <MdTerminal size={20} />}</IconButton></Tooltip>
                <Tooltip title={removeComments ? "Limpeza ativa" : "Limpeza inativa"}><IconButton size="small" color={removeComments ? "primary" : "default"} onClick={() => setRemoveComments(!removeComments)} sx={iconButtonStyles(removeComments)}>{removeComments ? <MdCodeOff size={20} /> : <MdCode size={20} />}</IconButton></Tooltip>
            </Box>
        </>
    );
};