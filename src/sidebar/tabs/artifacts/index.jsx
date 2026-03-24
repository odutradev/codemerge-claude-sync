import { Box, Snackbar, Alert } from '@mui/material';

import { CommandDialog } from './subcomponents/CommandDialog';
import { ArtifactList } from './subcomponents/ArtifactList';
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
                loading={state.actionLoading || state.fetching} 
                handleOpenCmdDialog={actions.handleOpenCmdDialog} 
                removeComments={state.removeComments} 
                setRemoveComments={actions.setRemoveComments} 
            />

            <ArtifactList 
                fetching={state.fetching} 
                artifacts={state.artifacts} 
                filesToDelete={state.filesToDelete}
                selectedIndices={state.selectedIndices} 
                selectedDeletions={state.selectedDeletions}
                toggleSelection={actions.toggleSelection} 
                toggleDeleteSelection={actions.toggleDeleteSelection}
                handleDeselectAll={actions.handleDeselectAll} 
                handleApplyAll={actions.handleApplyAll} 
                actionLoading={state.actionLoading} 
                serverStatus={state.serverStatus} 
                commitMessage={state.commitMessage}
                setCommitMessage={actions.setCommitMessage}
                originalCommitMessage={state.originalCommitMessage}
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
