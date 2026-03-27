import { MdContentCopy, MdExpandMore, MdDelete, MdInput, MdEdit, MdAdd } from 'react-icons/md'
import { Typography, Tooltip, TextField } from '@mui/material'

import { StyledAccordion, StyledAccordionSummary, StyledAccordionDetails, HeaderBox, HeaderTypography, AddButton, EmptyTypography, StyledList, StyledListItem, ItemHeaderBox, ActionsBox, ActionIconButton, PromptTextBox, StyledDialog, StyledDialogTitle, StyledDialogContent, PromptTextField, StyledDialogActions, ActionButton } from './styles'
import usePromptPresets from '@/sidebar/tabs/tools/hooks/usePromptPresets'

import type { Preset } from '@/sidebar/types'

const PromptPresets = () => {
  const { state, actions } = usePromptPresets()

  return (
    <>
      <StyledAccordion>
        <StyledAccordionSummary expandIcon={<MdExpandMore size={24} />}>
          <HeaderBox>
            <HeaderTypography variant="caption">
              PRESETS DE PROMPT
            </HeaderTypography>

            <AddButton
              size="small"
              startIcon={<MdAdd size={20} />}
              onClick={(e) => {
                e.stopPropagation()
                actions.handleOpenDialog()
              }}
            >
              Novo Preset
            </AddButton>
          </HeaderBox>
        </StyledAccordionSummary>

        <StyledAccordionDetails>
          {state.presets.length === 0 ? (
            <EmptyTypography variant="body2" color="text.secondary">
              Nenhum preset cadastrado.
            </EmptyTypography>
          ) : (
            <StyledList>
              {state.presets.map((preset: Preset) => (
                <StyledListItem key={preset.id}>
                  <ItemHeaderBox>
                    <Typography variant="body2" fontWeight="bold">
                      {preset.title}
                    </Typography>

                    <ActionsBox>
                      <Tooltip title="Inserir no chat">
                        <ActionIconButton size="small" onClick={() => actions.handleInject(preset.prompt)}>
                          <MdInput size={20} />
                        </ActionIconButton>
                      </Tooltip>

                      <Tooltip title="Copiar Prompt">
                        <ActionIconButton size="small" onClick={() => actions.handleCopy(preset.prompt)}>
                          <MdContentCopy size={20} />
                        </ActionIconButton>
                      </Tooltip>

                      <Tooltip title="Editar">
                        <ActionIconButton size="small" onClick={() => actions.handleOpenDialog(preset)}>
                          <MdEdit size={20} />
                        </ActionIconButton>
                      </Tooltip>

                      <Tooltip title="Remover">
                        <ActionIconButton size="small" onClick={() => actions.handleDelete(preset.id)}>
                          <MdDelete size={20} />
                        </ActionIconButton>
                      </Tooltip>
                    </ActionsBox>
                  </ItemHeaderBox>

                  <PromptTextBox>
                    {preset.prompt}
                  </PromptTextBox>
                </StyledListItem>
              ))}
            </StyledList>
          )}
        </StyledAccordionDetails>
      </StyledAccordion>

      <StyledDialog
        open={state.dialogOpen}
        onClose={actions.handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <StyledDialogTitle>
          {state.formData.id ? 'Editar Preset' : 'Novo Preset'}
        </StyledDialogTitle>

        <StyledDialogContent dividers>
          <TextField
            label="Título"
            size="small"
            fullWidth
            value={state.formData.title}
            onChange={(e) => actions.setFormData({ ...state.formData, title: e.target.value })}
          />

          <PromptTextField
            label="Prompt"
            size="small"
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            value={state.formData.prompt}
            onChange={(e) => actions.setFormData({ ...state.formData, prompt: e.target.value })}
          />
        </StyledDialogContent>

        <StyledDialogActions>
          <ActionButton onClick={actions.handleCloseDialog} color="inherit">
            Cancelar
          </ActionButton>

          <ActionButton onClick={actions.handleSave} variant="contained" disableElevation>
            Salvar
          </ActionButton>
        </StyledDialogActions>
      </StyledDialog>
    </>
  )
}

export default PromptPresets