import { Box, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ColorListContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    flexWrap: 'wrap'
}))

export const ColorOption = styled(Box, { shouldForwardProp: (prop) => prop !== '$isSelected' && prop !== '$colorValue' })<{ $isSelected: boolean; $colorValue: string }>(({ $isSelected, $colorValue }) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: $colorValue,
    cursor: 'pointer',
    border: $isSelected ? '2px solid white' : '2px solid transparent',
    outline: $isSelected ? `2px solid ${$colorValue}` : 'none',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)'
    }
}))

export const PickerContainer = styled(Box)({
    position: 'relative'
})

export const PickerButton = styled(IconButton)(({ theme }) => ({
    width: 32,
    height: 32,
    border: `1px solid ${theme.palette.divider}`,
    padding: 0
}))

export const ColorIconWrapper = styled('span', { shouldForwardProp: (prop) => prop !== '$customColor' })<{ $customColor: string }>(({ $customColor }) => ({
    color: $customColor,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
}))

export const HiddenInput = styled('input')({
    position: 'absolute',
    cursor: 'pointer',
    height: '100%',
    width: '100%',
    opacity: 0,
    left: 0,
    top: 0
})