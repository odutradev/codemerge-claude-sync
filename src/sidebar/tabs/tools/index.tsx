import { Box, Typography } from '@mui/material';

import { PromptPresets } from '@/sidebar/tabs/tools/subcomponents/promptPresets';
import { CommandDialog } from '@/sidebar/components/commandDialog';
import { CommitBox } from '@/sidebar/components/commitBox';
import { containerStyles, titleStyles } from './styles';
import { useTools } from '@/sidebar/tabs/tools/hooks/useTools';

import type { FetchViaBackground } from '@/sidebar/types';

interface Props { fetchViaBackground: FetchViaBackground; }

const ToolsView = ({ fetchViaBackground }: Props) => {
    const { state, actions } = useTools(fetchViaBackground);

    return (
        <Box sx={containerStyles}>
            <Typography variant="subtitle2" sx={titleStyles}>Ferramentas Globais</Typography>
            <CommitBox commitType={state.commitType} setCommitType={actions.setCommitType} translateCommit={state.translateCommit} setTranslateCommit={actions.setTranslateCommit} commitMessage={state.commitMessage} setCommitMessage={actions.setCommitMessage} originalCommitMessage={state.originalCommitMessage} originalCommitType={state.originalCommitType} handleCommit={actions.handleCommit} actionLoading={state.actionLoading} serverStatus={state.serverStatus} />
            <PromptPresets />
            <CommandDialog cmdDialogOpen={state.cmdDialogOpen} setCmdDialogOpen={actions.setCmdDialogOpen} cmdLoading={state.cmdLoading} cmdOutput={state.cmdOutput} handleFetchCommandOutput={actions.handleFetchCommandOutput} handleInjectOutput={actions.handleInjectOutput} />
        </Box>
    );
};

export default ToolsView;