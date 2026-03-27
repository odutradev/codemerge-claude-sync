import ServerConfig from '@/sidebar/tabs/sync/subcomponents/serverConfig'
import TreeViewer from '@/sidebar/tabs/sync/subcomponents/treeViewer'
import SyncStats from '@/sidebar/tabs/sync/subcomponents/syncStats'
import useSync from '@/sidebar/tabs/sync/hooks'
import Styled from './styles'

import type SyncViewProps from './types'

const SyncView = ({ fetchViaBackground }: SyncViewProps) => {
    const { state, actions } = useSync(fetchViaBackground)

    return (
        <Styled.Container>
            <ServerConfig
                serverUrl={state.serverUrl}
                setServerUrl={actions.setServerUrl}
                handleFetchStructure={actions.handleFetchStructure}
                loading={state.loading}
                isChecking={state.isChecking}
                serverStatus={state.serverStatus}
            />
            
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