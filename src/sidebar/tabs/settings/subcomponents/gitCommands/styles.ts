import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const GitContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

export const HeaderText = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}));

export const LastSectionContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1)
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    display: 'block',
    color: theme.palette.text.secondary
}));

export const IconWrapper = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
}));