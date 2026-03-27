import { CircularProgress, Tooltip } from '@mui/material'

import { StyledIconButton, StyledButton } from './styles'

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
            size={size}
            color={displayColor}
            $pulse={pulse}
            disabled={loading || props.disabled}
            {...props}
        >
            {renderIcon()}
        </StyledIconButton>
    ) : (
        <StyledButton
            size={size}
            color={displayColor}
            variant={variant}
            $pulse={pulse}
            $isIconOnly={isIconOnly}
            disabled={loading || props.disabled}
            startIcon={children ? renderIcon() : undefined}
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