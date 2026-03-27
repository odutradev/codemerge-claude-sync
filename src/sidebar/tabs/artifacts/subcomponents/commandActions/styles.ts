import type { Theme } from '@mui/material';

export const paperStyles = {
    mb: 1,
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
    bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 136, 209, 0.05)' : 'rgba(2, 136, 209, 0.05)'
});

export const listItemStyles = (isSelected: boolean) => (theme: Theme) => ({
    borderRadius: 1.5,
    mb: 0.5,
    p: 1,
    transition: 'all 0.2s',
    bgcolor: isSelected ? 'rgba(2, 136, 209, 0.08)' : 'rgba(2, 136, 209, 0.02)',
    '&:hover': {
        bgcolor: 'rgba(2, 136, 209, 0.12)'
    }
});