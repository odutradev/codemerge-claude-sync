import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, IconButton, CircularProgress, Alert, Button } from '@mui/material';
import { MdRefresh, MdTerminal, MdClose, MdInput } from 'react-icons/md';

import { dialogTitleStyles, loaderContainerStyles, infoGridStyles, codeBoxStyles } from './styles';
import { renderAnsi } from './ansi';

export const CommandDialog = ({ cmdDialogOpen, setCmdDialogOpen, cmdLoading, cmdOutput, handleFetchCommandOutput, handleInjectOutput }) => (
    <Dialog open={cmdDialogOpen} onClose={() => setCmdDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={dialogTitleStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component={MdTerminal} sx={{ color: 'primary.main', fontSize: 24 }} />
                <Typography variant="h6">{cmdOutput?.type === 'commit' ? 'Output do Commit' : 'Output do Comando'}</Typography>
            </Box>
            <IconButton size="small" onClick={() => setCmdDialogOpen(false)}>
                <MdClose size={20} />
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
        {cmdOutput?.type !== 'commit' && (
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button startIcon={<MdRefresh size={20} />} onClick={handleFetchCommandOutput} disabled={cmdLoading}>Atualizar</Button>
                <Button variant="contained" startIcon={<MdInput size={20} />} onClick={handleInjectOutput} disabled={cmdLoading || !cmdOutput || cmdOutput.status === 'no_command_executed'} disableElevation>Inserir no Chat</Button>
            </DialogActions>
        )}
    </Dialog>
);