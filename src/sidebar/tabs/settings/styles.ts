import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SettingsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    overflowX: 'hidden',
    overflowY: 'auto',
    height: '100%'
}))

export const PageTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}))

export const VersionText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing(4),
    display: 'block'
}))

export const ToggleContent = styled('span')(({ theme }) => ({
    alignItems: 'center',
    display: 'inline-flex',
    gap: theme.spacing(1)
}))