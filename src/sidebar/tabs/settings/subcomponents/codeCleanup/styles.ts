import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CleanupContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

export const HeaderText = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main
}));

export const IconWrapper = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
}));

export const ToggleContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));

export const OptionsContainer = styled(Box, { shouldForwardProp: (prop) => prop !== 'isActive' })<{ isActive: boolean }>(({ isActive }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    opacity: isActive ? 1 : 0.5,
    pointerEvents: isActive ? 'auto' : 'none'
}));