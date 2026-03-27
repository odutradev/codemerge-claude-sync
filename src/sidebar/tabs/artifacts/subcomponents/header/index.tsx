import { MdChevronRight, MdChevronLeft, MdDownload, MdTerminal, MdCodeOff, MdCode } from 'react-icons/md';
import { Typography, Button, Tooltip, CircularProgress, IconButton } from '@mui/material';

import { Container, ActionsContainer, HistoryBox, StyledIconButton, PageIndicator } from './styles';
import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator';

import type { HeaderProps } from './types';

const Header = ({ serverStatus, isChecking, handleFetchArtifacts, loading, handleOpenCmdDialog, removeComments, setRemoveComments, historyLength, currentHistoryIndex, handlePrevHistory, handleNextHistory, hookStatus }: HeaderProps) => {
    return (
        <Container>
            <ServerStatusIndicator
                status={serverStatus}
                isChecking={isChecking}
            />

            <ActionsContainer>
                {historyLength > 0 && (
                    <HistoryBox>
                        <IconButton
                            size="small"
                            onClick={handlePrevHistory}
                            disabled={currentHistoryIndex <= 0 || loading}
                        >
                            <MdChevronLeft size={20} />
                        </IconButton>
                        
                        <PageIndicator>
                            {currentHistoryIndex + 1}/{historyLength}
                        </PageIndicator>
                        
                        <IconButton
                            size="small"
                            onClick={handleNextHistory}
                            disabled={currentHistoryIndex >= historyLength - 1 || loading}
                        >
                            <MdChevronRight size={20} />
                        </IconButton>
                    </HistoryBox>
                )}

                <Button
                    variant="outlined"
                    startIcon={<MdDownload size={20} />}
                    onClick={() => handleFetchArtifacts(false)}
                    disabled={loading}
                    fullWidth
                    size="small"
                    style={{ textTransform: 'none', borderRadius: 8 }}
                >
                    Buscar
                </Button>

                <Tooltip title="Output do Comando (Hooks)">
                    <StyledIconButton
                        size="small"
                        onClick={handleOpenCmdDialog}
                        disabled={serverStatus !== 'connected' || hookStatus === 'loading'}
                        isActive={false}
                        hookStatus={hookStatus}
                    >
                        {hookStatus === 'loading'
                            ? <CircularProgress size={16} color="inherit" />
                            : <MdTerminal size={20} />}
                    </StyledIconButton>
                </Tooltip>

                <Tooltip title={removeComments ? 'Limpeza ativa' : 'Limpeza inativa'}>
                    <StyledIconButton
                        size="small"
                        color={removeComments ? 'primary' : 'default'}
                        onClick={() => setRemoveComments(!removeComments)}
                        isActive={removeComments}
                    >
                        {removeComments
                            ? <MdCodeOff size={20} />
                            : <MdCode size={20} />}
                    </StyledIconButton>
                </Tooltip>
            </ActionsContainer>
        </Container>
    );
};

export default Header;