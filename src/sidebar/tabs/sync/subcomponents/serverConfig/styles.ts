import type { SxProps, Theme } from '@mui/material';

export const boxStyles: SxProps<Theme> = { mb: 2 };
export const inputStyles = (animation: string, borderColor: string): SxProps<Theme> => ({ '& .MuiOutlinedInput-root': { animation, '& fieldset': { borderColor } } });