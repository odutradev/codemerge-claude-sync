import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const OptionsContainer = styled(Box, { shouldForwardProp: (prop) => prop !== '$isActive' })<{ $isActive: boolean }>(({ $isActive }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    opacity: $isActive ? 1 : 0.5,
    pointerEvents: $isActive ? 'auto' : 'none'
}))