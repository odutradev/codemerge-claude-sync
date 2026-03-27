import { styled, keyframes } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

const pulseGreen = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const pulseRed = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); }
    100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
`;

export const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    justifyContent: 'space-between'
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center'
}));

export const HistoryBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    height: 36,
    flexShrink: 0
}));

export const StyledIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'hookStatus'
})<{ isActive: boolean; hookStatus?: 'idle' | 'loading' | 'success' | 'error' }>(({ theme, isActive, hookStatus = 'idle' }) => {
    const isSuccess = hookStatus === 'success';
    const isError = hookStatus === 'error';

    return {
        border: '1px solid',
        borderColor: isSuccess ? theme.palette.success.main : isError ? theme.palette.error.main : isActive ? theme.palette.primary.main : theme.palette.divider,
        borderRadius: theme.shape.borderRadius * 2,
        width: 36,
        height: 36,
        flexShrink: 0,
        animation: isSuccess ? `${pulseGreen} 1s infinite` : isError ? `${pulseRed} 1s infinite` : 'none',
        color: isSuccess ? theme.palette.success.main : isError ? theme.palette.error.main : 'inherit',
        transition: 'all 0.3s ease'
    };
});

export const PageIndicator = styled('span')(({ theme }) => ({
    minWidth: 28,
    textAlign: 'center',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    fontSize: '0.75rem'
}));

export const FetchButton = styled('button')(({ theme }) => ({
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'transparent',
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    cursor: 'pointer',
    color: theme.palette.text.primary,
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
    }
}));