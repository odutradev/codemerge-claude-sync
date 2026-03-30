import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import PromptPresets from '@/sidebar/tabs/tools/subcomponents/promptPresets'
import FeedbackDialog from '@/sidebar/components/feedbackDialog'
import { CommitBox } from '@/sidebar/components/commitBox'
import useTools from '@/sidebar/tabs/tools/hooks/useTools'
import { Container, StatusWrapper } from './styles'

import type ToolsViewProps from './types'

const ToolsView = ({ fetchViaBackground }: ToolsViewProps) => {
  const { state, actions } = useTools(fetchViaBackground)

  return (
    <Container>
      <StatusWrapper>
        <ServerStatusIndicator status={state.serverStatus} isChecking={state.isChecking} />
      </StatusWrapper>

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

      <PromptPresets />

      <FeedbackDialog
        open={state.cmdDialogOpen}
        onClose={() => actions.setCmdDialogOpen(false)}
        loading={state.cmdLoading}
        output={state.cmdOutput}
        onFetchOutput={actions.handleFetchCommandOutput}
        onInject={actions.handleInjectOutput}
      />
    </Container>
  )
}

export default ToolsView