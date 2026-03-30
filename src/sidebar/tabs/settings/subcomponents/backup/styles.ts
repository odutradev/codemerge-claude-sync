import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const BackupRow = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(2),
    '&:last-of-type': {
        borderBottom: 'none',
        paddingBottom: 0
    },
    '&:first-of-type': {
        paddingTop: 0
    }
}))

export const BackupInfo = styled(Box)({
    flexDirection: 'column',
    display: 'flex',
    flex: 1
})

export const BackupTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: 14
}))

export const BackupDesc = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: 12
}))

export const ActionGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1)
}))

export const StyledButton = styled(Button)({
    whiteSpace: 'nowrap'
})

export const HiddenInput = styled('input')({
    display: 'none'
})