import { MdDownload, MdTerminal, MdCodeOff, MdCode } from 'react-icons/md'

import VersionSelector from '@/sidebar/tabs/artifacts/subcomponents/versionSelector'
import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import ActionButton from '@/sidebar/components/actionButton'
import { Container, ActionsContainer } from './styles'

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
                <VersionSelector
                    historyLength={historyLength}
                    currentHistoryIndex={currentHistoryIndex}
                    handlePrevHistory={handlePrevHistory}
                    handleNextHistory={handleNextHistory}
                    loading={loading}
                />

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