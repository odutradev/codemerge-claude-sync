import { Dialog, Box, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#ffffff',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[10],
    overflow: 'hidden'
  }
}))

export const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#f6f8fa',
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
  display: 'flex'
}))

export const HeaderActions = styled(Box)(({ theme }) => ({
  gap: theme.spacing(0.5),
  alignItems: 'center',
  display: 'flex'
}))

export const ActionIconButton = styled(IconButton)({
  padding: 6,
  '& svg': {
    fontSize: '1.2rem'
  }
})

export const StyledDialogContent = styled(Box)({
  backgroundColor: '#0d1117',
  flexDirection: 'column',
  display: 'flex',
  padding: 0
})

export const InfoBar = styled(Box)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  display: 'flex'
}))

export const InfoTypography = styled(Typography)<{ customcolor?: string }>(({ customcolor }) => ({
  color: customcolor || '#8b949e',
  fontFamily: 'monospace',
  fontSize: '0.75rem'
}))

export const OutputBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  overflowY: 'auto',
  color: '#e6edf3',
  maxHeight: '60vh'
}))