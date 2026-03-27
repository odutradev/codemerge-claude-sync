import type { Theme } from '@mui/material';

export const paperStyles = {
    flexGrow: 1,
    overflow: 'hidden',
    mb: 2,
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.paper',
    borderRadius: 2,
    borderColor: 'divider'
};

export const headerBoxStyles = (theme: Theme) => ({
    px: 2,
    py: 1.5,
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
});

export const clearBtnStyles = {
    fontSize: '0.7rem',
    minWidth: 'auto',
    p: 0,
    textTransform: 'none',
    color: 'text.secondary',
    '&:hover': {
        color: 'error.main',
        bgcolor: 'transparent'
    }
};

export const listItemStyles = (isSelected: boolean) => (theme: Theme) => ({
    borderRadius: 1.5,
    mb: 0.5,
    p: 1,
    transition: 'all 0.2s',
    bgcolor: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
    '&:hover': {
        bgcolor: 'rgba(0, 0, 0, 0.08)'
    }
});

export const deleteListItemStyles = (isSelected: boolean) => (theme: Theme) => ({
    borderRadius: 1.5,
    mb: 0.5,
    p: 1,
    transition: 'all 0.2s',
    bgcolor: isSelected ? 'rgba(244, 67, 54, 0.08)' : 'rgba(244, 67, 54, 0.02)',
    '&:hover': {
        bgcolor: 'rgba(244, 67, 54, 0.12)'
    }
});

export const emptyBoxStyles = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    gap: 1
};