import type { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = { display: 'flex', flexDirection: 'column', height: '100%', p: 2, bgcolor: 'background.default', overflow: 'hidden' };
export const scrollableStyles: SxProps<Theme> = { flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', pr: 0.5, mr: -0.5, pb: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'action.hover', borderRadius: '4px' } };