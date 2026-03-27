import { styled } from '@mui/material/styles'
import { IconButton, Box } from '@mui/material'

export const SelectorContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 18,
    height: 36,
    padding: '0 2px',
    flexShrink: 0
}))

export const IndicatorText = styled('span')(({ theme }) => ({
    padding: '0 4px',
    textAlign: 'center',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    letterSpacing: '-0.5px'
}))

export const NavButton = styled(IconButton)({
    padding: 4
})