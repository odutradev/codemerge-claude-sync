import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const CreatorInfo = styled(Box)({
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    width: '100%'
})

export const CreatorName = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 600,
    display: 'block'
}))