import { Box, Typography, TextField, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

const Container = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}))

const Label = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary
}))

const InputRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1)
}))

const AnimatedTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        animation: 'var(--status-animation)',
        '& fieldset': {
            borderColor: 'var(--status-border-color)'
        }
    }
})

const ActionButton = styled(Button)(({ theme }) => ({
    minWidth: 'auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
}))

const Styled = {
    Container,
    Label,
    InputRow,
    AnimatedTextField,
    ActionButton
}

export default Styled