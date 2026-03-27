import { getStatusProps, StatusContainer, Indicator, StatusText } from './styles'

import type { ServerStatusIndicatorProps } from './types'

export const ServerStatusIndicator = ({ status, isChecking, showText = true }: ServerStatusIndicatorProps) => {
    const props = getStatusProps(status, isChecking)

    return (
        <StatusContainer>
            <Indicator statuscolor={props.color} statusanimation={props.animation} statusbordercolor={props.borderColor} />
            {showText && <StatusText variant="caption">{props.text}</StatusText>}
        </StatusContainer>
    )
}