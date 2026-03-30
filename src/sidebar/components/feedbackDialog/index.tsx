import { MdTerminal, MdRefresh, MdInput, MdClose } from 'react-icons/md'
import { CircularProgress, Tooltip, Box } from '@mui/material'

import { StyledDialog, StyledDialogContent, ActionIconButton, InfoTypography, HeaderActions, HeaderTitle, HeaderBox, OutputBox, InfoBar } from './styles'
import { renderAnsi } from '@/sidebar/components/commandDialog/ansi'

import type { FeedbackDialogProps } from './types'

const FeedbackDialog = ({ open, onClose, loading, output, onFetchOutput, onInject }: FeedbackDialogProps) => {
  const getTitle = () => {
    if (!output) return 'Aguardando...'
    if (output.type === 'commit') return 'Terminal: Commit'
    if (output.type === 'execute') return 'Terminal: Execução'
    return 'Terminal: Output'
  }

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <HeaderBox>
        <HeaderTitle>
          <MdTerminal size={18} />
          {getTitle()}
        </HeaderTitle>
        <HeaderActions>
          {output?.type === 'hook' && onFetchOutput && (
            <Tooltip title="Atualizar">
              <ActionIconButton onClick={onFetchOutput} color="info">
                <MdRefresh />
              </ActionIconButton>
            </Tooltip>
          )}
          {output && output.type !== 'commit' && onInject && (
            <Tooltip title="Inserir no Chat">
              <ActionIconButton onClick={onInject} color="primary">
                <MdInput />
              </ActionIconButton>
            </Tooltip>
          )}
          <Tooltip title="Fechar">
            <ActionIconButton onClick={onClose} color="error">
              <MdClose />
            </ActionIconButton>
          </Tooltip>
        </HeaderActions>
      </HeaderBox>
      <StyledDialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : output ? (
          <>
            <InfoBar>
              <InfoTypography>
                $ {output.command}
              </InfoTypography>
              <InfoTypography status={output.success ? 'success' : 'error'}>
                {output.success ? 'SUCESSO' : 'ERRO'}
              </InfoTypography>
            </InfoBar>
            <OutputBox>
              {renderAnsi(output.output ?? output.error ?? 'Sem saída registrada.')}
            </OutputBox>
          </>
        ) : (
          <OutputBox>
            Nenhum dado disponível.
          </OutputBox>
        )}
      </StyledDialogContent>
    </StyledDialog>
  )
}

export default FeedbackDialog
