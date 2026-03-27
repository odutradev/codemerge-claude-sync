import { styled } from '@mui/material/styles'
import { Alert } from '@mui/material'

export const StyledAlert = styled(Alert)(({ theme }) => ({
    borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 8,
    width: '100%'
}))