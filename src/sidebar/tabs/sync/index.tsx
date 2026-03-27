import TreeViewer from '@/sidebar/tabs/sync/subcomponents/treeViewer'
import SyncStats from '@/sidebar/tabs/sync/subcomponents/syncStats'
import useSync from '@/sidebar/tabs/sync/hooks'
import Styled from './styles'

import type SyncViewProps from './types'

const SyncView = ({ fetchViaBackground }: SyncViewProps) => {
    const { state, actions } = useSync(fetchViaBackground)

    return (
        <Styled.Container>
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
                serverStatus={state.serverStatus}
                isChecking={state.isChecking}
                loading={state.loading}
                handleFetchStructure={actions.handleFetchStructure}
            />
            {state.projectStructure && (
                <SyncStats
                    stats={state.stats}
                    pinnedCount={state.pinnedPaths.size}
                    handleSync={actions.handleSync}
                    loading={state.loading}
                    serverStatus={state.serverStatus}
                    hasSelection={state.selectedPaths.size > 0}
                />
            )}
        </Styled.Container>
    )
}

export default SyncView