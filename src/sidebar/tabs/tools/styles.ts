import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  flexDirection: 'column',
  padding: theme.spacing(2),
  overflowX: 'hidden',
  overflowY: 'auto',
  display: 'flex',
  height: '100%'
}))

export const StatusWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  justifyContent: 'center',
  display: 'flex',
  width: '100%'
}))