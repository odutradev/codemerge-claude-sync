import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
}))

const Styled = {
    Container
}

export default Styled