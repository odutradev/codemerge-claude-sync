import { ScrollableContainer, HeaderWrapper, CommitWrapper, CommandWrapper, ListWrapper, Container } from './styles';
import CommandActions from '@/sidebar/tabs/artifacts/subcomponents/commandActions';
import ArtifactList from '@/sidebar/tabs/artifacts/subcomponents/artifactList';
import Header from '@/sidebar/tabs/artifacts/subcomponents/header';
import { CommandDialog } from '@/sidebar/components/commandDialog';
import { CommitBox } from '@/sidebar/components/commitBox';
import useArtifacts from '@/sidebar/tabs/artifacts/hooks';

import type { ArtifactsViewProps } from './types';

const ArtifactsView = ({ fetchViaBackground }: ArtifactsViewProps) => {
    const { state, actions } = useArtifacts(fetchViaBackground);

    return (
        <Container>
            <HeaderWrapper>
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
            </HeaderWrapper>

            <ScrollableContainer>
                {!!(state.originalCommitMessage || state.commitMessage) && (
                    <CommitWrapper>
                        <CommitBox
                            commitType={state.commitType}
                            setCommitType={(value) => actions.setField('commitType', value)}
                            translateCommit={state.translateCommit}
                            setTranslateCommit={actions.setTranslateCommit}
                            commitMessage={state.commitMessage}
                            setCommitMessage={(value) => actions.setField('commitMessage', value)}
                            originalCommitMessage={state.originalCommitMessage}
                            originalCommitType={state.originalCommitType}
                            handleCommit={actions.handleCommit}
                            actionLoading={state.actionLoading}
                            serverStatus={state.serverStatus}
                        />
                    </CommitWrapper>
                )}

                <CommandWrapper>
                    <CommandActions
                        commandsToExecute={state.commandsToExecute}
                        selectedCommands={state.selectedCommands}
                        toggleCommandSelection={actions.toggleCommandSelection}
                        handleExecuteCommands={actions.handleExecuteCommands}
                        actionLoading={state.actionLoading}
                        serverStatus={state.serverStatus}
                    />
                </CommandWrapper>

                <ListWrapper>
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
                </ListWrapper>
            </ScrollableContainer>

            <CommandDialog
                cmdDialogOpen={state.cmdDialogOpen}
                setCmdDialogOpen={(value) => actions.setField('cmdDialogOpen', value)}
                cmdLoading={state.cmdLoading}
                cmdOutput={state.cmdOutput}
                handleFetchCommandOutput={actions.handleFetchCommandOutput}
                handleInjectOutput={actions.handleInjectOutput}
            />
        </Container>
    );
};

export default ArtifactsView;