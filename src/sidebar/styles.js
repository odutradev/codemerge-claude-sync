import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const AppContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary
}));