import { DialogTitle, DialogActions, Dialog, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        borderRadius: 12
    }
});

export const StyledDialogTitle = styled(DialogTitle)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8
});

export const TitleContent = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 8
});

export const IconWrapper = styled(Box)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: 24,
    display: 'flex'
}));

export const LoaderContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    padding: 32
});

export const InfoGrid = styled(Box)({
    marginBottom: 16,
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
});

export const CodeBox = styled(Box)({
    padding: 16,
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    overflow: 'auto',
    maxHeight: 400,
    whiteSpace: 'pre-wrap'
});

export const StyledDialogActions = styled(DialogActions)({
    padding: '16px 24px'
});

export const CommandText = styled(Typography)(({ theme }) => ({
    fontFamily: 'monospace',
    backgroundColor: theme.palette.action.hover,
    padding: '0 8px',
    borderRadius: 4
}));