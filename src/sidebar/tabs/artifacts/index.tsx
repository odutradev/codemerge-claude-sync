import { Box } from '@mui/material';

import { CommandActions } from '@/sidebar/tabs/artifacts/subcomponents/commandActions';
import { NotificationSnackbar } from '@/sidebar/components/notificationSnackbar';
import { ArtifactList } from '@/sidebar/tabs/artifacts/subcomponents/artifactList';
import { Header } from '@/sidebar/tabs/artifacts/subcomponents/header';
import { CommandDialog } from '@/sidebar/components/commandDialog';
import { CommitBox } from '@/sidebar/components/commitBox';
import { containerStyles, scrollableStyles } from './styles';
import { useArtifacts } from '@/sidebar/tabs/artifacts/hooks';

import type { FetchViaBackground } from '@/sidebar/types';

interface Props { fetchViaBackground: FetchViaBackground; }

const ArtifactsView = ({ fetchViaBackground }: Props) => {
    const { state, actions } = useArtifacts(fetchViaBackground);

    return (
        <Box sx={containerStyles}>
            <Box sx={{ flexShrink: 0 }}>
                <Header serverStatus={state.serverStatus} isChecking={state.isChecking} handleFetchArtifacts={actions.handleFetchArtifacts} loading={state.actionLoading || state.fetching} handleOpenCmdDialog={actions.handleOpenCmdDialog} removeComments={state.removeComments} setRemoveComments={actions.setRemoveComments} historyLength={state.historyLength} currentHistoryIndex={state.currentHistoryIndex} handlePrevHistory={actions.handlePrevHistory} handleNextHistory={actions.handleNextHistory} hookStatus={state.hookStatus} />
            </Box>
            <Box sx={scrollableStyles}>
                {!!(state.originalCommitMessage || state.commitMessage) && (
                    <Box sx={{ flexShrink: 0, mb: 2 }}>
                        <CommitBox commitType={state.commitType} setCommitType={actions.setCommitType} translateCommit={state.translateCommit} setTranslateCommit={actions.setTranslateCommit} commitMessage={state.commitMessage} setCommitMessage={actions.setCommitMessage} originalCommitMessage={state.originalCommitMessage} originalCommitType={state.originalCommitType} handleCommit={actions.handleCommit} actionLoading={state.actionLoading} serverStatus={state.serverStatus} />
                    </Box>
                )}
                <Box sx={{ flexShrink: 0 }}>
                    <CommandActions commandsToExecute={state.commandsToExecute} selectedCommands={state.selectedCommands} toggleCommandSelection={actions.toggleCommandSelection} handleExecuteCommands={actions.handleExecuteCommands} actionLoading={state.actionLoading} serverStatus={state.serverStatus} />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 250 }}>
                    <ArtifactList fetching={state.fetching} artifacts={state.artifacts} filesToDelete={state.filesToDelete} selectedIndices={state.selectedIndices} selectedDeletions={state.selectedDeletions} toggleSelection={actions.toggleSelection} toggleDeleteSelection={actions.toggleDeleteSelection} handleDeselectAll={actions.handleDeselectAll} handleApplyAll={actions.handleApplyAll} actionLoading={state.actionLoading} serverStatus={state.serverStatus} />
                </Box>
            </Box>
            <CommandDialog cmdDialogOpen={state.cmdDialogOpen} setCmdDialogOpen={actions.setCmdDialogOpen} cmdLoading={state.cmdLoading} cmdOutput={state.cmdOutput} handleFetchCommandOutput={actions.handleFetchCommandOutput} handleInjectOutput={actions.handleInjectOutput} />
            <NotificationSnackbar message={state.message} onClose={() => actions.setMessage({ ...state.message, open: false })} />
        </Box>
    );
};

export default ArtifactsView;