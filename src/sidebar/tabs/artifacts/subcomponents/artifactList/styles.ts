import { Box, Typography, Button, ListItem, Checkbox, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const LoadingContainer = styled(Box)({
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})

export const StyledPaper = styled(Paper)(({ theme }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    borderColor: theme.palette.divider
}))

export const HeaderBox = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
}))

export const ClearButton = styled(Button)(({ theme }) => ({
    fontSize: '0.7rem',
    minWidth: 'auto',
    padding: 0,
    textTransform: 'none',
    color: theme.palette.text.secondary,
    '&:hover': {
        color: theme.palette.error.main,
        backgroundColor: 'transparent'
    }
}))

export const StyledList = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    overflowY: 'auto',
    flexGrow: 1
}))

export const StyledListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(1),
    transition: 'all 0.2s',
    backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
}))

export const DeleteListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(1),
    transition: 'all 0.2s',
    backgroundColor: isSelected ? 'rgba(244, 67, 54, 0.08)' : 'rgba(244, 67, 54, 0.02)',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(244, 67, 54, 0.12)'
    }
}))

export const ItemContentBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    width: '100%'
})

export const DeleteCheckbox = styled(Checkbox)(({ theme }) => ({
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1.5),
    color: theme.palette.error.main,
    '&.Mui-checked': {
        color: theme.palette.error.main
    }
}))

export const StandardCheckbox = styled(Checkbox)(({ theme }) => ({
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1.5)
}))

export const IconWrapperBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isError'
})<{ isError?: boolean }>(({ theme, isError }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    color: isError ? theme.palette.error.main : theme.palette.text.secondary,
    width: 24,
    height: 24
}))

export const TextWrapperBox = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    minWidth: 0,
    marginRight: theme.spacing(2)
}))

export const DeleteText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    color: theme.palette.error.main,
    fontWeight: 500,
    textDecoration: isSelected ? 'line-through' : 'none'
}))

export const HeaderTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary
}))

export const DeleteIconWrapper = styled(Box)(({ theme }) => ({
    color: theme.palette.error.main,
    opacity: 0.7,
    fontSize: 16,
    display: 'flex'
}))

export const ArtifactNameText = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.text.primary
}))

export const ArtifactLinesText = styled(Typography)(({ theme }) => ({
    fontFamily: 'monospace',
    opacity: 0.7,
    color: theme.palette.text.secondary
}))