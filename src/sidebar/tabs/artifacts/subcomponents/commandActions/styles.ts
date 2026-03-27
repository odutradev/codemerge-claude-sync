import { styled } from '@mui/material/styles';
import { Box, Typography, Button, ListItem, Checkbox, Paper } from '@mui/material';

export const CommandBox = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    borderColor: theme.palette.divider
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(2, 136, 209, 0.05)' : 'rgba(2, 136, 209, 0.05)'
}));

export const StyledList = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    maxHeight: 150,
    overflowY: 'auto'
}));

export const StyledListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(1),
    transition: 'all 0.2s',
    backgroundColor: isSelected ? 'rgba(2, 136, 209, 0.08)' : 'rgba(2, 136, 209, 0.02)',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(2, 136, 209, 0.12)'
    }
}));

export const ItemContentBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    width: '100%'
});

export const CommandCheckbox = styled(Checkbox)(({ theme }) => ({
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1.5),
    color: theme.palette.info.main,
    '&.Mui-checked': {
        color: theme.palette.info.main
    }
}));

export const TextWrapperBox = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    minWidth: 0,
    marginRight: theme.spacing(2)
}));

export const ExecuteButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 2
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.info.main
}));

export const CommandText = styled(Typography)(({ theme }) => ({
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: theme.palette.text.primary
}));
