import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, IconButton, CircularProgress, Alert, Button } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import InputIcon from '@mui/icons-material/Input';

import { dialogTitleStyles, loaderContainerStyles, infoGridStyles, codeBoxStyles } from './styles';
import { renderAnsi } from '../../../../utils/ansi';

export const CommandDialog = ({ cmdDialogOpen, setCmdDialogOpen, cmdLoading, cmdOutput, handleFetchCommandOutput, handleInjectOutput }) => (
    <Dialog open={cmdDialogOpen} onClose={() => setCmdDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={dialogTitleStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TerminalIcon color="primary" />
                <Typography variant="h6">Output do Comando</Typography>
            </Box>
            <IconButton size="small" onClick={() => setCmdDialogOpen(false)}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            {cmdLoading ? (
                <Box sx={loaderContainerStyles}><CircularProgress /></Box>
            ) : (
                <Box>
                    {cmdOutput?.status === 'no_command_executed' ? (
                        <Alert severity="info" variant="outlined">Nenhum comando configurado ou executado recentemente.</Alert>
                    ) : (
                        <>
                            <Box sx={infoGridStyles}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Comando</Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, borderRadius: 1 }}>{cmdOutput?.command ?? '-'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Horário</Typography>
                                    <Typography variant="body2">{cmdOutput?.timestamp ? new Date(cmdOutput.timestamp).toLocaleTimeString() : '-'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Status</Typography>
                                    <Typography variant="body2" color={cmdOutput?.success ? 'success.main' : 'error.main'} fontWeight="bold">{cmdOutput?.success ? 'SUCESSO' : 'ERRO'}</Typography>
                                </Box>
                            </Box>
                            <Box sx={codeBoxStyles}>{renderAnsi(cmdOutput?.output ?? cmdOutput?.error ?? '')}</Box>
                        </>
                    )}
                </Box>
            )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
            <Button startIcon={<RefreshIcon />} onClick={handleFetchCommandOutput} disabled={cmdLoading}>Atualizar</Button>
            <Button variant="contained" startIcon={<InputIcon />} onClick={handleInjectOutput} disabled={cmdLoading || !cmdOutput || cmdOutput.status === 'no_command_executed'} disableElevation>Inserir no Chat</Button>
        </DialogActions>
    </Dialog>
);