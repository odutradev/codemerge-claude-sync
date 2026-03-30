import { CircularProgress, Tooltip } from '@mui/material'

import { StyledButton, StyledIconButton } from './styles'

import type { ActionButtonProps, ButtonColor } from './types'

const ActionButton = ({ icon, tooltip, children, loading = false, pulse = 'none', variant = 'contained', size = 'small', color = 'primary', ...props }: ActionButtonProps) => {
    const isIconVariant = variant === 'icon'
    const displayColor = (color === 'default' ? 'inherit' : color) as Exclude<ButtonColor, 'default'>
    const isIconOnly = !children && !!icon

    const renderIcon = () => {
        if (loading) return <CircularProgress size={16} color="inherit" />
        return icon
    }

    const buttonElement = isIconVariant ? (
        <StyledIconButton
            color={displayColor}
            $pulse={pulse}
            disabled={loading || props.disabled}
            size={size}
            {...props}
        >
            {renderIcon()}
        </StyledIconButton>
    ) : (
        <StyledButton
            $isIconOnly={isIconOnly}
            color={displayColor}
            variant={variant}
            $pulse={pulse}
            disabled={loading || props.disabled}
            startIcon={children ? renderIcon() : undefined}
            size={size}
            {...props}
        >
            {!children && !isIconVariant ? renderIcon() : children}
        </StyledButton>
    )

    if (!tooltip) return buttonElement

    return (
        <Tooltip title={tooltip}>
            <span>{buttonElement}</span>
        </Tooltip>
    )
}

export default ActionButton