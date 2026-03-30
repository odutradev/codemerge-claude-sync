import { Paper, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SectionContainer = styled(Paper, { shouldForwardProp: (prop) => prop !== '$borderColor' })<{ $borderColor?: string }>(({ theme, $borderColor }) => {
    const resolveColor = (path: string) => {
        if (!path) return theme.palette.divider
        const parts = path.split('.')
        if (parts.length === 2) {
            const paletteGroup = theme.palette[parts[0] as keyof typeof theme.palette] as Record<string, string>
            return paletteGroup ? paletteGroup[parts[1]] : path
        }
        return path
    }

    return {
        borderColor: $borderColor ? resolveColor($borderColor) : theme.palette.divider,
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2)
    }
})

export const SectionHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(1.5)
}))

export const IconWrapper = styled('span', { shouldForwardProp: (prop) => prop !== '$color' })<{ $color?: string }>(({ theme, $color }) => {
    const resolveColor = (path: string) => {
        if (!path) return theme.palette.primary.main
        const parts = path.split('.')
        if (parts.length === 2) {
            const paletteGroup = theme.palette[parts[0] as keyof typeof theme.palette] as Record<string, string>
            return paletteGroup ? paletteGroup[parts[1]] : path
        }
        return path
    }

    return {
        color: resolveColor($color ?? ''),
        alignItems: 'center',
        display: 'flex'
    }
})

export const TitleContainer = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 600,
    flex: 1
}))

export const InfoWrapper = styled('span')(({ theme }) => ({
    color: theme.palette.text.secondary,
    alignItems: 'center',
    display: 'flex',
    cursor: 'help',
    '&:hover': {
        color: theme.palette.text.primary
    }
}))