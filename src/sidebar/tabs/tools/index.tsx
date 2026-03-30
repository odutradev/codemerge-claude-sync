import PromptPresets from '@/sidebar/tabs/tools/subcomponents/promptPresets'
import FeedbackDialog from '@/sidebar/components/feedbackDialog'
import useTools from '@/sidebar/tabs/tools/hooks/useTools'
import { CommitBox } from '@/sidebar/components/commitBox'
import { Container, Title } from './styles'

import type ToolsViewProps from './types'

const ToolsView = ({ fetchViaBackground }: ToolsViewProps) => {
  const { state, actions } = useTools(fetchViaBackground)

  return (
    <Container>
      <Title variant="subtitle2">
        Ferramentas Globais
      </Title>

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