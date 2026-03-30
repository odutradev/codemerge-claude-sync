import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SettingsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    overflowX: 'hidden',
    overflowY: 'auto',
    height: '100%'
}))

export const StatusWrapper = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    justifyContent: 'center',
    display: 'flex',
    width: '100%'
}))

export const VersionText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(4),
    textAlign: 'center',
    display: 'block'
}))

export const ToggleContent = styled('span')(({ theme }) => ({
    gap: theme.spacing(1),
    alignItems: 'center',
    display: 'inline-flex'
}))