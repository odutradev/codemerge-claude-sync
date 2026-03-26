import { keyframes } from '@mui/material/styles';

import type { SxProps, Theme } from '@mui/material';
import type { HookStatus } from '@/sidebar/types';

const pulseGreen = keyframes`0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); } 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }`;
const pulseRed = keyframes`0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }`;

export const containerStyles: SxProps<Theme> = { display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, justifyContent: 'space-between' };
export const actionsContainerStyles: SxProps<Theme> = { display: 'flex', gap: 1, alignItems: 'center' };
export const historyBoxStyles: SxProps<Theme> = { display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 0.5, height: 36, flexShrink: 0 };
export const iconButtonStyles = (isActive: boolean, hookStatus: HookStatus = 'idle'): SxProps<Theme> => {
    const isSuccess = hookStatus === 'success'; const isError = hookStatus === 'error';
    return { border: '1px solid', borderColor: isSuccess ? 'success.main' : isError ? 'error.main' : isActive ? 'primary.main' : 'divider', borderRadius: 2, width: 36, height: 36, flexShrink: 0, animation: isSuccess ? `${pulseGreen} 1s infinite` : isError ? `${pulseRed} 1s infinite` : 'none', color: isSuccess ? 'success.main' : isError ? 'error.main' : 'inherit', transition: 'all 0.3s ease' };
};