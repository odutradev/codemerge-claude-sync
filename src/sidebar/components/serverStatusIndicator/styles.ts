import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { pulseOrange, pulseGreen, pulseRed } from '@/sidebar/styles'

export const getStatusProps = (status: string, isChecking: boolean) => {
    const visualStatus = isChecking ? 'checking' : status

    const visualMap: Record<string, { color: string; animation: string; borderColor: string }> = {
        connected: {
            color: 'success.main',
            animation: `${pulseGreen} 3s infinite`,
            borderColor: '#4caf50'
        },
        disconnected: {
            color: 'error.main',
            animation: `${pulseRed} 2s infinite`,
            borderColor: '#f44336'
        },
        checking: {
            color: 'warning.main',
            animation: `${pulseOrange} 1.5s infinite`,
            borderColor: '#ed6c02'
        }
    }

    const textMap: Record<string, string> = {
        connected: 'Online',
        disconnected: 'Offline'
    }

    const visualProps = visualMap[visualStatus] ?? {
        color: 'text.disabled',
        animation: 'none',
        borderColor: 'transparent'
    }

    return {
        ...visualProps,
        text: textMap[status] ?? 'OFFLINE'
    }
}

export const StatusContainer = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    gap: 6
})

export const StatusText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 500
}))

export const Indicator = styled(Box)<{ statuscolor: string; statusanimation: string; statusbordercolor: string }>(({ theme, statuscolor, statusanimation, statusbordercolor }) => {
    const resolveColor = (path: string) => {
        const parts = path.split('.')
        if (parts.length === 2) {
            const paletteGroup = theme.palette[parts[0] as keyof typeof theme.palette] as Record<string, string>
            return paletteGroup ? paletteGroup[parts[1]] : path
        }
        return path
    }

    return {
        border: statusbordercolor !== 'transparent' ? `1px solid ${statusbordercolor}` : 'none',
        backgroundColor: resolveColor(statuscolor),
        animation: statusanimation,
        borderRadius: '50%',
        flexShrink: 0,
        margin: '6px',
        height: 8,
        width: 8
    }
})