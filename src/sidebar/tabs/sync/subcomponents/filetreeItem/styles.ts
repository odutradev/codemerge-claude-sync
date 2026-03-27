import { alpha, styled } from '@mui/material/styles'
import { Box, Typography, IconButton, Checkbox } from '@mui/material'

const ItemContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&[data-selected="true"]': {
        backgroundColor: alpha(theme.palette.primary.main, 0.15)
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    },
    '&:hover .star-btn': {
        opacity: 1
    }
}))

const ActionButton = styled(IconButton)({
    padding: '4px',
    marginRight: '4px'
})

const StyledCheckbox = styled(Checkbox)({
    padding: '4px',
    '& .MuiSvgIcon-root': {
        fontSize: 'var(--icon-size)'
    }
})

const InfoWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px',
    overflow: 'hidden',
    flexGrow: 1
})

const EmptySpace = styled(Box)({
    width: '24px',
    marginRight: '4px'
})

const FileName = styled(Typography)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
})

const StarButton = styled(IconButton)({
    padding: '2px',
    marginLeft: '8px',
    transition: 'opacity 0.2s',
    '&[data-pinned="true"]': {
        opacity: 1
    }
})

const Styled = {
    ItemContainer,
    ActionButton,
    StyledCheckbox,
    InfoWrapper,
    EmptySpace,
    FileName,
    StarButton
}

export default Styled