import { Typography, IconButton, CircularProgress, Alert, Button, Box, DialogContent } from '@mui/material';
import { MdRefresh, MdTerminal, MdClose, MdInput } from 'react-icons/md';

import { StyledDialog, StyledDialogTitle, TitleContent, IconWrapper, LoaderContainer, InfoGrid, CodeBox, StyledDialogActions, CommandText } from './styles';
import { renderAnsi } from './ansi';

export const CommandDialog = ({ cmdDialogOpen, setCmdDialogOpen, cmdLoading, cmdOutput, handleFetchCommandOutput, handleInjectOutput }) => (
    <StyledDialog open={cmdDialogOpen} onClose={() => setCmdDialogOpen(false)} maxWidth="md" fullWidth>
        <StyledDialogTitle>
            <TitleContent>
                <IconWrapper><MdTerminal /></IconWrapper>
                <Typography variant="h6">{cmdOutput?.type === 'commit' ? 'Output do Commit' : 'Output do Comando'}</Typography>
            </TitleContent>
            <IconButton size="small" onClick={() => setCmdDialogOpen(false)}>
                <MdClose size={20} />
            </IconButton>
        </StyledDialogTitle>
        <DialogContent dividers>
            {cmdLoading ? (
                <LoaderContainer><CircularProgress /></LoaderContainer>
            ) : (
                <Box>
                    {cmdOutput?.status === 'no_command_executed' ? (
                        <Alert severity="info" variant="outlined">Nenhum comando configurado ou executado recentemente.</Alert>
                    ) : (
                        <>
                            <InfoGrid>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Comando</Typography>
                                    <CommandText variant="body2">{cmdOutput?.command ?? '-'}</CommandText>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Horário</Typography>
                                    <Typography variant="body2">{cmdOutput?.timestamp ? new Date(cmdOutput.timestamp).toLocaleTimeString() : '-'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Status</Typography>
                                    <Typography variant="body2" color={cmdOutput?.success ? 'success.main' : 'error.main'} fontWeight="bold">{cmdOutput?.success ? 'SUCESSO' : 'ERRO'}</Typography>
                                </Box>
                            </InfoGrid>
                            <CodeBox>{renderAnsi(cmdOutput?.output ?? cmdOutput?.error ?? '')}</CodeBox>
                        </>
                    )}
                </Box>
            )}
        </DialogContent>
        {cmdOutput?.type !== 'commit' && (
            <StyledDialogActions>
                <Button startIcon={<MdRefresh size={20} />} onClick={handleFetchCommandOutput} disabled={cmdLoading}>Atualizar</Button>
                <Button variant="contained" startIcon={<MdInput size={20} />} onClick={handleInjectOutput} disabled={cmdLoading || !cmdOutput || cmdOutput.status === 'no_command_executed'} disableElevation>Inserir no Chat</Button>
            </StyledDialogActions>
        )}
    </StyledDialog>
);