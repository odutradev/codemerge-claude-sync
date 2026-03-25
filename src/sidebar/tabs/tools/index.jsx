import { Box, Snackbar, Alert, Typography } from '@mui/material';

import { CommandDialog } from '../../components/commandDialog';
import { PromptPresets } from './subcomponents/PromptPresets';
import { CommitBox } from '../../components/commitBox';
import { useTools } from './hooks/useTools';

export const ToolsView = ({ fetchViaBackground }) => {
    const { state, actions } = useTools(fetchViaBackground);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.default', overflowY: 'auto', overflowX: 'hidden' }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>Ferramentas Globais</Typography>

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

            <PromptPresets showNotification={actions.showNotification} />

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

export default ToolsView;