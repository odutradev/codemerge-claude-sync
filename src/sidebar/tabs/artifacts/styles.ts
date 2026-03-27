import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden'
}));

export const HeaderWrapper = styled(Box)({
    flexShrink: 0
});

export const ScrollableContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(0.5),
    marginRight: theme.spacing(-0.5),
    paddingBottom: theme.spacing(1),
    '&::-webkit-scrollbar': {
        width: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.action.hover,
        borderRadius: '4px'
    }
}));

export const CommitWrapper = styled(Box)(({ theme }) => ({
    flexShrink: 0,
    marginBottom: theme.spacing(2)
}));

export const CommandWrapper = styled(Box)({
    flexShrink: 0
});

export const ListWrapper = styled(Box)({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 250
});