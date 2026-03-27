import { styled, keyframes, alpha } from '@mui/material/styles'
import { IconButton, Button } from '@mui/material'

import type { StyledProps } from './types'

const createPulseAnimation = (color: string) => keyframes`
    0% { box-shadow: 0 0 0 0 ${color}; }
    70% { box-shadow: 0 0 0 6px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
`

const getPulseStyles = (theme: any, pulseType: string) => {
    if (pulseType === 'none') return {}

    const colorMap: Record<string, string> = {
        success: alpha(theme.palette.success.main, 0.4),
        error: alpha(theme.palette.error.main, 0.4),
        warning: alpha(theme.palette.warning.main, 0.4),
        primary: alpha(theme.palette.primary.main, 0.4)
    }

    const color = colorMap[pulseType] || colorMap.primary

    return {
        animation: `${createPulseAnimation(color)} 1.5s infinite`
    }
}

export const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== '$pulse'
})<StyledProps>(({ theme, $pulse }) => ({
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius * 2,
    ...getPulseStyles(theme, $pulse)
}))

export const StyledIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== '$pulse'
})<StyledProps>(({ theme, $pulse }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    ...getPulseStyles(theme, $pulse)
}))