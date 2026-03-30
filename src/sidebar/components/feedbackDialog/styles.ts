import { Dialog, Box, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden'
  }
}))

export const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  alignItems: 'center',
  display: 'flex'
}))

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  gap: theme.spacing(1),
  alignItems: 'center',
  fontSize: '0.85rem',
  fontWeight: 600,
  display: 'flex',
  '& svg': {
    color: '#ffffff'
  }
}))

export const HeaderActions = styled(Box)(({ theme }) => ({
  gap: theme.spacing(0.5),
  alignItems: 'center',
  display: 'flex'
}))

export const ActionIconButton = styled(IconButton)({
  color: '#ffffff',
  padding: 6,
  '& svg': {
    fontSize: '1.2rem'
  }
})

export const StyledDialogContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'column',
  display: 'flex',
  padding: 0
}))

export const InfoBar = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  display: 'flex'
}))

export const InfoTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'status'
})<{ status?: 'success' | 'error' }>(({ theme, status }) => ({
  color: status === 'success' ? theme.palette.success.main : status === 'error' ? theme.palette.error.main : theme.palette.text.secondary,
  fontFamily: 'monospace',
  fontSize: '0.75rem'
}))

export const OutputBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  color: '#e0e0e0',
  padding: theme.spacing(2),
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  overflowY: 'auto',
  maxHeight: '60vh'
}))