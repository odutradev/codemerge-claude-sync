import { Box, Typography, Paper } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

export const DangerContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4)
}))

export const DangerTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    fontSize: 16
}))

export const DangerBox = styled(Paper)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'transparent',
    overflow: 'hidden'
}))

export const DangerRow = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    alignItems: 'center',
    display: 'flex',
    '&:last-child': {
        borderBottom: 'none'
    }
}))

export const DangerInfo = styled(Box)({
    flexDirection: 'column',
    paddingRight: 16,
    display: 'flex'
})

export const DangerActionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: 14
}))

export const DangerActionDesc = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: 12
}))