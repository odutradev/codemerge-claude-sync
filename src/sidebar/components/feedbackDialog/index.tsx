import { MdInput, MdRefresh, MdClose } from 'react-icons/md'
import { CircularProgress } from '@mui/material'

import { StyledDialog, StyledDialogTitle, StyledDialogContent, ContentBox, InfoTypography, OutputBox, StyledDialogActions, ActionButton } from './styles'

import type { FeedbackDialogProps } from './types'

const FeedbackDialog = ({ open, onClose, loading, output, onFetchOutput, onInject }: FeedbackDialogProps) => {
  const getTitle = () => {
    if (!output) return 'Aguardando...'
    if (output.type === 'commit') return 'Resultado do Commit'
    if (output.type === 'execute') return 'Resultado da Execução'
    return 'Output do Terminal'
  }

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        {getTitle()}
      </StyledDialogTitle>
      
      <StyledDialogContent dividers>
        {loading ? (
          <CircularProgress size={24} />
        ) : output ? (
          <ContentBox>
            <InfoTypography>
              COMANDO: {output.command}
            </InfoTypography>
            <InfoTypography>
              STATUS: {output.success ? 'SUCESSO' : 'ERRO'}
            </InfoTypography>
            <OutputBox>
              {output.output ?? output.error ?? 'Sem saída registrada.'}
            </OutputBox>
          </ContentBox>
        ) : (
          <InfoTypography>
            Nenhum dado disponível.
          </InfoTypography>
        )}
      </StyledDialogContent>

      <StyledDialogActions>
        {output?.type === 'hook' && onFetchOutput && (
          <ActionButton onClick={onFetchOutput} color="info" startIcon={<MdRefresh size={20} />}>
            Atualizar
          </ActionButton>
        )}
        {output && onInject && (
          <ActionButton onClick={onInject} color="primary" variant="contained" startIcon={<MdInput size={20} />} disableElevation>
            Inserir no Chat
          </ActionButton>
        )}
        <ActionButton onClick={onClose} color="inherit" startIcon={<MdClose size={20} />}>
          Fechar
        </ActionButton>
      </StyledDialogActions>
    </StyledDialog>
  )
}

export default FeedbackDialog