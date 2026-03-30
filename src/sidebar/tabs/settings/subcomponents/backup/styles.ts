import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const BackupRow = styled(Box)(({ theme }) => ({
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(2)
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