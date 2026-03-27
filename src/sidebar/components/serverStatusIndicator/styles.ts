import { keyframes } from '@mui/material/styles'

import type { SxProps, Theme } from '@mui/material'

const pulseGreen = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`

const pulseRed = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
`

const pulseOrange = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(237, 108, 2, 0); }
  100% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0); }
`

export const getStatusProps = (status: string, isChecking: boolean) => {
    const activeStatus = isChecking ? 'checking' : status

    const propsMap: Record<string, { color: string; animation: string; text: string; borderColor: string }> = {
        connected: {
            color: 'success.main',
            animation: `${pulseGreen} 3s infinite`,
            text: 'Online',
            borderColor: '#4caf50'
        },
        disconnected: {
            color: 'error.main',
            animation: `${pulseRed} 2s infinite`,
            text: 'Offline',
            borderColor: '#f44336'
        },
        checking: {
            color: 'warning.main',
            animation: `${pulseOrange} 1.5s infinite`,
            text: 'Verificando...',
            borderColor: '#ed6c02'
        }
    }

    return propsMap[activeStatus] ?? {
        color: 'text.disabled',
        animation: 'none',
        text: '...',
        borderColor: 'transparent'
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