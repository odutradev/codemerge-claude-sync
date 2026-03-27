import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  overflowY: 'auto',
  overflowX: 'hidden'
}))

export const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main
}))