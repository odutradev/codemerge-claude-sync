import type { CommandOutput, ServerStatus } from '@/sidebar/types'

export default interface UseToolsReturn {
  state: {
    serverStatus: ServerStatus
    isChecking: boolean
    cmdDialogOpen: boolean
    actionLoading: boolean
    commitMessage: string
    cmdLoading: boolean
    commitType: string
    cmdOutput: CommandOutput | null
    translateCommit: boolean
    originalCommitMessage: string
    originalCommitType: string
  }
  actions: {
    setCmdDialogOpen: (v: boolean) => void
    setCommitMessage: (v: string) => void
    setCommitType: (v: string) => void
    setTranslateCommit: (v: boolean) => void
    handleCommit: () => void
    handleFetchCommandOutput: () => void
    handleInjectOutput: () => void
  }
}