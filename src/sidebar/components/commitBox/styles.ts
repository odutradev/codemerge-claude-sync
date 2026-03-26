import { Paper, Box, Select, TextField, Button, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CommitPaper = styled(Paper)({
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16
});

export const HeaderBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});

export const TitleTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary
}));

export const ActionBox = styled(Box)({
    display: 'flex',
    gap: 4,
    alignItems: 'center'
});

export const StyledSelect = styled(Select)({
    height: 28,
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    marginRight: 4
});

export const StyledMenuItem = styled(MenuItem)({
    fontSize: '0.75rem',
    fontFamily: 'monospace'
});

export const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        fontSize: '0.85rem',
        fontFamily: 'monospace'
    }
});

export const StyledButton = styled(Button)({
    textTransform: 'none'
});