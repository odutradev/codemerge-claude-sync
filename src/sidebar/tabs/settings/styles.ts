import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SettingsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden'
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}));

export const VersionText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    display: 'block',
    textAlign: 'center',
    marginTop: theme.spacing(4)
}));