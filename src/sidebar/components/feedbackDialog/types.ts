import type { CommandOutput } from '@/sidebar/types'

export interface FeedbackDialogProps {
  open: boolean
  onClose: () => void
  loading: boolean
  output: CommandOutput | null
  onFetchOutput?: () => void
  onInject?: () => void
}