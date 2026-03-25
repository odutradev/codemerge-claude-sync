import { alpha } from '@mui/material/styles';

export const paperStyles = { p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, mb: 2 };
export const headerBoxStyles = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
export const listStyles = (theme) => ({ p: 0, maxHeight: 220, overflowY: 'auto', mt: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.text.primary, 0.1), borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.2) } });
export const listItemStyles = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } };
export const itemHeaderStyles = { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mb: 0.5 };
export const actionsBoxStyles = { display: 'flex', gap: 0.5 };
export const promptTextStyles = { width: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-word', opacity: 0.8, fontSize: '0.8rem', fontFamily: 'monospace', p: 1, bgcolor: 'action.hover', borderRadius: 1 };