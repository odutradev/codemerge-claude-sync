import { pulseOrange, pulseGreen, pulseRed } from '@/sidebar/styles'

import type { SxProps, Theme } from '@mui/material'

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
        text: textMap[status] ?? '...'
    }
}

export const containerStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75
}

export const textStyles: SxProps<Theme> = {
    color: 'text.secondary',
    fontWeight: 500,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
}

export const indicatorStyles = (color: string, animation: string, borderColor: string): SxProps<Theme> => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    bgcolor: color,
    animation,
    flexShrink: 0,
    border: borderColor !== 'transparent' ? `1px solid ${borderColor}` : 'none',
    margin: '6px'
})