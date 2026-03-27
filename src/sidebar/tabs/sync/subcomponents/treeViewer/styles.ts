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
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.action.hover,
    minHeight: '48px'
}))

const LeftSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    overflow: 'hidden'
})

const RightSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    gap: '4px'
})

const SearchWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingRight: '8px'
})

const SearchInput = styled('input')({
    border: 'none',
    outline: 'none',
    flexGrow: 1,
    background: 'transparent',
    color: 'inherit',
    fontSize: '0.875rem',
    width: '100%'
})

const ScrollArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
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
    LeftSection,
    RightSection,
    SearchWrapper,
    SearchInput,
    ScrollArea
}

export default Styled