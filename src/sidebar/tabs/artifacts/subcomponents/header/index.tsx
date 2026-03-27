import { MdChevronRight, MdChevronLeft, MdDownload, MdTerminal, MdCodeOff, MdCode } from 'react-icons/md'
import { IconButton } from '@mui/material'

import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import ActionButton from '@/sidebar/components/actionButton'
import { Container, ActionsContainer, HistoryBox, PageIndicator } from './styles'

import type { HeaderProps } from './types'

const Header = ({ serverStatus, isChecking, handleFetchArtifacts, loading, handleOpenCmdDialog, removeComments, setRemoveComments, historyLength, currentHistoryIndex, handlePrevHistory, handleNextHistory, hookStatus }: HeaderProps) => {
    const getHookPulse = () => {
        if (hookStatus === 'success') return 'success'
        if (hookStatus === 'error') return 'error'
        return 'none'
    }

    const getHookColor = () => {
        if (hookStatus === 'success') return 'success'
        if (hookStatus === 'error') return 'error'
        return 'inherit'
    }

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

                <ActionButton
                    variant="outlined"
                    icon={<MdDownload size={20} />}
                    onClick={() => handleFetchArtifacts(false)}
                    disabled={loading}
                    fullWidth
                    size="small"
                >
                    Buscar
                </ActionButton>

                <ActionButton
                    variant="outlined"
                    tooltip="Output do Comando (Hooks)"
                    icon={<MdTerminal size={20} />}
                    onClick={handleOpenCmdDialog}
                    disabled={serverStatus !== 'connected' || hookStatus === 'loading'}
                    loading={hookStatus === 'loading'}
                    pulse={getHookPulse()}
                    color={getHookColor()}
                    size="small"
                />

                <ActionButton
                    variant="outlined"
                    tooltip={removeComments ? 'Limpeza ativa' : 'Limpeza inativa'}
                    icon={removeComments ? <MdCodeOff size={20} /> : <MdCode size={20} />}
                    onClick={() => setRemoveComments(!removeComments)}
                    color={removeComments ? 'primary' : 'inherit'}
                    size="small"
                />
            </ActionsContainer>
        </Container>
    )
}

export default Header