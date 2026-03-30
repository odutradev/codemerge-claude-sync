import { MdCloudUpload, MdTerminal, MdCodeOff, MdCode } from 'react-icons/md'

import VersionSelector from '@/sidebar/tabs/artifacts/subcomponents/versionSelector'
import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import ActionButton from '@/sidebar/components/actionButton'
import { ActionsContainer, Container } from './styles'

import type { HeaderProps } from './types'

const Header = ({ serverStatus, isChecking, handleFetchArtifacts, loading, handleOpenCmdDialog, removeComments, setRemoveComments, historyLength, currentHistoryIndex, handlePrevHistory, handleNextHistory, hookStatus }: HeaderProps) => {
    const getHookPulse = () => {
        if (hookStatus === 'loading') return 'warning'
        if (hookStatus === 'success') return 'success'
        if (hookStatus === 'error') return 'error'
        return 'none'
    }

    const getHookColor = () => {
        if (hookStatus === 'loading') return 'warning'
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
                    currentHistoryIndex={currentHistoryIndex}
                    handleNextHistory={handleNextHistory}
                    handlePrevHistory={handlePrevHistory}
                    historyLength={historyLength}
                    loading={loading}
                />

                <ActionButton
                    icon={<MdCloudUpload size={20} />}
                    onClick={() => handleFetchArtifacts(false)}
                    variant="outlined"
                    disabled={loading}
                    size="small"
                    fullWidth
                >
                    Buscar
                </ActionButton>

                <ActionButton
                    tooltip="Output do Comando (Hooks)"
                    icon={<MdTerminal size={20} />}
                    disabled={serverStatus !== 'connected'}
                    loading={hookStatus === 'loading'}
                    color={getHookColor()}
                    onClick={handleOpenCmdDialog}
                    pulse={getHookPulse()}
                    variant="outlined"
                    size="small"
                />

                <ActionButton
                    tooltip={removeComments ? 'Limpeza ativa' : 'Limpeza inativa'}
                    icon={removeComments ? <MdCodeOff size={20} /> : <MdCode size={20} />}
                    color={removeComments ? 'primary' : 'inherit'}
                    onClick={() => setRemoveComments(!removeComments)}
                    variant="outlined"
                    size="small"
                />
            </ActionsContainer>
        </Container>
    )
}

export default Header