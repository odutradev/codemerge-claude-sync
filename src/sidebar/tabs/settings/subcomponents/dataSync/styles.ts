import { Paper, Box, Typography, TextField, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SyncContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

export const HeaderText = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3)
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

export const ActionContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

export const IntervalInput = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));