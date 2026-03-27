import { Box, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const Container = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider
}))

const LayoutRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
})

const MetricsGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2)
}))

const MetricItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5)
}))

const MetricValue = styled(Typography)({
    fontWeight: 500
})

const Styled = {
    Container,
    LayoutRow,
    MetricsGroup,
    MetricItem,
    MetricValue
}

export default Styled