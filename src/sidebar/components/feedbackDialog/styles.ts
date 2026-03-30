import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2
  }
}))

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  fontWeight: 600,
  fontSize: '1rem'
}))

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  flexDirection: 'column',
  paddingTop: theme.spacing(2),
  gap: theme.spacing(2),
  display: 'flex'
}))

export const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  flexDirection: 'column',
  gap: theme.spacing(1),
  display: 'flex'
}))

export const InfoTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: 'monospace',
  fontSize: '0.8rem'
}))

export const OutputBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  backgroundColor: '#000000',
  color: '#00ff00',
  overflowY: 'auto',
  maxHeight: 300
}))

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  paddingRight: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(2)
}))

export const ActionButton = styled(Button)({
  textTransform: 'none'
})