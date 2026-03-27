import { Accordion, AccordionSummary, AccordionDetails, Box, List, ListItem, Typography, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  '&:before': {
    display: 'none'
  }
}))

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  minHeight: '48px',
  '& .MuiAccordionSummary-content': {
    margin: '8px 0',
    width: '100%'
  }
}))

export const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  padding: 0
}))

export const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  paddingRight: theme.spacing(1)
}))

export const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary
}))

export const AddButton = styled(Button)(() => ({
  fontSize: '0.75rem',
  textTransform: 'none'
}))

export const EmptyTypography = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2)
}))

export const StyledList = styled(List)(() => ({
  padding: 0,
  margin: 0
}))

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(1.5),
  borderTop: '1px solid',
  borderColor: theme.palette.divider
}))

export const ItemHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5)
}))

export const ActionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5)
}))

export const ActionIconButton = styled(IconButton)(() => ({
  color: '#ffffff'
}))

export const PromptTextBox = styled(Box)(({ theme }) => ({
  width: '100%',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  opacity: 0.8,
  fontSize: '0.8rem',
  fontFamily: 'monospace',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius
}))

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: 8
  }
}))

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  fontSize: '1rem',
  fontWeight: 600
}))

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2)
}))

export const PromptTextField = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    fontSize: '0.85rem',
    fontFamily: 'monospace'
  }
}))

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2)
}))

export const ActionButton = styled(Button)(() => ({
  textTransform: 'none'
}))