import { Box, Snackbar, Alert } from '@mui/material';

import { CommandDialog } from './subcomponents/CommandDialog';
import { ArtifactList } from './subcomponents/ArtifactList';
import { GitActions } from './subcomponents/GitActions';
import { useArtifacts } from './hooks/useArtifacts';
import { Header } from './subcomponents/Header';

export const ArtifactsView = ({ fetchViaBackground }) => {
    const { state, actions } = useArtifacts(fetchViaBackground);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.default' }}>
            <Header 
                serverStatus={state.serverStatus} 
                isChecking={state.isChecking} 
                handleFetchArtifacts={actions.handleFetchArtifacts} 
                loading={state.loading} 
                handleOpenCmdDialog={actions.handleOpenCmdDialog} 
                removeComments={state.removeComments} 
                setRemoveComments={actions.setRemoveComments} 
            />

            <GitActions 
                commitMessage={state.commitMessage} 
                setCommitMessage={actions.setCommitMessage} 
                originalCommitMessage={state.originalCommitMessage} 
                handleCommit={actions.handleCommit} 
                filesToDelete={state.filesToDelete} 
                handleDeleteFiles={actions.handleDeleteFiles} 
                actionLoading={state.actionLoading} 
                serverStatus={state.serverStatus} 
            />

            <ArtifactList 
                fetching={state.fetching} 
                artifacts={state.artifacts} 
                selectedIndices={state.selectedIndices} 
                toggleSelection={actions.toggleSelection} 
                handleDeselectAll={actions.handleDeselectAll} 
                handleSync={actions.handleSync} 
                loading={state.loading} 
                serverStatus={state.serverStatus} 
            />

            <CommandDialog 
                cmdDialogOpen={state.cmdDialogOpen} 
                setCmdDialogOpen={actions.setCmdDialogOpen} 
                cmdLoading={state.cmdLoading} 
                cmdOutput={state.cmdOutput} 
                handleFetchCommandOutput={actions.handleFetchCommandOutput} 
                handleInjectOutput={actions.handleInjectOutput} 
            />

            <Snackbar open={state.message.open} autoHideDuration={2000} onClose={() => actions.setMessage({ ...state.message, open: false })}>
                <Alert severity={state.message.type} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {state.message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ArtifactsView;