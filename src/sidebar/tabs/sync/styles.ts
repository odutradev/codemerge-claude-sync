import { Box, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
}))

const HeaderRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
}))

const RefreshButton = styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(1)
}))

const Styled = {
    Container,
    HeaderRow,
    RefreshButton
}

export default Styled