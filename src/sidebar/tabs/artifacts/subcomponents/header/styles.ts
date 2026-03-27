import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    justifyContent: 'space-between'
}))

export const ActionsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center'
}))

export const HistoryBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    height: 36,
    flexShrink: 0
}))

export const PageIndicator = styled('span')(({ theme }) => ({
    minWidth: 28,
    textAlign: 'center',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    fontSize: '0.75rem'
}))