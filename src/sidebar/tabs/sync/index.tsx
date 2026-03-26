import { Box, Snackbar, Alert } from '@mui/material';

import { ServerConfig } from '@/sidebar/tabs/sync/subcomponents/serverConfig';
import { TreeViewer } from '@/sidebar/tabs/sync/subcomponents/treeViewer';
import { SyncStats } from '@/sidebar/tabs/sync/subcomponents/syncStats';
import { useSync } from '@/sidebar/tabs/sync/hooks/useSync';

import type { FetchViaBackground } from '@/sidebar/types';

interface Props { fetchViaBackground: FetchViaBackground; }

const SyncView = ({ fetchViaBackground }: Props) => {
    const { state, actions } = useSync(fetchViaBackground);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <ServerConfig serverUrl={state.serverUrl} setServerUrl={actions.setServerUrl} handleFetchStructure={actions.handleFetchStructure} loading={state.loading} isChecking={state.isChecking} serverStatus={state.serverStatus} />
            {state.projectStructure && (
                <>
                    <TreeViewer projectStructure={state.projectStructure} searchTerm={state.searchTerm} setSearchTerm={actions.setSearchTerm} isCopyMode={state.isCopyMode} setIsCopyMode={actions.setIsCopyMode} persistSelection={state.persistSelection} setPersistSelection={actions.setPersistSelection} selectedPaths={state.selectedPaths} expandedPaths={state.expandedPaths} pinnedPaths={state.pinnedPaths} handleCopyPath={actions.handleCopyPath} handleToggleSelection={actions.handleToggleSelection} handleToggleExpansion={actions.handleToggleExpansion} handleTogglePin={actions.handleTogglePin} />
                    <SyncStats stats={state.stats} pinnedCount={state.pinnedPaths.size} handleSync={actions.handleSync} loading={state.loading} serverStatus={state.serverStatus} hasSelection={state.selectedPaths.size > 0} />
                </>
            )}
            <Snackbar open={state.message.open} autoHideDuration={1000} onClose={() => actions.setMessage({ ...state.message, open: false })}><Alert severity={state.message.type}>{state.message.text}</Alert></Snackbar>
        </Box>
    );
};

export default SyncView;