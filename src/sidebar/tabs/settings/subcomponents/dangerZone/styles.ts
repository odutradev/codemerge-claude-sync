import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ActionGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2)
}))

export const WarningText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    display: 'block'
}))