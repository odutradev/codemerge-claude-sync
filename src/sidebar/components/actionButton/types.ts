import type { ReactNode } from 'react'

export type PulseType = 'success' | 'error' | 'warning' | 'primary' | 'none'
export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'icon'
export type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default'

export interface ActionButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    pulse?: PulseType
    variant?: ButtonVariant
    color?: ButtonColor
    size?: 'small' | 'medium' | 'large'
    fullWidth?: boolean
    disabled?: boolean
    loading?: boolean
    tooltip?: string
    icon?: ReactNode
    children?: ReactNode
}

export interface StyledProps {
    $pulse: PulseType
}