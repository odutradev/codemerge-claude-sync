import { alpha, styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

const Container = styled(Paper)(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    marginBottom: theme.spacing(2)
}))

const Header = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.action.hover
}))

const SearchInput = styled('input')({
    border: 'none',
    outline: 'none',
    flexGrow: 1,
    background: 'transparent',
    color: 'inherit',
    fontSize: '0.875rem'
})

const ScrollArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px'
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: alpha(theme.palette.text.primary, 0.1),
        borderRadius: '3px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: alpha(theme.palette.text.primary, 0.2)
    }
}))

const Styled = {
    Container,
    Header,
    SearchInput,
    ScrollArea
}

export default Styled