import { Typography } from '@mui/material'

import { Container, IconWrapper } from './styles'

import type { EmptyStateProps } from './types'

const EmptyState = ({ message, icon }: EmptyStateProps) => {
    return (
        <Container>
            <IconWrapper>
                {icon}
            </IconWrapper>
            <Typography variant="body2" color="text.secondary" align="center">
                {message}
            </Typography>
        </Container>
    )
}

export default EmptyState