import { CircularProgress, Tooltip, IconButton } from '@mui/material'
import { MdRefresh } from 'react-icons/md'

import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import TreeViewer from '@/sidebar/tabs/sync/subcomponents/treeViewer'
import SyncStats from '@/sidebar/tabs/sync/subcomponents/syncStats'
import useSync from '@/sidebar/tabs/sync/hooks'
import Styled from './styles'

import type SyncViewProps from './types'

const SyncView = ({ fetchViaBackground }: SyncViewProps) => {
    const { state, actions } = useSync(fetchViaBackground)

    return (
        <Styled.Container>
            <Styled.HeaderRow>
                <ServerStatusIndicator
                    status={state.serverStatus}
                    isChecking={state.isChecking}
                    showText={true}
                />
                <Tooltip title="Atualizar Estrutura">
                    <span>
                        <Styled.RefreshButton
                            size="small"
                            onClick={actions.handleFetchStructure}
                            disabled={state.loading || state.isChecking || state.serverStatus !== 'connected'}
                        >
                            {state.loading ? <CircularProgress size={16} /> : <MdRefresh size={20} />}
                        </Styled.RefreshButton>
                    </span>
                </Tooltip>
            </Styled.HeaderRow>
            
            {state.projectStructure && (
                <>
                    <TreeViewer
                        projectStructure={state.projectStructure}
                        searchTerm={state.searchTerm}
                        setSearchTerm={actions.setSearchTerm}
                        isCopyMode={state.isCopyMode}
                        setIsCopyMode={actions.setIsCopyMode}
                        persistSelection={state.persistSelection}
                        setPersistSelection={actions.setPersistSelection}
                        selectedPaths={state.selectedPaths}
                        expandedPaths={state.expandedPaths}
                        pinnedPaths={state.pinnedPaths}
                        handleCopyPath={actions.handleCopyPath}
                        handleToggleSelection={actions.handleToggleSelection}
                        handleToggleExpansion={actions.handleToggleExpansion}
                        handleTogglePin={actions.handleTogglePin}
                    />
                    <SyncStats
                        stats={state.stats}
                        pinnedCount={state.pinnedPaths.size}
                        handleSync={actions.handleSync}
                        loading={state.loading}
                        serverStatus={state.serverStatus}
                        hasSelection={state.selectedPaths.size > 0}
                    />
                </>
            )}
        </Styled.Container>
    )
}

export default SyncView