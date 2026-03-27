import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    opacity: 0.5,
    flexGrow: 1
}))

export const IconWrapper = styled(Box)(({ theme }) => ({
    color: theme.palette.action.disabled,
    fontSize: 40,
    display: 'flex'
}))