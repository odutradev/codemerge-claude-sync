import type { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = { display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.default', overflowY: 'auto', overflowX: 'hidden' };
export const titleStyles: SxProps<Theme> = { mb: 2, color: 'primary.main' };