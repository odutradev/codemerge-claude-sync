import { styled } from '@mui/material/styles';
import { Box, Tab } from '@mui/material';

export const TabsContainer = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`
}));

export const StyledTab = styled(Tab)({
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: 'none'
});

export const IconTab = styled(Tab)({
    minWidth: 48,
    width: 48,
    padding: 0
});
