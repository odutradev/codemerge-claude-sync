import { Paper, Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AppearanceContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

export const HeaderText = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    display: 'block',
    color: theme.palette.text.secondary
}));

export const IconWrapper = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
}));

export const ColorListContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    flexWrap: 'wrap'
}));

export const ColorOption = styled(Box, { shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'colorValue' })<{ isSelected: boolean; colorValue: string }>(({ isSelected, colorValue }) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: colorValue,
    cursor: 'pointer',
    border: isSelected ? '2px solid white' : '2px solid transparent',
    outline: isSelected ? `2px solid ${colorValue}` : 'none',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)'
    }
}));

export const PickerContainer = styled(Box)({
    position: 'relative'
});

export const PickerButton = styled(IconButton)(({ theme }) => ({
    width: 32,
    height: 32,
    border: `1px solid ${theme.palette.divider}`,
    padding: 0
}));

export const ColorIconWrapper = styled('span', { shouldForwardProp: (prop) => prop !== 'customColor' })<{ customColor: string }>(({ customColor }) => ({
    color: customColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

export const HiddenInput = styled('input')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
});