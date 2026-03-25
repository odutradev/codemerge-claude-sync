import { Box, Snackbar, Alert } from '@mui/material';

import { CommandActions } from './subcomponents/CommandActions';
import { CommandDialog } from '../../components/commandDialog';
import { ArtifactList } from './subcomponents/ArtifactList';
import { CommitBox } from '../../components/commitBox';
import { useArtifacts } from './hooks/useArtifacts';
import { Header } from './subcomponents/Header';

export const ArtifactsView = ({ fetchViaBackground }) => {
    const { state, actions } = useArtifacts(fetchViaBackground);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.default', overflow: 'hidden' }}>
            <Box sx={{ flexShrink: 0 }}>
                <Header
                    serverStatus={state.serverStatus}
                    isChecking={state.isChecking}
                    handleFetchArtifacts={actions.handleFetchArtifacts}
                    loading={state.actionLoading || state.fetching}
                    handleOpenCmdDialog={actions.handleOpenCmdDialog}
                    removeComments={state.removeComments}
                    setRemoveComments={actions.setRemoveComments}
                    historyLength={state.historyLength}
                    currentHistoryIndex={state.currentHistoryIndex}
                    handlePrevHistory={actions.handlePrevHistory}
                    handleNextHistory={actions.handleNextHistory}
                    hookStatus={state.hookStatus}
                />
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', pr: 0.5, mr: -0.5, pb: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'action.hover', borderRadius: '4px' } }}>
                {!!(state.originalCommitMessage || state.commitMessage) && (
                    <Box sx={{ flexShrink: 0, mb: 2 }}>
                        <CommitBox
                            commitType={state.commitType}
                            setCommitType={actions.setCommitType}
                            translateCommit={state.translateCommit}
                            setTranslateCommit={actions.setTranslateCommit}
                            commitMessage={state.commitMessage}
                            setCommitMessage={actions.setCommitMessage}
                            originalCommitMessage={state.originalCommitMessage}
                            originalCommitType={state.originalCommitType}
                            handleCommit={actions.handleCommit}
                            actionLoading={state.actionLoading}
                            serverStatus={state.serverStatus}
                        />
                    </Box>
                )}
                <Box sx={{ flexShrink: 0 }}>
                    <CommandActions
                        commandsToExecute={state.commandsToExecute}
                        selectedCommands={state.selectedCommands}
                        toggleCommandSelection={actions.toggleCommandSelection}
                        handleExecuteCommands={actions.handleExecuteCommands}
                        actionLoading={state.actionLoading}
                        serverStatus={state.serverStatus}
                    />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 250 }}>
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
                    />
                </Box>
            </Box>
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