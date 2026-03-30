import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const RowContainer = styled(Box, { shouldForwardProp: (prop) => prop !== '$vertical' })<{ $vertical: boolean }>(({ theme, $vertical }) => ({
    flexDirection: $vertical ? 'column' : 'row',
    alignItems: $vertical ? 'flex-start' : 'center',
    marginBottom: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(1.5),
    '&:last-child': {
        marginBottom: 0
    }
}))

export const RowLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    minWidth: 140,
    display: 'block'
}))