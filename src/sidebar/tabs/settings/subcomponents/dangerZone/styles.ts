import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const DangerRow = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
    alignItems: 'center',
    display: 'flex',
    '&:last-child': {
        borderBottom: 'none',
        paddingBottom: 0
    },
    '&:first-of-type': {
        paddingTop: 0
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